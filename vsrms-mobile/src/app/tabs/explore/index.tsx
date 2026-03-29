import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BRAND   = '#FF7300';
const WHITE   = '#FFFFFF';
const BG      = '#F4F5F7';
const CARD    = '#FFFFFF';
const TEXT    = '#111827';
const MUTED   = '#6B7280';
const BORDER  = '#E5E7EB';

const CATEGORIES = [
  { id: '1', title: 'All', icon: 'apps-outline' as const },
  { id: '2', title: 'Service', icon: 'build-outline' as const },
  { id: '3', title: 'Body Shop', icon: 'hammer-outline' as const },
  { id: '4', title: 'Tires', icon: 'ellipse-outline' as const },
  { id: '5', title: 'Wash', icon: 'water-outline' as const },
];

const GARAGES = [
  {
    id: 'g1',
    name: 'AutoCare Garage Colombo',
    rating: '4.8',
    reviews: '124',
    distance: '1.2 km',
    specialty: 'Full Service',
    address: '123 Main St, Colombo 03',
  },
  {
    id: 'g2',
    name: 'QuickFix Auto Repair',
    rating: '4.5',
    reviews: '89',
    distance: '3.5 km',
    specialty: 'Engine & Gearbox',
    address: '45 Galle Rd, Dehiwala',
  },
  {
    id: 'g3',
    name: 'Precision Body Works',
    rating: '4.9',
    reviews: '210',
    distance: '5.0 km',
    specialty: 'Paint & Dents',
    address: '88 Negombo Rd, Peliyagoda',
  },
];

export default function GarageDiscoveryScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('1');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />
      
      {/* HEADER & SEARCH */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Garages</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={MUTED} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or service..."
            placeholderTextColor={MUTED}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* CATEGORIES */}
        <View style={styles.section}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catCard, activeCat === cat.id && styles.catCardActive]}
                onPress={() => setActiveCat(cat.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={cat.icon as any}
                  size={20}
                  color={activeCat === cat.id ? WHITE : BRAND}
                />
                <Text style={[styles.catText, activeCat === cat.id && styles.catTextActive]}>
                  {cat.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* GARAGE LIST */}
        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Nearby Garages</Text>
            <TouchableOpacity>
              <Text style={styles.filterText}>Filter</Text>
            </TouchableOpacity>
          </View>

          {GARAGES.map(garage => (
            <TouchableOpacity
              key={garage.id}
              style={styles.garageCard}
              activeOpacity={0.7}
              onPress={() => router.push(`/tabs/explore/${garage.id}` as any)}
            >
              <View style={styles.cardTop}>
                <View style={styles.garageInfo}>
                  <Text style={styles.garageName}>{garage.name}</Text>
                  <Text style={styles.garageAddress}>{garage.address}</Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text style={styles.ratingText}>{garage.rating}</Text>
                </View>
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.cardFooter}>
                <View style={styles.tagRow}>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{garage.specialty}</Text>
                  </View>
                </View>
                <Text style={styles.distanceText}>{garage.distance}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: WHITE },
  
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: { fontSize: 24, fontWeight: '900', color: TEXT, marginBottom: 16, letterSpacing: -0.5 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: TEXT, fontWeight: '500' },

  scroll: { paddingBottom: 40 },

  section: { marginTop: 20 },
  catScroll: { paddingHorizontal: 20, gap: 12 },
  catCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  catCardActive: { backgroundColor: BRAND, borderColor: BRAND },
  catText: { fontSize: 13, fontWeight: '700', color: TEXT },
  catTextActive: { color: WHITE },

  listSection: { paddingHorizontal: 20, marginTop: 32 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  listTitle: { fontSize: 18, fontWeight: '800', color: TEXT },
  filterText: { fontSize: 14, fontWeight: '700', color: BRAND },

  garageCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  garageInfo: { flex: 1, marginRight: 12 },
  garageName: { fontSize: 17, fontWeight: '800', color: TEXT, marginBottom: 4 },
  garageAddress: { fontSize: 13, color: MUTED, fontWeight: '500' },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  ratingText: { fontSize: 12, fontWeight: '800', color: '#B45309' },

  cardDivider: { height: 1, backgroundColor: BORDER, marginVertical: 14 },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tagRow: { flexDirection: 'row', gap: 8 },
  tag: { backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  tagText: { fontSize: 11, fontWeight: '700', color: MUTED },
  distanceText: { fontSize: 12, fontWeight: '700', color: TEXT },
});
