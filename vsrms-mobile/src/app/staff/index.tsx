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
import { useRouter } from 'expo-router';

const BRAND = '#F56E0F';
const WHITE = '#FFFFFF';
const BG = '#F9FAFB';
const TEXT = '#111827';
const MUTED = '#6B7280';
const BORDER = '#E5E7EB';

export default function StaffOverviewScreen() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/auth/login' as any);
  };

  const tasks = [
    { id: 1, title: 'Brake Pad Replacement', vehicle: 'Toyota Prius (CAA-9876)', time: '09:00 AM', status: 'In Progress' },
    { id: 2, title: 'Engine Oil Change', vehicle: 'Honda Civic (CBA-1234)', time: '11:30 AM', status: 'Pending' },
    { id: 3, title: 'Full Scan & Diagnostics', vehicle: 'Nissan Leaf (KJ-4567)', time: '02:00 PM', status: 'Pending' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />
      
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>Technician Dashboard</Text>
          <Text style={styles.headerTitle}>Hello, Kasun</Text>
        </View>
        <TouchableOpacity style={styles.avatarBox} onPress={handleLogout} activeOpacity={0.7}>
          <Text style={styles.avatarText}>KB</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* DAILY STATS */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Today's Jobs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* ACTIVE TASKS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Tasks Today</Text>
          {tasks.map(t => (
            <TouchableOpacity 
              key={t.id} 
              style={styles.taskCard}
              activeOpacity={0.7}
              onPress={() => router.push('/staff/tracker')}
            >
              <View style={styles.taskHeader}>
                <View style={[styles.statusBadge, t.status === 'In Progress' ? styles.statusActive : styles.statusPending]}>
                  <Text style={[styles.statusText, t.status === 'In Progress' ? styles.textActive : styles.textPending]}>
                    {t.status}
                  </Text>
                </View>
                <Text style={styles.taskTime}>{t.time}</Text>
              </View>
              <Text style={styles.taskTitle}>{t.title}</Text>
              <View style={styles.vehicleInfo}>
                <Ionicons name="car-outline" size={16} color={MUTED} />
                <Text style={styles.vehicleText}>{t.vehicle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.actionsBox}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/staff/record')}>
            <Ionicons name="add-circle" size={24} color={WHITE} />
            <Text style={styles.actionText}>New Entry</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  headerSubtitle: { fontSize: 13, color: MUTED, fontWeight: '600' },
  headerTitle: { fontSize: 24, fontWeight: '900', color: TEXT, letterSpacing: -0.5 },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  avatarText: { fontSize: 16, fontWeight: '800', color: '#0369A1' },

  scroll: { padding: 20, paddingBottom: 120 },
  
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  statCard: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: BORDER,
  },
  statValue: { fontSize: 28, fontWeight: '900', color: TEXT, marginBottom: 4 },
  statLabel: { fontSize: 12, color: MUTED, fontWeight: '600', textTransform: 'uppercase' },

  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: TEXT, marginBottom: 16 },
  
  taskCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusActive: { backgroundColor: '#ECFDF5' },
  statusPending: { backgroundColor: '#FFF7ED' },
  statusText: { fontSize: 11, fontWeight: '800' },
  textActive: { color: '#059669' },
  textPending: { color: '#D97706' },
  taskTime: { fontSize: 13, fontWeight: '700', color: MUTED },
  taskTitle: { fontSize: 16, fontWeight: '800', color: TEXT, marginBottom: 8 },
  vehicleInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  vehicleText: { fontSize: 14, color: MUTED, fontWeight: '500' },

  actionsBox: { position: 'absolute', bottom: 20, right: 0 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: BRAND,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 8,
    shadowColor: BRAND,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  actionText: { color: WHITE, fontSize: 15, fontWeight: '700' },
});
