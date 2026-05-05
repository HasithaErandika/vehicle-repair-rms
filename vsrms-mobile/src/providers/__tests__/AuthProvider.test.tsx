import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../AuthProvider';
import { StorageService } from '@/services/storage.service';
import { getMe, syncProfile } from '@/features/auth/api/auth.api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock dependencies
jest.mock('@/services/storage.service');
jest.mock('@/features/auth/api/auth.api');
jest.mock('@tanstack/react-query', () => {
  const actual = jest.requireActual('@tanstack/react-query');
  return {
    ...actual,
    useQueryClient: () => ({
      clear: jest.fn(),
    }),
  };
});

const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('restores user from storage on mount', async () => {
    const mockUser = { id: '1', fullName: 'Test User' };
    (StorageService.getToken as jest.Mock).mockResolvedValue('fake-token');
    (getMe as jest.Mock).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.user).toEqual(mockUser);
  });

  it('handles sign in correctly', async () => {
    const mockUser = { id: '1', fullName: 'Test User' };
    (syncProfile as jest.Mock).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signIn('new-token');
    });

    expect(StorageService.setToken).toHaveBeenCalledWith('new-token');
    expect(result.current.user).toEqual(mockUser);
  });

  it('handles sign out correctly', async () => {
    (StorageService.getToken as jest.Mock).mockResolvedValue(null);
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Force set a user first to test clearing it
    await act(async () => {
       result.current.signIn('some-token');
    });

    await act(async () => {
      await result.current.signOut();
    });

    expect(StorageService.removeToken).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
  });

  it('throws error when useAuth is used outside provider', () => {
    expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used within AuthProvider');
  });
});
