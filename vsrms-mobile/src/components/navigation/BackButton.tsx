import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export function BackButton() {
  const router = useRouter();
  const { theme } = useUnistyles();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => router.back()}
      activeOpacity={0.7}
    >
      <ChevronLeft size={24} color={theme.colors.text} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create((theme) => ({
  button: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
}));
