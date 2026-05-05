import React from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'muted';
}

export function Badge({ label, variant = 'primary' }: BadgeProps) {
  const textStyle = styles[`${variant}Text` as keyof typeof styles] as any;
  return (
    <View style={[styles.badge, styles[variant]]}>
      <Text style={[styles.text, textStyle]}>{label}</Text>
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
  warning: { backgroundColor: theme.colors.warningBackground },
  error: { backgroundColor: theme.colors.errorBackground },
  muted: { backgroundColor: theme.colors.borderLight },
  text: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  primaryText: { color: theme.colors.brand },
  successText: { color: theme.colors.successText },
  warningText: { color: theme.colors.warningText },
  errorText: { color: theme.colors.errorText },
  mutedText: { color: theme.colors.muted },
}));
