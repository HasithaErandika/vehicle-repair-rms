import React, { createContext, useContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

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

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
           <View style={[styles.container, styles[toast.type]]}>
             <Text style={styles.text}>{toast.message}</Text>
           </View>
        </View>
      )}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    boxShadow: [{
      offsetX: 0,
      offsetY: 2,
      blurRadius: 3.84,
      color: 'rgba(0,0,0,0.25)',
    }],
    elevation: 5,
  },
  success: { backgroundColor: '#10B981' },
  error: { backgroundColor: '#EF4444' },
  info: { backgroundColor: '#3B82F6' },
  text: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
});
