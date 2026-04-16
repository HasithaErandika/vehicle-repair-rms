import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { StorageService } from '@/services/storage.service';
import { login as apiLogin, syncProfile, getMe } from '@/features/auth/api/auth.api';
import { User, LoginPayload } from '@/features/auth/types/auth.types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  bypassLogin: (role: 'admin' | 'workshop_owner' | 'workshop_staff' | 'customer') => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const qc = useQueryClient();

  useEffect(() => {
    (async () => {
      try {
        const token = await StorageService.getToken();
        if (token) {
          const userData = await getMe();
          setUser(userData);
        }
      } catch {
        await StorageService.removeToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const signIn = async (token: string) => {
    setIsLoading(true);
    try {
      await StorageService.setToken(token);
      const userData = await syncProfile();
      setUser(userData);
    } catch (err) {
      await StorageService.removeToken();
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (payload: LoginPayload) => {
    const res = await apiLogin(payload);
    await signIn(res.access_token);
  };

  const signOut = async () => {
    await StorageService.removeToken();
    qc.clear();
    setUser(null);
  };

  const bypassLogin = async (role: 'admin' | 'workshop_owner' | 'workshop_staff' | 'customer') => {
    setIsLoading(true);
    try {
      await StorageService.setToken(`mock-${role}`);
      const userData = await getMe();
      setUser(userData);
    } catch (err) {
      console.error('[AuthProvider] Bypass login failed:', err);
      await StorageService.removeToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut, login, bypassLogin }}>
      {children}
    </AuthContext.Provider>
  );
}
