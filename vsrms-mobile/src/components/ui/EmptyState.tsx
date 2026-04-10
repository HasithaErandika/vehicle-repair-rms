import React from 'react';
import { View, Text } from 'react-native';
import { PackageOpen } from 'lucide-react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export function EmptyState({ message = "No data found." }: { message?: string }) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.container}>
      <PackageOpen color={theme.colors.muted} size={48} style={styles.icon} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.xl },
  icon: { marginBottom: theme.spacing.md },
  message: { fontSize: theme.fonts.sizes.md, color: theme.colors.muted, textAlign: 'center' },
}));
