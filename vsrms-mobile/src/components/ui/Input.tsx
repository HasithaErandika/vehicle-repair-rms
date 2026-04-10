import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: any;
}

export function Input({ label, error, containerStyle, ...props }: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          props.multiline && styles.multiline
        ]}
        placeholderTextColor="#94A3B8"
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: { width: '100%', gap: 6 },
  label: { fontSize: theme.fonts.sizes.sm, fontWeight: '700', color: theme.colors.text },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    fontSize: theme.fonts.sizes.md,
    color: theme.colors.text,
  },
  inputError: { borderColor: theme.colors.error || '#EF4444' },
  multiline: { minHeight: 100, textAlignVertical: 'top' },
  errorText: { color: theme.colors.error || '#EF4444', fontSize: 12 },
}));
