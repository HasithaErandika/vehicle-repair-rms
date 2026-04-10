import React from 'react';
import { View, Text } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

/**
 * Placeholder for WorkshopMap since react-native-maps might not be set up yet
 * or for web support.
 */
export function WorkshopMap() {
  const { theme } = useUnistyles();

  return (
    <View style={styles.container}>
      <MapPin size={48} color={theme.colors.brand} />
      <Text style={styles.text}>Map Visualization Placeholder</Text>
      <Text style={styles.subtext}>Interactive maps will be integrated here.</Text>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: { 
    width: '100%', 
    height: 200, 
    backgroundColor: theme.colors.background, 
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center', 
    justifyContent: 'center',
    gap: 8
  },
  text: { fontSize: theme.fonts.sizes.sm, fontWeight: '700', color: theme.colors.text },
  subtext: { fontSize: theme.fonts.sizes.xs, color: theme.colors.muted },
}));
