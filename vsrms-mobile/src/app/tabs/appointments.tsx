import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

const BRAND   = '#FF7300';
const WHITE   = '#FFFFFF';
const BG      = '#F4F5F7';
const CARD    = '#FFFFFF';
const TEXT    = '#111827';
const MUTED   = '#6B7280';
const BORDER  = '#E5E7EB';

export default function AppointmentsScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<'Upcoming' | 'Past'>('Upcoming');

  const upcoming = [
    {
      id: 'a1',
      date: 'Tomorrow, Oct 25',
      time: '10:00 AM',
      title: 'Full Service & Oil Change',
      vehicle: 'Honda Civic (CBA-1234)',
      garage: 'AutoCare Garage Colombo',
      status: 'Confirmed',
    },
    {
      id: 'a2',
      date: 'Next Tue, Oct 31',
      time: '02:30 PM',
      title: 'A/C System Check',
      vehicle: 'Toyota Prius (CAA-9876)',
      garage: 'CoolBreeze Repair',
      status: 'Pending',
    },
  ];

  const past = [
    {
      id: 'a3',
      date: 'Sep 15, 2024',
      time: '09:00 AM',
      title: 'Battery Replacement',
      vehicle: 'Toyota Prius (CAA-9876)',
      garage: 'QuickFix Auto',
      status: 'Completed',
    },
  ];

  const data = tab === 'Upcoming' ? upcoming : past;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Appointments</Text>
        <TouchableOpacity 
          style={styles.addBtn} 
          activeOpacity={0.7}
          onPress={() => router.push('/tabs/explore' as any)}
        >
          <Text style={styles.addBtnText}>+ Book</Text>
        </TouchableOpacity>
      </View>

      {/* TABS */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'Upcoming' && styles.tabBtnActive]}
          onPress={() => setTab('Upcoming')}
          activeOpacity={1}
        >
          <Text style={[styles.tabText, tab === 'Upcoming' && styles.tabTextActive]}>Upcoming</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'Past' && styles.tabBtnActive]}
          onPress={() => setTab('Past')}
          activeOpacity={1}
        >
          <Text style={[styles.tabText, tab === 'Past' && styles.tabTextActive]}>Past</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {data.map((appt) => (
          <View key={appt.id} style={styles.apptCard}>
            <View style={styles.apptHeader}>
              <View style={styles.dateTimeBadge}>
                <Text style={styles.dateText}>{appt.date}</Text>
                <Text style={styles.timeText}>{appt.time}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                appt.status === 'Confirmed' && { backgroundColor: '#ECFDF5' },
                appt.status === 'Pending'   && { backgroundColor: '#FFFBEB' },
                appt.status === 'Completed' && { backgroundColor: '#F3F4F6' },
              ]}>
                <Text style={[
                  styles.statusText,
                  appt.status === 'Confirmed' && { color: '#047857' },
                  appt.status === 'Pending'   && { color: '#D97706' },
                  appt.status === 'Completed' && { color: '#4B5563' },
                ]}>{appt.status}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.apptBody}>
              <Text style={styles.apptTitle}>{appt.title}</Text>
              <Text style={styles.apptVehicle}>{appt.vehicle}</Text>
              
              <View style={styles.garageBox}>
                <Ionicons name="location-sharp" size={14} color={TEXT} />
                <Text style={styles.garageText}>{appt.garage}</Text>
              </View>
            </View>

            {tab === 'Upcoming' && (
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionBtnOutline} activeOpacity={0.7}>
                  <Text style={styles.actionBtnTextOutline}>Reschedule</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtnPrimary} activeOpacity={0.8}>
                  <Text style={styles.actionBtnTextPrimary}>Get Directions</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {data.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No {tab.toLowerCase()} appointments.</Text>
          </View>
        )}
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
    paddingBottom: 16,
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

  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabBtnActive: { backgroundColor: WHITE, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 },
  tabText: { fontSize: 13, fontWeight: '600', color: MUTED },
  tabTextActive: { color: TEXT, fontWeight: '800' },

  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },

  apptCard: {
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
  apptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dateTimeBadge: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
  },
  dateText: { fontSize: 13, fontWeight: '800', color: TEXT, marginBottom: 2 },
  timeText: { fontSize: 12, color: BRAND, fontWeight: '700' },
  
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: { fontSize: 11, fontWeight: '800' },

  divider: { height: 1, backgroundColor: BORDER, marginVertical: 16 },

  apptBody: { marginBottom: 16 },
  apptTitle: { fontSize: 17, fontWeight: '800', color: TEXT, marginBottom: 4 },
  apptVehicle: { fontSize: 13, color: MUTED, fontWeight: '500', marginBottom: 12 },
  
  garageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },

  garageText: { fontSize: 13, fontWeight: '600', color: TEXT },

  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtnOutline: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: BORDER,
  },
  actionBtnTextOutline: { fontSize: 13, fontWeight: '700', color: TEXT },
  actionBtnPrimary: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: BRAND,
  },
  actionBtnTextPrimary: { fontSize: 13, fontWeight: '700', color: WHITE },

  emptyState: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: MUTED, fontSize: 14, fontWeight: '500' },
});
