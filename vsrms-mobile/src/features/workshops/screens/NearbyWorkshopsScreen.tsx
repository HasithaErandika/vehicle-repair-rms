import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, Platform, TextInput,
  ScrollView, Animated, Dimensions, ActivityIndicator,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { WorkshopCard } from '../components/WorkshopCard';
import { useNearbyWorkshops, useWorkshops } from '../queries/queries';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { WorkshopMapMarker } from '../components/WorkshopMapMarker';
import { Workshop } from '../types/workshops.types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.76;
const CARD_SPACING = 12;
const PANEL_HEIGHT = SCREEN_HEIGHT - 180; // list panel leaves 180px of map visible at top

const SRI_LANKA_CENTER = {
  latitude: 7.8731, longitude: 80.7718, latitudeDelta: 4.5, longitudeDelta: 3.0,
};

const SL_DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle',
  'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle',
  'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale', 'Matara', 'Monaragala',
  'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura',
  'Trincomalee', 'Vavuniya',
];

// ── Horizontal carousel card ──────────────────────────────────────────────────

interface MapCardProps { workshop: Workshop; onPress: () => void; selected: boolean }

function MapCard({ workshop, onPress, selected }: MapCardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: selected ? 1.04 : 1,
      useNativeDriver: true,
      tension: 80,
      friction: 8,
    }).start();
  }, [selected]);

  const rating = workshop.averageRating ?? 0;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[cardStyles.card, selected && cardStyles.cardSelected]}
        onPress={onPress}
        activeOpacity={0.88}
      >
        <View style={cardStyles.topRow}>
          <View style={[cardStyles.iconBox, selected && cardStyles.iconBoxSelected]}>
            <Ionicons name="business-outline" size={20} color={selected ? '#FFFFFF' : '#F56E0F'} />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={cardStyles.name} numberOfLines={1}>{workshop.name}</Text>
            <View style={cardStyles.locationRow}>
              <Ionicons name="location-outline" size={11} color="#9CA3AF" />
              <Text style={cardStyles.district} numberOfLines={1}>{workshop.district}</Text>
            </View>
          </View>
          <View style={cardStyles.ratingBox}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={cardStyles.ratingText}>
              {rating > 0 ? rating.toFixed(1) : '—'}
            </Text>
          </View>
        </View>

        <View style={cardStyles.footer}>
          {workshop.distance != null && (
            <View style={cardStyles.distTag}>
              <Ionicons name="navigate-outline" size={10} color="#F56E0F" />
              <Text style={cardStyles.distText}>{workshop.distance.toFixed(1)} km away</Text>
            </View>
          )}
          {workshop.servicesOffered?.[0] && (
            <Text style={cardStyles.service} numberOfLines={1}>{workshop.servicesOffered[0]}</Text>
          )}
          <View style={[cardStyles.arrowBox, selected && { backgroundColor: '#F56E0F' }]}>
            <Ionicons name="chevron-forward" size={12} color={selected ? '#FFFFFF' : '#F56E0F'} />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const cardStyles = StyleSheet.create((theme) => ({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginRight: CARD_SPACING,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.13,
    shadowRadius: 18,
    elevation: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  cardSelected: {
    borderColor: '#F56E0F',
    borderWidth: 2,
    shadowColor: '#F56E0F',
    shadowOpacity: 0.2,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconBox: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#FFF7ED', alignItems: 'center', justifyContent: 'center',
  },
  iconBoxSelected: { backgroundColor: '#F56E0F' },
  name: { fontSize: 15, fontWeight: '800', color: '#1A1A2E', marginBottom: 2 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  district: { fontSize: 12, color: '#9CA3AF', fontWeight: '500' },
  ratingBox: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#FFFBEB', paddingHorizontal: 7, paddingVertical: 4, borderRadius: 10,
  },
  ratingText: { fontSize: 12, fontWeight: '800', color: '#D97706' },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  distTag: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#FFF7ED', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10,
  },
  distText: { fontSize: 11, fontWeight: '700', color: '#F56E0F' },
  service: { flex: 1, fontSize: 11, fontWeight: '600', color: '#9CA3AF' },
  arrowBox: {
    width: 24, height: 24, borderRadius: 8,
    backgroundColor: '#FFF7ED', alignItems: 'center', justifyContent: 'center',
  },
}));

// ── Main screen ───────────────────────────────────────────────────────────────

