import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { Workshop } from '../types/workshops.types';
import { useRouter } from 'expo-router';

interface WorkshopMapMarkerProps {
  workshop: Workshop;
  selected?: boolean;
  onMarkerPress?: () => void;
}


// Map marker for a workshop.

export const WorkshopMapMarker = memo(function WorkshopMapMarker({
  workshop,
  selected = false,
  onMarkerPress,
}: WorkshopMapMarkerProps) {
  const router = useRouter();

  const latitude  = workshop.location.coordinates[1];
  const longitude = workshop.location.coordinates[0];
  const workshopId = workshop._id ?? workshop.id;

  return (
    <Marker
      coordinate={{ latitude, longitude }}
      tracksViewChanges={false}
      onPress={onMarkerPress}
      anchor={{ x: 0.5, y: 1 }}
    >
      {/* ── Custom pin ─────────────────────────────────────────────────────── */}
      <View style={markerStyles.container}>
        <View style={[markerStyles.pin, selected && markerStyles.pinSelected]}>
          <Ionicons
            name="car-sport"
            size={selected ? 20 : 15}
            color="#FFFFFF"
          />
          {selected && (
            <View style={markerStyles.selectedRing} />
          )}
        </View>
        {/* Downward-pointing tail */}
        <View style={[markerStyles.tail, selected && markerStyles.tailSelected]} />
      </View>

      <Callout
        onPress={() => workshopId && router.push(`/customer/workshops/${workshopId}` as any)}
        tooltip
      >
        <View style={calloutStyles.container}>
          {/* Header row */}
          <View style={calloutStyles.headerRow}>
            <View style={calloutStyles.iconBox}>
              <Ionicons name="business" size={14} color="#F56E0F" />
            </View>
            <Text style={calloutStyles.name} numberOfLines={2}>{workshop.name}</Text>
          </View>

          {/* Rating + district */}
          <View style={calloutStyles.metaRow}>
            <View style={calloutStyles.ratingPill}>
              <Ionicons name="star" size={10} color="#F59E0B" />
              <Text style={calloutStyles.ratingText}>
                {(workshop.averageRating ?? 0) > 0
                  ? (workshop.averageRating ?? 0).toFixed(1)
                  : '—'}
              </Text>
            </View>
            <Text style={calloutStyles.dot}>·</Text>
            <Text style={calloutStyles.district} numberOfLines={1}>
              {workshop.district}
            </Text>
          </View>

          {/* Distance badge (only available in nearby/map mode) */}
          {workshop.distance != null && (
            <View style={calloutStyles.distRow}>
              <Ionicons name="navigate-outline" size={10} color="#F56E0F" />
              <Text style={calloutStyles.distText}>
                {workshop.distance.toFixed(1)} km away
              </Text>
            </View>
          )}

          {/* CTA */}
          <View style={calloutStyles.cta}>
            <Text style={calloutStyles.ctaText}>View Details</Text>
            <Ionicons name="arrow-forward" size={11} color="#FFFFFF" />
          </View>
        </View>
      </Callout>
    </Marker>
  );
});

// ── Marker pin styles (plain StyleSheet — safe in any RN context) ─────────────

const BRAND = '#F56E0F';

const markerStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  pin: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: BRAND,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 5,
    elevation: 6,
  },
  pinSelected: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 3,
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 12,
    backgroundColor: '#D95C00',
  },
  selectedRing: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(245, 110, 15, 0.35)',
  },
  tail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: BRAND,
    marginTop: -1,
  },
  tailSelected: {
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderTopColor: '#D95C00',
  },
});

// ── Callout styles (plain static values ONLY — no theme tokens) ───────────────
const calloutStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    width: 210,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  name: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706',
  },
  dot: { fontSize: 12, color: '#D1D5DB' },
  district: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    flex: 1,
  },
  distRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 10,
  },
  distText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F56E0F',
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#F56E0F',
    borderRadius: 10,
    paddingVertical: 7,
  },
  ctaText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
