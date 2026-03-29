import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

const BRAND   = '#FF7300';
const WHITE   = '#FFFFFF';
const BG      = '#F4F5F7';
const CARD    = '#FFFFFF';
const TEXT    = '#111827';
const MUTED   = '#6B7280';
const BORDER  = '#E5E7EB';

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Mock data for the specific vehicle
  const vehicle = {
    make: 'Honda',
    model: 'Civic',
    year: '2020',
    license: 'CBA-1234',
    vin: '1HGCM82633A004',
    status: 'Active',
    mileage: '45,200 km',
  };

  const history = [
    {
      id: 'r1',
      date: 'Oct 12, 2024',
      title: 'Full Service & Oil Change',
      garage: 'AutoCare Garage Colombo',
      cost: 'LKR 15,000',
    },
    {
      id: 'r2',
      date: 'May 04, 2024',
      title: 'Brake Pad Replacement',
      garage: 'QuickFix Auto',
      cost: 'LKR 8,500',
    },
    {
      id: 'r3',
      date: 'Nov 18, 2023',
      title: 'General Inspection',
      garage: 'AutoCare Garage Colombo',
      cost: 'LKR 3,000',
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={22} color={TEXT} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vehicle Details</Text>
        <View style={styles.placeholderBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* VEHICLE INFO CARD */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="car-sport" size={28} color={TEXT} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitle}>{vehicle.make} {vehicle.model}</Text>
              <Text style={styles.infoLicense}>{vehicle.license}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{vehicle.status}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.metaGrid}>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>Year</Text>
              <Text style={styles.metaValue}>{vehicle.year}</Text>
            </View>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>Mileage</Text>
              <Text style={styles.metaValue}>{vehicle.mileage}</Text>
            </View>
            <View style={[styles.metaCell, { borderRightWidth: 0 }]}>
              <Text style={styles.metaLabel}>VIN</Text>
              <Text style={styles.metaValue} numberOfLines={1}>{vehicle.vin}</Text>
            </View>
          </View>
        </View>

        {/* SERVICE HISTORY */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Service History</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.linkText}>Download PDF</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.timeline}>
            {history.map((item, index) => (
              <View key={item.id} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={styles.timelineDot} />
                  {index !== history.length - 1 && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.historyDate}>{item.date}</Text>
                  <View style={styles.historyCard}>
                    <Text style={styles.historyTitle}>{item.title}</Text>
                    <Text style={styles.historyGarage}>{item.garage}</Text>
                    <View style={styles.historyDivider} />
                    <Text style={styles.historyCost}>{item.cost}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  backBtn: {
    width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
    borderRadius: 20, backgroundColor: BG,
  },
  backIcon: { fontSize: 22, color: TEXT },
  headerTitle: { fontSize: 18, fontWeight: '800', color: TEXT },
  placeholderBtn: { width: 40 },

  scroll: {
    padding: 20,
    paddingBottom: 40,
  },

  /* Info Card */
  infoCard: {
    backgroundColor: CARD,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  iconBox: {
    width: 54, height: 54, borderRadius: 12, backgroundColor: '#F3F4F6',
    alignItems: 'center', justifyContent: 'center', marginRight: 16,
  },
  iconText: { fontSize: 28 },
  infoTitle: { fontSize: 20, fontWeight: '900', color: TEXT, letterSpacing: -0.5, marginBottom: 2 },
  infoLicense: { fontSize: 14, color: MUTED, fontWeight: '600' },
  
  statusBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: { fontSize: 11, fontWeight: '800', color: '#047857' },

  divider: { height: 1, backgroundColor: BORDER, marginVertical: 20 },

  metaGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  metaCell: { flex: 1, borderRightWidth: 1, borderRightColor: BORDER, paddingHorizontal: 4 },
  metaLabel: { fontSize: 11, color: MUTED, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  metaValue: { fontSize: 14, color: TEXT, fontWeight: '700' },

  /* History */
  section: { marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: TEXT },
  linkText: { fontSize: 13, fontWeight: '700', color: BRAND },

  timeline: { paddingLeft: 8 },
  timelineItem: { flexDirection: 'row', marginBottom: 24 },
  timelineLeft: { alignItems: 'center', width: 20, marginRight: 16 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: BRAND, zIndex: 10 },
  timelineLine: { width: 2, flex: 1, backgroundColor: BORDER, marginTop: -4, marginBottom: -28 },
  
  timelineContent: { flex: 1, marginTop: -4 },
  historyDate: { fontSize: 12, fontWeight: '700', color: MUTED, marginBottom: 8 },
  historyCard: {
    backgroundColor: CARD,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  historyTitle: { fontSize: 16, fontWeight: '800', color: TEXT, marginBottom: 4 },
  historyGarage: { fontSize: 13, color: MUTED, fontWeight: '500' },
  historyDivider: { height: 1, backgroundColor: BORDER, marginVertical: 12 },
  historyCost: { fontSize: 14, fontWeight: '700', color: BRAND },
});
