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
import { useRouter } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

const BRAND   = '#FF7300';
const WHITE   = '#FFFFFF';
const BG      = '#F4F5F7';
const CARD    = '#FFFFFF';
const TEXT    = '#111827';
const MUTED   = '#6B7280';
const BORDER  = '#E5E7EB';

export default function VehiclesListScreen() {
  const router = useRouter();

  const vehicles = [
    {
      id: '1',
      make: 'Honda',
      model: 'Civic',
      year: '2020',
      license: 'CBA-1234',
      status: 'Active',
      lastService: 'Oct 12, 2024',
    },
    {
      id: '2',
      make: 'Toyota',
      model: 'Prius',
      year: '2018',
      license: 'CAA-9876',
      status: 'Needs Service',
      lastService: 'Jan 05, 2024',
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Vehicles</Text>
        <TouchableOpacity style={styles.addBtn} activeOpacity={0.7}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {vehicles.map((v) => (
          <TouchableOpacity
            key={v.id}
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => router.push(`/tabs/vehicles/${v.id}` as any)}
          >
            <View style={styles.cardHeader}>
              <View style={styles.iconBox}>
                <Ionicons name="car-sport" size={24} color={TEXT} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{v.make} {v.model}</Text>
                <Text style={styles.cardSubtitle}>{v.year} • {v.license}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                v.status === 'Active' ? styles.statusActive : styles.statusWarning
              ]}>
                <Text style={[
                  styles.statusText,
                  v.status === 'Active' ? styles.statusTextActive : styles.statusTextWarning
                ]}>{v.status}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.cardFooter}>
              <Text style={styles.footerLabel}>Last Serviced:</Text>
              <Text style={styles.footerValue}>{v.lastService}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: { fontSize: 24, fontWeight: '900', color: TEXT, letterSpacing: -0.5 },
  addBtn: {
    backgroundColor: BRAND,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: { fontSize: 13, fontWeight: '700', color: WHITE },

  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },

  /* Card */
  card: {
    backgroundColor: CARD,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconText: { fontSize: 24 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: '800', color: TEXT, marginBottom: 4 },
  cardSubtitle: { fontSize: 13, color: MUTED, fontWeight: '500' },
  
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusActive: { backgroundColor: '#ECFDF5' },
  statusWarning: { backgroundColor: '#FFFBEB' },
  statusText: { fontSize: 11, fontWeight: '700' },
  statusTextActive: { color: '#047857' },
  statusTextWarning: { color: '#D97706' },

  divider: { height: 1, backgroundColor: BORDER, marginBottom: 12 },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLabel: { fontSize: 13, color: MUTED, fontWeight: '500' },
  footerValue: { fontSize: 13, color: TEXT, fontWeight: '700' },
});
