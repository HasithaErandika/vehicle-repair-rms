import React, { createContext, useContext, useEffect, useState } from 'react';
import { StorageService } from '@/services/storage.service';
import { getMe, syncProfile } from '@/features/auth/api/auth.api';
import { User } from '@/features/auth/types/auth.types';

interface AuthContextType {
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  mockSignIn: (role: 'customer' | 'workshop_owner' | 'workshop_staff' | 'admin') => void;
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkUser = async () => {
    try {
      const token = await StorageService.getToken();
      if (token) {
        // Sync profile to ensure MongoDB has the user and get back the internal User object
        const userData = await getMe();
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to restore session', error);
      // If unauthorized, clear token
      await StorageService.removeToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const signIn = async (token: string) => {
    setIsLoading(true);
    try {
      await StorageService.setToken(token);
      // After sign in, sync with backend to get the user record
      const userData = await syncProfile();
      setUser(userData);
    } catch (error) {
      console.error('Sign in sync failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const mockSignIn = (role: 'customer' | 'workshop_owner' | 'workshop_staff' | 'admin') => {
    const mockUser: User = {
      id: 'mock-id-' + role,
      email: `${role}@mock.com`,
      fullName: `Mock ${role.replace('_', ' ')}`,
      role: role,
    };
    setUser(mockUser);
  };

  const signOut = async () => {
    try {
      await StorageService.removeToken();
      setUser(null);
    } catch (error) {
      console.error('Sign out error', error);
    }
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut, mockSignIn, user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
