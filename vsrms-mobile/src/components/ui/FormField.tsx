import React from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Ionicons } from '@expo/vector-icons';

interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: any;
}

export function FormField({
  label,
  error,
  hint,
  required,
  optional,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  multiline,
  ...props
}: FormFieldProps) {
  const [focused, setFocused] = React.useState(false);
  const { theme } = useUnistyles();

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.asterisk}> *</Text>}
        {optional && <Text style={styles.optional}> (optional)</Text>}
      </Text>

      <View
        style={[
          styles.inputRow,
          focused && styles.inputRowFocused,
          error && styles.inputRowError,
          multiline && styles.inputRowMultiline,
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={18}
            color={error ? theme.colors.error : focused ? theme.colors.brand : theme.colors.muted}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={[styles.input, multiline && styles.inputMultiline]}
          placeholderTextColor={theme.colors.muted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} hitSlop={10}>
            <Ionicons name={rightIcon} size={18} color={theme.colors.muted} />
          </TouchableOpacity>
        )}
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hintText}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: { width: '100%', marginBottom: 20 },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  asterisk: { color: theme.colors.error },
  optional: { fontWeight: '500', color: theme.colors.muted, textTransform: 'none', letterSpacing: 0 },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 54,
    backgroundColor: theme.colors.surface,
  },
  inputRowFocused: { borderColor: theme.colors.brand, backgroundColor: theme.colors.brandSoft },
  inputRowError: { borderColor: theme.colors.error, backgroundColor: theme.colors.errorBackground },
  inputRowMultiline: { height: undefined, minHeight: 100, paddingVertical: 14, alignItems: 'flex-start' },

  leftIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: theme.colors.text, fontWeight: '500' },
  inputMultiline: { textAlignVertical: 'top' },

  errorText: { color: theme.colors.error, fontSize: 12, fontWeight: '600', marginTop: 6, marginLeft: 2 },
  hintText: { color: theme.colors.muted, fontSize: 11, fontWeight: '600', marginTop: 6, marginLeft: 2, fontStyle: 'italic' },
}));
