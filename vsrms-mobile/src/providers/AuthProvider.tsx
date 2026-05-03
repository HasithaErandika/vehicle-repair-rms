// src/providers/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { StorageService } from '@/services/storage.service';
import { syncProfile, getMe, register as apiRegister } from '@/features/auth/api/auth.api';
import { User, RegisterPayload } from '@/features/auth/types/auth.types';
import {
  initiateAuthFlow,
  submitCredentials,
  exchangeCodeForToken,
} from '@/services/asgardeo-native.service';

// ─── Context type ─────────────────────────────────────────────────────────────
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  bypassLogin: (role: 'admin' | 'workshop_owner' | 'workshop_staff' | 'customer') => void;
  register: (payload: RegisterPayload) => Promise<void>;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]         = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);
  const qc = useQueryClient();

  //--─ Registration ─────────────────────────────────────────────────────────────
  const register = async (payload: RegisterPayload) => {
    setLoading(true);
    try {
      await apiRegister(payload);
    } catch (err) {
      console.error('[AuthProvider] Registration error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ── Login with email/password ───────────────────────────────────────────────

  const loginWithCredentials = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { flowId, authenticatorId, codeVerifier } = await initiateAuthFlow();

      let code: string;

      if (authenticatorId === '__SUCCESS_COMPLETED__') {
        throw new Error(
          'An active session was detected. Please sign out of any existing session and try again.'
        );
      }

      code = await submitCredentials(flowId, authenticatorId, email, password);

      const { access_token, id_token } = await exchangeCodeForToken(code, codeVerifier);
      const tokenForBackend = id_token ?? access_token;

      await signIn(tokenForBackend);
    } catch (err) {
      console.error('[AuthProvider] Login error:', err);
      setLoading(false);
      throw err;
    }
  };

  
  // ── Restore session on app launch ─────────────────────────────────────────
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
        setLoading(false);
      }
    })();
  }, []);

  // ── Store token + sync MongoDB user profile ────────────────────────────────
  const signIn = async (token: string) => {
    setLoading(true);
    try {
      await StorageService.setToken(token);
      const userData = await syncProfile();
      setUser(userData);
    } catch (err) {
      await StorageService.removeToken();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ── Sign out ───────────────────────────────────────────────────────────────
  const signOut = async () => {
    await StorageService.removeToken();
    qc.clear();
    setUser(null);
  };

  // ── Development bypass ─────────────────────────────────────────────────────
  const bypassLogin = async (
    role: 'admin' | 'workshop_owner' | 'workshop_staff' | 'customer',
  ) => {
    setLoading(true);
    await StorageService.setToken(`mock-${role}`);
    setUser({
      id:         `mock-${role}`,
      email:      `${role}@bypass.com`,
      fullName:   `${role.charAt(0).toUpperCase() + role.slice(1)} Bypass`,
      role,
      workshopId: ['workshop_owner', 'workshop_staff'].includes(role)
        ? '607f1f77bcf86cd799439012'
        : undefined,
    } as any);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signIn, signOut, loginWithCredentials, register, bypassLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
}