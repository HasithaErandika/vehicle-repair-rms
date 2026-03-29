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

const BRAND = '#FF7300';
const WHITE = '#FFFFFF';
const BG = '#F4F5F7';
const CARD = '#FFFFFF';
const TEXT = '#111827';
const MUTED = '#6B7280';
const BORDER = '#E5E7EB';

export default function DashboardScreen() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/auth/login' as any);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      {/* HEADER */}
      <View style={styles.header}>
        <View>

          <Text style={styles.userName}>Seneja Thehansi</Text>
        </View>
        <TouchableOpacity style={styles.avatarBox} onPress={handleLogout} activeOpacity={0.7}>
          <Text style={styles.avatarText}>ST</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* STATS ROW */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Vehicles</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>Active Appt.</Text>
          </View>
        </View>

        {/* RECENT VEHICLES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Vehicles</Text>
            <TouchableOpacity onPress={() => router.push('/tabs/vehicles' as any)}>
              <Text style={styles.linkText}>View All</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => router.push('/tabs/vehicles/1' as any)}
          >
            <View style={styles.cardRow}>
              <View style={styles.iconBox}>
                <Ionicons name="car-sport" size={24} color={TEXT} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>Honda Civic 2020</Text>
                <Text style={styles.cardSubtitle}>CBA-1234 • Last Serviced: Oct 12, 2024</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* ACTIVE APPOINTMENTS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            <TouchableOpacity onPress={() => router.push('/tabs/appointments' as any)}>
              <Text style={styles.linkText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.apptCard}>
            <View style={styles.apptHeader}>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Confirmed</Text>
              </View>
              <Text style={styles.apptDate}>Tomorrow, 10:00 AM</Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.apptTitle}>Full Service & Oil Change</Text>
            <Text style={styles.apptSub}>For Honda Civic (CBA-1234)</Text>
            <View style={styles.garageBox}>
              <Text style={styles.garageName}>AutoCare Garage Colombo</Text>
              <Text style={styles.garageAddress}>123 Main St, Colombo 03</Text>
            </View>
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
    backgroundColor: WHITE,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  greeting: { fontSize: 13, color: MUTED, fontWeight: '600', marginBottom: 2 },
  userName: { fontSize: 20, color: TEXT, fontWeight: '800', letterSpacing: -0.3 },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#FFF4EC',
    borderWidth: 1,
    borderColor: 'rgba(255,115,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '800', color: BRAND },

  scroll: {
    padding: 20,
    paddingBottom: 40,
  },

  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: CARD,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: { fontSize: 32, fontWeight: '900', color: TEXT, marginBottom: 4 },
  statLabel: { fontSize: 12, color: MUTED, fontWeight: '600', textTransform: 'uppercase' },

  section: { marginBottom: 32 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: TEXT },
  linkText: { fontSize: 14, fontWeight: '700', color: BRAND },

  card: {
    backgroundColor: CARD,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  cardTitle: { fontSize: 16, fontWeight: '700', color: TEXT, marginBottom: 4 },
  cardSubtitle: { fontSize: 13, color: MUTED, fontWeight: '500' },
  chevron: { fontSize: 22, color: '#9CA3AF', fontWeight: 'bold' },

  /* Appt Card */
  apptCard: {
    backgroundColor: CARD,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: BORDER,
    borderLeftWidth: 4,
    borderLeftColor: BRAND,
  },
  apptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  statusText: { fontSize: 12, fontWeight: '700', color: '#047857' },
  apptDate: { fontSize: 13, fontWeight: '700', color: TEXT },

  divider: { height: 1, backgroundColor: BORDER, marginVertical: 16 },

  apptTitle: { fontSize: 17, fontWeight: '800', color: TEXT, marginBottom: 4 },
  apptSub: { fontSize: 14, color: MUTED, fontWeight: '500', marginBottom: 16 },

  garageBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  garageName: { fontSize: 14, fontWeight: '700', color: TEXT, marginBottom: 2 },
  garageAddress: { fontSize: 13, color: MUTED },
});
