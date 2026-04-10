import { useAuth as useAuthCore } from '@/providers/AuthProvider';
export const useAuth = useAuthCore;

import { useToast as useToastCore } from '@/providers/ToastProvider';
export const useToast = useToastCore;

import { useState, useEffect } from 'react';
// import NetInfo from '@react-native-community/netinfo';

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  useEffect(() => {
    // Stubbed since @react-native-community/netinfo is missing/failed to install
    setIsConnected(true);
    return () => {};
  }, []);

  return isConnected;
}

import { AppState, AppStateStatus } from 'react-native';

export function useAppState() {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      setAppState(nextAppState);
    });
    return () => subscription.remove();
  }, []);

  return appState;
}
