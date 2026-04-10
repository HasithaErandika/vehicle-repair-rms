import axios, { AxiosError } from 'axios';
import { StorageService } from './storage.service';

const client = axios.create({ 
  baseURL: process.env.EXPO_PUBLIC_API_URL, 
  timeout: 15000 
});

export const normaliseError = (error: any) => {
  if (axios.isAxiosError(error)) {
    return new Error(error.response?.data?.message || error.message);
  }
  return new Error('An unexpected error occurred');
};

async function refreshToken() {
  console.log('[Auth] Refreshing token via Asgardeo...');
  // Logic to refresh token via Asgardeo OAuth server will go here
  // const newToken = "received_token";
  // await StorageService.setToken(newToken);
  return true;
}

client.interceptors.request.use(async (config) => {
  const token = await StorageService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await refreshToken();
      return client(error.config);
    }
    return Promise.reject(normaliseError(error));
  }
);

export default client;
