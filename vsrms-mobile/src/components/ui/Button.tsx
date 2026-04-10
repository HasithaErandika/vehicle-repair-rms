import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  loading, 
  disabled,
  style,
  textStyle
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#F56E0F' : '#fff'} />
      ) : (
        <Text style={[
          styles.text,
          styles[`${variant}Text`],
          textStyle
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create((theme) => ({
  button: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primary: { backgroundColor: theme.colors.brand },
  secondary: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border },
  outline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: theme.colors.brand },
  ghost: { backgroundColor: 'transparent' },
  disabled: { opacity: 0.5 },
  text: { fontSize: theme.fonts.sizes.md, fontWeight: '800' },
  primaryText: { color: '#fff' },
  secondaryText: { color: theme.colors.text },
  outlineText: { color: theme.colors.brand },
  ghostText: { color: theme.colors.brand },
}));
