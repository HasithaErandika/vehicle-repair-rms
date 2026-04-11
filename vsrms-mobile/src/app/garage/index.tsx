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

export default function GarageDashboardScreen() {
  const router = useRouter();
  const { theme } = useUnistyles();

  const stats = [
    { label: 'Pending Bookings', value: '12', icon: 'time-outline', color: '#F59E0B' },
    { label: 'Active Jobs', value: '8', icon: 'hammer-outline', color: theme.colors.brand },
    { label: 'Completed Today', value: '5', icon: 'checkmark-done-circle-outline', color: theme.colors.successText || '#10B981' },
  ];

  return (
    <ScreenWrapper>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>Service Center</Text>
          <Text style={styles.headerTitle}>AutoCare Colombo</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* STATS */}
        <View style={styles.statsGrid}>
          {stats.map((s, i) => (
            <View key={i} style={styles.statCard}>
              <View style={[styles.iconBox, { backgroundColor: s.color + '10' }]}>
                <Ionicons name={s.icon as any} size={24} color={s.color} />
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsBox}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => router.push('/garage/create-record' as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="document-text" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.actionText}>Create Record</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => router.push('/garage/bookings' as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#F0FDF4' }]}>
                <Ionicons name="calendar" size={24} color="#10B981" />
              </View>
              <Text style={styles.actionText}>Bookings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => router.push('/garage/jobs' as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#FFF7ED' }]}>
                <Ionicons name="trending-up" size={24} color={theme.colors.brand} />
              </View>
              <Text style={styles.actionText}>Job Tracker</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* RECENT ACTIVITY MOCK */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View>
                <Text style={styles.activityTitle}>John Perera - Honda Civic</Text>
                <Text style={styles.activityTime}>Just now • Booking Approved</Text>
              </View>
            </View>
            <View style={[styles.activityItem, { borderBottomWidth: 0 }]}>
              <View style={[styles.activityDot, { backgroundColor: theme.colors.brand }]} />
              <View>
                <Text style={styles.activityTitle}>Toyota Prius (CAA-9876)</Text>
                <Text style={styles.activityTime}>15 mins ago • In Progress</Text>
              </View>
            </View>
          </View>
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
  headerTitle: { fontSize: 20, fontWeight: '800', color: theme.colors.text, letterSpacing: -0.5 },

  scroll: { padding: theme.spacing.md, paddingBottom: 100 },

  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 2,
    shadowColor: theme.colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8
  },
  iconBox: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statValue: { fontSize: 24, fontWeight: '900', color: theme.colors.text, marginBottom: 2 },
  statLabel: { fontSize: 11, color: theme.colors.muted, fontWeight: '600', textTransform: 'uppercase' },

  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.text, marginBottom: 16 },

  actionsBox: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, alignItems: 'center' },
  actionIcon: { width: 60, height: 60, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 8, borderWidth: 1, borderColor: theme.colors.border },
  actionText: { fontSize: 12, fontWeight: '700', color: theme.colors.text, textAlign: 'center' },

  activityCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  activityItem: { flexDirection: 'row', gap: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border, alignItems: 'center' },
  activityDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.successText || '#10B981' },
  activityTitle: { fontSize: 14, fontWeight: '700', color: theme.colors.text },
  activityTime: { fontSize: 12, color: theme.colors.muted, marginTop: 2 }
}));
