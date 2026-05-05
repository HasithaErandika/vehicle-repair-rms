import React from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
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
            color={error ? '#EF4444' : focused ? '#F56E0F' : '#9CA3AF'}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={[styles.input, multiline && styles.inputMultiline]}
          placeholderTextColor="#9CA3AF"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} hitSlop={10}>
            <Ionicons name={rightIcon} size={18} color="#9CA3AF" />
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
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  asterisk: { color: theme.colors.error },
  optional: { fontWeight: '500', color: '#9CA3AF', textTransform: 'none', letterSpacing: 0 },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 54,
    backgroundColor: '#FAFAFA',
  },
  inputRowFocused: { borderColor: '#F56E0F', backgroundColor: '#FFFBF7' },
  inputRowError: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  inputRowMultiline: { height: undefined, minHeight: 100, paddingVertical: 14, alignItems: 'flex-start' },

  leftIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#1A1A2E', fontWeight: '500' },
  inputMultiline: { textAlignVertical: 'top' },

  errorText: { color: '#EF4444', fontSize: 12, fontWeight: '600', marginTop: 6, marginLeft: 2 },
  hintText: { color: '#9CA3AF', fontSize: 11, fontWeight: '600', marginTop: 6, marginLeft: 2, fontStyle: 'italic' },
}));
