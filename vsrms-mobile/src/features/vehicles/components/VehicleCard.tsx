import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Vehicle } from '../types/vehicles.types';

const TYPE_ICON: Record<string, string> = {
  car:        'car-outline',
  motorcycle: 'bicycle-outline',
  tuk:        'car-outline',
  van:        'bus-outline',
  suv:        'car-sport-outline',
  truck:      'car-outline',
  bus:        'bus-outline',
  other:      'construct-outline',
};

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const { theme } = useUnistyles();
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => router.push(`/customer/vehicles/${vehicle._id ?? vehicle.id}` as any)}
    >
      <View style={styles.content}>
        {vehicle.imageUrl ? (
          <Image
            source={{ uri: vehicle.imageUrl }}
            style={styles.imageBox}
            contentFit="cover"
            transition={300}
          />
        ) : (
          <View style={styles.iconBox}>
            <Ionicons name={(TYPE_ICON[vehicle.vehicleType] ?? 'car-outline') as any} size={28} color="#F56E0F" />
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.name}>{vehicle.make} {vehicle.model}</Text>
          <Text style={styles.details}>{vehicle.year} · {vehicle.registrationNo}</Text>
          
          {/* Tags row */}
          <View style={styles.tagsRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{(vehicle.vehicleType ?? 'unknown').toUpperCase()}</Text>
            </View>
            {vehicle.mileage ? (
              <View style={styles.mileageBadge}>
                <Ionicons name="speedometer-outline" size={12} color="#6B7280" />
                <Text style={styles.mileageText}>{vehicle.mileage.toLocaleString()} km</Text>
              </View>
            ) : null}
          </View>
        </View>
        
        <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    elevation: 4,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 12,
  },
  content: { flexDirection: 'row', alignItems: 'center' },
  imageBox: {
    width: 72, height: 72, borderRadius: 14,
    marginRight: 16, backgroundColor: '#F3F4F6',
  },
  iconBox: {
    width: 72, height: 72, borderRadius: 14,
    backgroundColor: '#FFF7ED', alignItems: 'center', justifyContent: 'center', 
    marginRight: 16, borderWidth: 1, borderColor: '#FFEDD5',
  },
  info: { flex: 1, justifyContent: 'center' },
  name: { fontSize: 17, fontWeight: '900', color: '#1A1A2E', letterSpacing: -0.3 },
  details: { fontSize: 13, color: '#6B7280', fontWeight: '600', marginTop: 4 },
  
  tagsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
  badge: { backgroundColor: '#FFF7ED', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: '900', color: '#C2410C' },
  
  mileageBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  mileageText: { fontSize: 10, fontWeight: '700', color: '#4B5563' },
}));
