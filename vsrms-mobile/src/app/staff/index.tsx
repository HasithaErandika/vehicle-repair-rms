import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';

export default function StaffDashboardScreen() {
  const router = useRouter();
  const { theme } = useUnistyles();

  const handleLogout = () => {
    router.replace('/auth/login' as any);
  };

  const tasks = [
    { id: 1, title: 'Brake Pad Replacement', vehicle: 'Toyota Prius (CAA-9876)', time: '09:00 AM', status: 'In Progress' },
    { id: 2, title: 'Engine Oil Change', vehicle: 'Honda Civic (CBA-1234)', time: '11:30 AM', status: 'Pending' },
    { id: 3, title: 'Full Scan & Diagnostics', vehicle: 'Nissan Leaf (KJ-4567)', time: '02:00 PM', status: 'Pending' },
  ];

  return (
    <ScreenWrapper>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />

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
                <Ionicons name="car-outline" size={16} color={theme.colors.muted} />
                <Text style={styles.vehicleText}>{t.vehicle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.actionsBox}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/staff/record')}>
            <Ionicons name="add-circle" size={24} color={theme.colors.surface} />
            <Text style={styles.actionText}>New Entry</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  headerSubtitle: { fontSize: 13, color: theme.colors.muted, fontWeight: '600' },
  headerTitle: { fontSize: 24, fontWeight: '900', color: theme.colors.text, letterSpacing: -0.5 },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 110, 15, 0.2)'
  },
  avatarText: { fontSize: 16, fontWeight: '800', color: theme.colors.brand },

  scroll: { padding: theme.spacing.md, paddingBottom: 120 },

  statsRow: { flexDirection: 'row', gap: theme.spacing.md, marginBottom: 28 },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 2,
    shadowColor: theme.colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8
  },
  statValue: { fontSize: 28, fontWeight: '900', color: theme.colors.text, marginBottom: 4 },
  statLabel: { fontSize: 12, color: theme.colors.muted, fontWeight: '600', textTransform: 'uppercase' },

  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.text, marginBottom: 16 },

  taskCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 2,
  },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusActive: { backgroundColor: theme.colors.successBackground },
  statusPending: { backgroundColor: theme.colors.warningBackground },
  statusText: { fontSize: 11, fontWeight: '800' },
  textActive: { color: theme.colors.successText },
  textPending: { color: theme.colors.warningText },
  taskTime: { fontSize: 13, fontWeight: '700', color: theme.colors.muted },
  taskTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.text, marginBottom: 8 },
  vehicleInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  vehicleText: { fontSize: 14, color: theme.colors.muted, fontWeight: '500' },

  actionsBox: { alignItems: 'flex-end', marginTop: 20 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.brand,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: theme.radii.full,
    elevation: 8,
    shadowColor: theme.colors.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },
  actionText: { color: theme.colors.surface, fontSize: 15, fontWeight: '700' }
}));
