import React from 'react';
import { View, Text } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Ionicons } from '@expo/vector-icons';
import { Workshop } from '../types/workshops.types';
import { useRouter } from 'expo-router';

interface WorkshopMapMarkerProps {
  workshop: Workshop;
  selected?: boolean;
  onMarkerPress?: () => void;
}

export function WorkshopMapMarker({ workshop, selected = false, onMarkerPress }: WorkshopMapMarkerProps) {
  const { theme } = useUnistyles();
  const router = useRouter();

  const latitude = workshop.location.coordinates[1];
  const longitude = workshop.location.coordinates[0];

  return (
    <Marker
      coordinate={{ latitude, longitude }}
      tracksViewChanges={selected}
      onPress={onMarkerPress}
    >
      <View style={styles.markerContainer}>
        <View style={[styles.markerPin, selected && styles.markerPinSelected]}>
          <Ionicons name="car-sport" size={selected ? 20 : 16} color="#FFFFFF" />
        </View>
        <View style={[styles.markerTail, selected && styles.markerTailSelected]} />
      </View>

      <Callout 
        onPress={() => router.push(`/customer/workshops/${workshop._id ?? workshop.id}` as any)}
        tooltip
      >
        <View style={styles.calloutContainer}>
          <Text style={styles.calloutName}>{workshop.name}</Text>
          <View style={styles.calloutRow}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={styles.calloutRating}>
              {workshop.averageRating?.toFixed(1) ?? '—'}
            </Text>
            <Text style={styles.calloutDistrict}>• {workshop.district}</Text>
          </View>
          <Text style={styles.calloutAction}>View Details →</Text>
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create((theme) => ({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerPin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerPinSelected: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 10,
    shadowOpacity: 0.45,
    shadowRadius: 6,
  },
  markerTail: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: theme.colors.brand,
    transform: [{ rotate: '180deg' }],
    marginTop: -2,
  },
  markerTailSelected: {
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 11,
    marginTop: -3,
  },
  calloutContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    width: 200,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  calloutName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  calloutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  calloutRating: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
  },
  calloutDistrict: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  calloutAction: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.brand,
    textAlign: 'right',
  },
}));
