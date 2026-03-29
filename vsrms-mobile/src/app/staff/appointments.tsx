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
import { Ionicons } from '@expo/vector-icons';

const BRAND = '#F56E0F';
const WHITE = '#FFFFFF';
const BG = '#F9FAFB';
const TEXT = '#111827';
const MUTED = '#6B7280';
const BORDER = '#E5E7EB';

const APPOINTMENTS = [
  { id: 1, vehicle: 'Honda Insight', owner: 'Amila Perera', time: '10:30 AM', service: 'Hybrid System Check', status: 'New' },
  { id: 2, vehicle: 'Toyota Vitz', owner: 'Kamani Silva', time: '11:45 AM', service: 'General Service', status: 'New' },
  { id: 3, vehicle: 'Suzuki Wagon R', owner: 'Nuwan Perera', time: '01:30 PM', service: 'Wheel Alignment', status: 'Confirmed' },
];

export default function StaffAppointmentsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Incoming Appts</Text>
        <Text style={styles.apptsCount}>{APPOINTMENTS.length} Total</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {APPOINTMENTS.map(a => (
          <View key={a.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.timeBox}>
                <Text style={styles.timeText}>{a.time}</Text>
              </View>
              <View style={[styles.badge, a.status === 'New' ? styles.badgeNew : styles.badgeConfirmed]}>
                <Text style={[styles.badgeText, a.status === 'New' ? styles.textNew : styles.textConfirmed]}>{a.status}</Text>
              </View>
            </View>

            <Text style={styles.vehicleName}>{a.vehicle}</Text>
            <Text style={styles.serviceName}>{a.service}</Text>
            
            <View style={styles.divider} />
            
            <View style={styles.footer}>
              <View style={styles.ownerInfo}>
                <View style={styles.avatarMini}>
                  <Text style={styles.avatarMiniText}>{a.owner[0]}</Text>
                </View>
                <Text style={styles.ownerName}>{a.owner}</Text>
              </View>
              <TouchableOpacity style={styles.acceptBtn}>
                <Text style={styles.acceptBtnText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: WHITE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  headerTitle: { fontSize: 24, fontWeight: '900', color: TEXT, letterSpacing: -0.5 },
  apptsCount: { fontSize: 13, color: MUTED, fontWeight: '700' },

  scroll: { padding: 20, paddingBottom: 120 },
  card: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  timeBox: { backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  timeText: { fontSize: 12, fontWeight: '800', color: TEXT },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeNew: { backgroundColor: '#EEF2FF' },
  badgeConfirmed: { backgroundColor: '#F0FDF4' },
  badgeText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  textNew: { color: '#4F46E5' },
  textConfirmed: { color: '#16A34A' },

  vehicleName: { fontSize: 18, fontWeight: '800', color: TEXT, marginBottom: 4 },
  serviceName: { fontSize: 14, color: MUTED, fontWeight: '600', marginBottom: 16 },
  
  divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 16 },
  
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ownerInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatarMini: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  avatarMiniText: { fontSize: 12, fontWeight: '800', color: TEXT },
  ownerName: { fontSize: 14, fontWeight: '700', color: TEXT },
  
  acceptBtn: { backgroundColor: BRAND, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  acceptBtnText: { color: WHITE, fontSize: 13, fontWeight: '800' },
});
