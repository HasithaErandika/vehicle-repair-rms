import * as SecureStore from 'expo-secure-store';

export const StorageService = {
  async setToken(token: string) {
    try {
      await SecureStore.setItemAsync('auth_token', token);
    } catch (e) {
      console.error('Error saving token', e);
    }
  },
  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync('auth_token');
    } catch (e) {
      console.error('Error reading token', e);
      return null;
    }
  },
  async removeToken() {
    try {
      await SecureStore.deleteItemAsync('auth_token');
    } catch (e) {
      console.error('Error removing token', e);
    }
  },
};
