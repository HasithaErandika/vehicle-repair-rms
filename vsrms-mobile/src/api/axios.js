import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Replace with your live Render URL after deployment
export const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor — attach JWT from SecureStore ────────────────────────
api.interceptors.request.use(
  async (config) => {
    try {
      // Key must match what AuthContext stores: 'asgardeo_access_token'
      const token = await SecureStore.getItemAsync('asgardeo_access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error('[api] Could not read token from SecureStore:', err);
    }
    return config;
  },
  (err) => Promise.reject(err),
);

// ── Response interceptor — normalize errors ───────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error ||
      err.response?.data?.message ||
      'Network error — please try again';
    return Promise.reject(new Error(message));
  },
);

export default api;
