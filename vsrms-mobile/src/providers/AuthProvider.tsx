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
    } catch (err: any) {
      console.error('[AuthProvider] Registration error:', err);
      // Re-throw with the message the HTTP interceptor already extracted
      const msg = err?.message || 'Registration failed. Please try again.';
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Login with email/password ───────────────────────────────────────────────

  const loginWithCredentials = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { flowId, authenticatorId, codeVerifier } = await initiateAuthFlow();

      if (authenticatorId === '__SUCCESS_COMPLETED__') {
        throw new Error(
          'An active session was detected. Please sign out of any existing session and try again.'
        );
      }

      const code = await submitCredentials(flowId, authenticatorId, email, password);

      const { access_token, id_token } = await exchangeCodeForToken(code, codeVerifier);
      const tokenForBackend = id_token ?? access_token;

      await signIn(tokenForBackend);
    } catch (err: any) {
      console.error('[AuthProvider] Login error:', err);
      setLoading(false);
      // Map known error patterns to friendlier messages for the user
      const raw: string = err?.message ?? '';
      let friendly = raw;
      if (raw.includes('callback.not.match')) {
        friendly = 'Login is temporarily unavailable due to a configuration issue. Please contact support.';
      } else if (raw.includes('invalid_grant') || raw.includes('Incorrect email or password')) {
        friendly = 'Incorrect email or password. Please try again.';
      } else if (!friendly) {
        friendly = 'Unable to sign in. Please check your connection and try again.';
      }
      throw new Error(friendly);
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

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signIn, signOut, loginWithCredentials, register }}
    >
      {children}
    </AuthContext.Provider>
  );
}