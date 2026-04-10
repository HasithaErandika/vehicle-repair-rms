import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

/**
 * Re-exports the professionally structured tabs or provides a wrapper
 */
export { default as TabsLayout } from '@/app/tabs/_layout';

export function TabBar({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.container}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingBottom: 20,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
}));
