import React from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'muted';
}

export function Badge({ label, variant = 'primary' }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[variant]]}>
      <Text style={[styles.text, styles[`${variant}Text`]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: theme.radii.full,
    alignSelf: 'flex-start',
  },
  primary: { backgroundColor: theme.colors.brandSoft },
  success: { backgroundColor: theme.colors.successBackground },
  warning: { backgroundColor: '#FEF3C7' },
  error: { backgroundColor: theme.colors.errorBackground },
  muted: { backgroundColor: theme.colors.background },
  text: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  primaryText: { color: theme.colors.brand },
  successText: { color: theme.colors.successText },
  warningText: { color: '#D97706' },
  errorText: { color: theme.colors.error },
  mutedText: { color: theme.colors.muted },
}));
