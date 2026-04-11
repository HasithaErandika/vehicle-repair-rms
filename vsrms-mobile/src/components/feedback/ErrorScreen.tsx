import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export function ErrorScreen({ onRetry, message = "Failed to load data" }: { onRetry: () => void, message?: string }) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.container}>
      <AlertCircle color={theme.colors.error} size={48} style={styles.icon} />
      <Text style={styles.title}>Whoops!</Text>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background },
  icon: { marginBottom: theme.spacing.md },
  title: { fontSize: theme.fonts.sizes.xl, fontWeight: 'bold', color: theme.colors.text, marginBottom: theme.spacing.sm },
  message: { fontSize: theme.fonts.sizes.md, color: theme.colors.muted, marginBottom: theme.spacing.xl },
  button: { backgroundColor: theme.colors.brand, paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.md, borderRadius: theme.radii.md },
  buttonText: { color: 'white', fontWeight: 'bold' }
}));
