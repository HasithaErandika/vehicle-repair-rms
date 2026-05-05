import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CloudOff, RefreshCw } from 'lucide-react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

interface ErrorScreenProps {
  onRetry: () => void;
  message?: string;
  variant?: 'inline' | 'full';
}

export function ErrorScreen({
  onRetry,
  message = 'Something went wrong. Please check your connection.',
  variant = 'inline',
}: ErrorScreenProps) {
  const { theme } = useUnistyles();

  return (
    <View style={[styles.container, variant === 'inline' && styles.inlineContainer]}>
      <View style={styles.iconBox}>
        <CloudOff size={32} color={theme.colors.error} strokeWidth={2.5} />
      </View>
      <Text style={styles.title}>Unable to load</Text>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => onRetry()} 
        activeOpacity={0.85}
        accessibilityLabel="Retry loading data"
        accessibilityRole="button"
      >
        <RefreshCw size={16} color={theme.colors.white} strokeWidth={3} />
        <Text style={styles.buttonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: theme.colors.background, 
    paddingHorizontal: theme.spacing.xl,
  },
  inlineContainer: {
    backgroundColor: 'transparent',
    paddingVertical: 40,
  },
  iconBox: {
    width: 64, 
    height: 64, 
    borderRadius: 20,
    backgroundColor: theme.colors.errorBackground,
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1.5, 
    borderColor: theme.colors.error + '33', // Use 20% opacity of error color
  },
  title: {
    fontSize: theme.fonts.sizes.title,
    fontWeight: '900', 
    color: theme.colors.text,
    marginBottom: 8, 
    letterSpacing: -0.5,
  },
  message: {
    fontSize: theme.fonts.sizes.body, 
    color: theme.colors.muted, 
    textAlign: 'center',
    lineHeight: 20, 
    marginBottom: 28, 
    fontWeight: '600',
  },
  button: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8,
    backgroundColor: theme.colors.brand,
    paddingHorizontal: 24, 
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: theme.colors.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, 
    shadowRadius: 8, 
    elevation: 4,
  },
  buttonText: { 
    color: theme.colors.white, 
    fontWeight: '800', 
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
}));
