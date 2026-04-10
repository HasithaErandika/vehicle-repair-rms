import client from '@/services/http.client';
import { User, LoginPayload, RegisterPayload, AuthResponse } from '../types/auth.types';

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await client.post('/auth/login', payload);
  return data;
};

export const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const { data } = await client.post('/auth/register', payload);
  return data;
};

export const syncProfile = async (): Promise<User> => {
  const { data } = await client.post('/auth/sync-profile');
  return data.data || data;
};

export const getMe = async (): Promise<User> => {
  const { data } = await client.get('/auth/me');
  return data.data || data;
};

export const updateMe = async (payload: Partial<User>): Promise<User> => {
  const { data } = await client.put('/auth/me', payload);
  return data.data || data;
};
