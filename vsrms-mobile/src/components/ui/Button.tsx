import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading,
  disabled,
  style,
  textStyle,
  accessibilityLabel,
}: ButtonProps) {
  const { theme } = useUnistyles();
  const dynamicTextStyle = styles[`${variant}Text` as keyof typeof styles] as any;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        (disabled || loading) && styles.disabled,
        style
      ]}
      onPress={() => onPress()}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator color={(variant === 'outline' || variant === 'ghost') ? theme.colors.brand : theme.colors.white} />
      ) : (
        <Text style={[
          styles.text,
          dynamicTextStyle,
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
  danger: { backgroundColor: theme.colors.error },
  disabled: { opacity: 0.5 },
  text: { fontSize: theme.fonts.sizes.md, fontWeight: '800' },
  primaryText: { color: theme.colors.white },
  secondaryText: { color: theme.colors.text },
  outlineText: { color: theme.colors.brand },
  ghostText: { color: theme.colors.brand },
  dangerText: { color: theme.colors.white },
}));
