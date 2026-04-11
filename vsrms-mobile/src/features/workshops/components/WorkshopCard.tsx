import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MapPin, Star } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { Workshop } from '../types/workshops.types';

export function WorkshopCard({ workshop }: { workshop: Workshop }) {
  const { theme } = useUnistyles();
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => router.push(`/tabs/workshops/${workshop.id}` as any)}
    >
      <View style={styles.topRow}>
        <View style={styles.mainInfo}>
          <Text style={styles.name} numberOfLines={1}>{workshop.name}</Text>
          <Text style={styles.address} numberOfLines={1}>{workshop.district}, Colombo</Text>
        </View>
        <View style={styles.ratingBox}>
          <Ionicons name="star" size={14} color="#F56E0F" />
          <Text style={styles.ratingText}>{workshop.averageRating?.toFixed(1) || '4.8'}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.footerRow}>
        <View style={styles.serviceTag}>
          <Text style={styles.serviceText}>{workshop.servicesOffered?.[0] || 'Full Service'}</Text>
        </View>
        <Text style={styles.distanceText}>1.2 km</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  mainInfo: { flex: 1, marginRight: 12 },
  name: { fontSize: 18, fontWeight: '900', color: '#1A1A2E' },
  address: { fontSize: 13, color: '#9CA3AF', fontWeight: '600', marginTop: 4 },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  ratingText: { fontSize: 12, fontWeight: '800', color: '#F56E0F' },
  divider: { height: 1.5, backgroundColor: '#F9FAFB', marginBottom: 16 },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  serviceTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  serviceText: { fontSize: 11, fontWeight: '700', color: '#9CA3AF' },
  distanceText: { fontSize: 13, fontWeight: '800', color: '#1A1A2E' }
}));
