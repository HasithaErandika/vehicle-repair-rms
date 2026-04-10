import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Car, ChevronRight } from 'lucide-react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { Vehicle } from '../types/vehicles.types';

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const { styles, theme } = useStyles(stylesheet);
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => router.push(`/tabs/vehicles/${vehicle._id || vehicle.id}` as any)}
    >
      <View style={styles.cardRow}>
        <View style={styles.iconBox}>
          <Car size={24} color={theme.colors.text} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{vehicle.make} {vehicle.model} {vehicle.year}</Text>
          <Text style={styles.cardSubtitle}>{vehicle.plateNumber}</Text>
        </View>
        <ChevronRight size={20} color={theme.colors.muted} />
      </View>
    </TouchableOpacity>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: theme.radii.sm,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: theme.fonts.sizes.md, fontWeight: '700', color: theme.colors.text, marginBottom: 4 },
  cardSubtitle: { fontSize: theme.fonts.sizes.sm, color: theme.colors.muted, fontWeight: '500' },
}));
