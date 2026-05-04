import React, { createContext, useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

const ICONS: Record<ToastType, string> = {
  success: 'checkmark-circle',
  error: 'alert-circle',
  info: 'information-circle',
};

const COLORS: Record<ToastType, string> = {
  success: '#10B981',
  error: '#EF4444',
  info: '#3B82F6',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToast({ message, type });
    // Auto-dismiss after 4 seconds
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Animated.View 
          entering={FadeInUp.springify().damping(15)} 
          exiting={FadeOutUp}
          style={styles.wrapper}
        >
          <BlurView intensity={80} tint="dark" style={styles.container}>
            <View style={[styles.indicator, { backgroundColor: COLORS[toast.type] }]} />
            <Ionicons name={ICONS[toast.type] as any} size={24} color={COLORS[toast.type]} />
            <Text style={styles.text}>{toast.message}</Text>
            <Pressable onPress={() => setToast(null)} style={styles.closeBtn}>
              <Ionicons name="close" size={18} color="#9CA3AF" />
            </Pressable>
          </BlurView>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 9999,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 12,
  },
  indicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
  },
  text: {
    flex: 1,
    color: '#F9FAFB',
    fontSize: 14,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  }
});