export function NearbyWorkshopsScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const carouselRef = useRef<ScrollView>(null);
  const panelY = useRef(new Animated.Value(PANEL_HEIGHT)).current;

  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationError, setLocErr] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebounced] = useState('');
  const [selectedDistrict, setDistrict] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Debounce search → 400 ms
  useEffect(() => {
    const t = setTimeout(() => setDebounced(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Request device location once on mount
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocErr('Location denied — switch to List to browse all workshops.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLocation(loc);
    })();
  }, []);

  // Nearby query (map mode) — larger 50 km radius for the map view
  const nearbyParams = location
    ? {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
      maxKm: 50,
      ...(debouncedSearch && { name: debouncedSearch }),
    }
    : undefined;

  const {
    data: nearbyData, isLoading: nearbyLoading, refetch: nearbyRefetch,
  } = useNearbyWorkshops(nearbyParams);

  // All-workshops query (list mode) — district + name filters
  const listParams: Record<string, string> = {};
  if (selectedDistrict) listParams.district = selectedDistrict;
  if (debouncedSearch) listParams.name = debouncedSearch;

  const {
    data: listData, isLoading: listLoading, isError: listError, refetch: listRefetch,
  } = useWorkshops(Object.keys(listParams).length ? listParams : undefined);

  // ── Map auto-fit ────────────────────────────────────────────────────────────

  useEffect(() => {
    const workshops = nearbyData ?? [];
    if (workshops.length === 0) return;
    const coords = workshops.map(w => ({
      latitude: w.location.coordinates[1],
      longitude: w.location.coordinates[0],
    }));
    mapRef.current?.fitToCoordinates(coords, {
      edgePadding: { top: 140, right: 50, bottom: 260, left: 50 },
      animated: true,
    });
    setSelectedId(workshops[0]._id ?? workshops[0].id ?? null);
  }, [nearbyData]);

  // ── View toggle animations ───────────────────────────────────────────────────

  const switchToList = useCallback(() => {
    setViewMode('list');
    Animated.spring(panelY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 55,
      friction: 11,
    }).start();
  }, [panelY]);

  const switchToMap = useCallback(() => {
    setViewMode('map');
    Animated.timing(panelY, {
      toValue: PANEL_HEIGHT,
      useNativeDriver: true,
      duration: 300,
    }).start();
  }, [panelY]);

  const focusWorkshop = useCallback((workshop: Workshop, index: number) => {
    setSelectedId(workshop._id ?? workshop.id ?? null);
    mapRef.current?.animateToRegion({
      latitude: workshop.location.coordinates[1],
      longitude: workshop.location.coordinates[0],
      latitudeDelta: 0.025,
      longitudeDelta: 0.025,
    }, 350);
    carouselRef.current?.scrollTo({ x: index * (CARD_WIDTH + CARD_SPACING), animated: true });
  }, []);

  const onCarouselSnap = useCallback((e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_SPACING));
    const w = (nearbyData ?? [])[idx];
    if (!w) return;
    setSelectedId(w._id ?? w.id ?? null);
    mapRef.current?.animateToRegion({
      latitude: w.location.coordinates[1],
      longitude: w.location.coordinates[0],
      latitudeDelta: 0.025,
      longitudeDelta: 0.025,
    }, 300);
  }, [nearbyData]);

  const mapWorkshops = nearbyData ?? [];
  const initialRegion = location
    ? {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.15,
      longitudeDelta: 0.15,
    }
    : SRI_LANKA_CENTER;

  const bannerTop = Platform.OS === 'ios' ? 72 : 80;

  return (
    <ScreenWrapper>
      <View style={styles.root}>

        {/* ── Full-screen map (always mounted) ───────────────────────────────── */}
        <MapView
          ref={mapRef}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          style={StyleSheet.absoluteFillObject}
          initialRegion={initialRegion}
          showsUserLocation={!!location}
          showsMyLocationButton={false}
          showsCompass={false}
          toolbarEnabled={false}
          mapPadding={{ top: 0, right: 0, bottom: viewMode === 'map' ? 210 : 0, left: 0 }}
        >
          {mapWorkshops.map((w, i) => (
            <WorkshopMapMarker
              key={w._id ?? w.id ?? i}
              workshop={w}
              selected={selectedId === (w._id ?? w.id)}
              onMarkerPress={() => focusWorkshop(w, i)}
            />
          ))}
        </MapView>

        {/* ── Floating header: search + toggle ───────────────────────────────── */}
        <View style={styles.floatingHeader}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={17} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search garages..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close-circle" size={17} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.togglePill}>
            <TouchableOpacity
              style={[styles.toggleBtn, viewMode === 'map' && styles.toggleActive]}
              onPress={switchToMap}
            >
              <Ionicons name="map" size={17} color={viewMode === 'map' ? '#FFF' : '#6B7280'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, viewMode === 'list' && styles.toggleActive]}
              onPress={switchToList}
            >
              <Ionicons name="list" size={17} color={viewMode === 'list' ? '#FFF' : '#6B7280'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Stats badge (map mode) ──────────────────────────────────────────── */}
        {viewMode === 'map' && !locationError && (
          <View style={[styles.statsBadge, { top: bannerTop }]}>
            {nearbyLoading ? (
              <>
                <ActivityIndicator size="small" color="#F56E0F" />
                <Text style={styles.statsBadgeText}>Searching nearby…</Text>
              </>
            ) : (
              <>
                <View style={styles.statsDot} />
                <Text style={styles.statsBadgeText}>
                  {mapWorkshops.length} garage{mapWorkshops.length !== 1 ? 's' : ''} within 50 km
                </Text>
              </>
            )}
          </View>
        )}

        {/* ── Location denied banner (map mode) ──────────────────────────────── */}
        {locationError && viewMode === 'map' && (
          <View style={[styles.locationBanner, { top: bannerTop }]}>
            <Ionicons name="location-outline" size={14} color="#D97706" />
            <Text style={styles.locationBannerText} numberOfLines={2}>{locationError}</Text>
            <TouchableOpacity onPress={switchToList} style={styles.listLinkBtn}>
              <Text style={styles.listLinkText}>Show List</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Bottom carousel (map mode, when workshops available) ────────────── */}
        {viewMode === 'map' && mapWorkshops.length > 0 && (
          <View style={styles.carouselWrapper}>
            <ScrollView
              ref={carouselRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContent}
              snapToInterval={CARD_WIDTH + CARD_SPACING}
              decelerationRate="fast"
              onMomentumScrollEnd={onCarouselSnap}
            >
              {mapWorkshops.map((w, i) => (
                <MapCard
                  key={w._id ?? w.id ?? i}
                  workshop={w}
                  selected={selectedId === (w._id ?? w.id)}
                  onPress={() => router.push(`/customer/workshops/${w._id ?? w.id}` as any)}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* ── Animated list panel (slides up from bottom) ─────────────────────── */}
        <Animated.View
          style={[styles.listPanel, { transform: [{ translateY: panelY }] }]}
          pointerEvents={viewMode === 'list' ? 'auto' : 'none'}
        >
          {/* Drag handle */}
          <TouchableOpacity style={styles.handleArea} onPress={switchToMap} activeOpacity={0.7}>
            <View style={styles.handle} />
          </TouchableOpacity>

          {/* District chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            <TouchableOpacity
              style={[styles.chip, !selectedDistrict && styles.chipActive]}
              onPress={() => setDistrict(null)}
            >
              <Text style={[styles.chipText, !selectedDistrict && styles.chipTextActive]}>All</Text>
            </TouchableOpacity>
            {SL_DISTRICTS.map(d => (
              <TouchableOpacity
                key={d}
                style={[styles.chip, selectedDistrict === d && styles.chipActive]}
                onPress={() => setDistrict(p => p === d ? null : d)}
              >
                <Text style={[styles.chipText, selectedDistrict === d && styles.chipTextActive]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Count row */}
          <View style={styles.countRow}>
            <Text style={styles.countText}>
              {listLoading ? 'Loading…' : `${(listData || []).length} workshop${(listData || []).length !== 1 ? 's' : ''}${selectedDistrict ? ` in ${selectedDistrict}` : ''}`}
            </Text>
          </View>

          {/* Workshop list */}
          {listError ? (
            <ErrorScreen onRetry={listRefetch} variant="inline" />
          ) : (
            <FlashList
              data={listData || []}
              renderItem={({ item }) => <WorkshopCard workshop={item} />}
              estimatedItemSize={140}
              onRefresh={listRefetch}
              refreshing={listLoading}
              keyExtractor={item => item._id || item.id || ''}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                listLoading ? null : (
                  <EmptyState
                    message={selectedDistrict
                      ? `No garages found in ${selectedDistrict}.`
                      : 'No workshops available.'}
                  />
                )
              }
            />
          )}
        </Animated.View>

      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  root: { flex: 1 },

  // Floating header
  floatingHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : 16,
    left: 16,
    right: 16,
    zIndex: 200,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 14,
    height: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
  },
  togglePill: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 4,
    height: 52,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 10,
  },
  toggleBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleActive: { backgroundColor: '#F56E0F' },

  // Stats badge
  statsBadge: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.09,
    shadowRadius: 10,
    elevation: 5,
  },
  statsDot: {
    width: 7, height: 7, borderRadius: 3.5,
    backgroundColor: '#10B981',
  },
  statsBadgeText: { fontSize: 12, fontWeight: '700', color: '#374151' },

  locationBanner: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  locationBannerText: { flex: 1, fontSize: 12, fontWeight: '600', color: '#92400E' },
  listLinkBtn: {
    backgroundColor: '#F59E0B',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  listLinkText: { fontSize: 11, fontWeight: '800', color: '#FFFFFF' },

  // Bottom carousel
  carouselWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 34 : 20,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  carouselContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },

  // Animated list panel
  listPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: PANEL_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 24,
    zIndex: 150,
  },
  handleArea: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 6,
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
  },

  // District chips
  chipRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  chipActive: { backgroundColor: '#F56E0F', borderColor: '#F56E0F' },
  chipText: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
  chipTextActive: { color: '#FFFFFF' },

  countRow: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  countText: { fontSize: 12, fontWeight: '600', color: '#9CA3AF' },

  listContent: { paddingHorizontal: 16, paddingBottom: 40 },
}));
