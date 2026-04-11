import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';

export function VehicleCard({ vehicle }: { vehicle: any }) {
  const { theme } = useUnistyles();
  const router = useRouter();

  const isWarning = vehicle.status === 'Needs Service';

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => router.push(`/tabs/vehicles/${vehicle._id || vehicle.id}` as any)}
    >
      <View style={styles.content}>
        <View style={styles.iconBox}>
          <Ionicons name="car-outline" size={24} color="#1A1A2E" />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{vehicle.make} {vehicle.model}</Text>
          <Text style={styles.details}>{vehicle.year} • {vehicle.plateNumber || 'CBA-1234'}</Text>
        </View>
        <View style={[styles.badge, isWarning ? styles.badgeWarning : styles.badgeActive]}>
          <Text style={[styles.badgeText, isWarning ? styles.badgeTextWarning : styles.badgeTextActive]}>
            {vehicle.status || (isWarning ? 'Needs Service' : 'Active')}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <Text style={styles.footerLabel}>Last Serviced:</Text>
        <Text style={styles.footerValue}>{vehicle.lastServicedDate || 'Oct 12, 2024'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    boxShadow: [{
      offsetX: 0,
      offsetY: 4,
      blurRadius: 10,
      color: 'rgba(0,0,0,0.03)',
    }],
    elevation: 2
  },
  content: { flexDirection: 'row', alignItems: 'center' },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16
  },
  info: { flex: 1 },
  name: { fontSize: 17, fontWeight: '900', color: '#1A1A2E' },
  details: { fontSize: 13, color: '#9CA3AF', fontWeight: '600', marginTop: 2 },
  
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  badgeActive: { backgroundColor: '#ECFDF5' },
  badgeWarning: { backgroundColor: '#FFF7ED' },
  badgeText: { fontSize: 11, fontWeight: '800' },
  badgeTextActive: { color: '#10B981' },
  badgeTextWarning: { color: '#F56E0F' },

  divider: { height: 1.5, backgroundColor: '#F9FAFB', marginVertical: 16 },
  
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerLabel: { fontSize: 13, color: '#9CA3AF', fontWeight: '600' },
  footerValue: { fontSize: 14, fontWeight: '900', color: '#1A1A2E' }
}));
