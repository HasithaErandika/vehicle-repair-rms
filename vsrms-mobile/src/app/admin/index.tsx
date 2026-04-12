import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useUsers } from '@/features/auth/queries/queries';
import { useWorkshops } from '@/features/workshops/queries/queries';
import { useAuth } from '@/hooks';
import { useRouter } from 'expo-router';
import { AvatarMenu } from '@/components/ui/AvatarMenu';

export default function AdminOverviewScreen() {
  const { signOut, user } = useAuth();
  const router = useRouter();

  const { data: users, isLoading: uLoad } = useUsers();
  const { data: workshops, isLoading: wLoad } = useWorkshops();

  const totalUsers = users?.total ?? 0;
  const totalWorkshops = workshops?.length ?? 0;

  const displayName = user?.fullName ?? user?.email ?? 'Admin';
  const initials = displayName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <ScreenWrapper bg="#1A1A2E">
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />

      {/* ── DARK TOP SECTION ── */}
      <View style={styles.topSection}>
        <View style={styles.headerTextRow}>
          <View style={styles.headerText}>
            <Text style={styles.headerSub}>Platform Control</Text>
            <Text style={styles.headerTitle} numberOfLines={1}>{displayName}</Text>
          </View>
          <AvatarMenu
            initials={initials}
            onSettings={() => router.push('/admin/settings' as any)}
            onSignOut={signOut}
          />
        </View>

        <View style={styles.decCircle1} />
        <View style={styles.decCircle2} />
      </View>

      {/* ── WHITE CARD SECTION ── */}
      <View style={styles.mainCard}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} bounces={true}>
          
          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="people-outline" size={24} color="#3B82F6" />
              </View>
              {uLoad ? <ActivityIndicator size="small" color="#3B82F6" style={{ marginVertical: 4 }} /> : <Text style={styles.statValue}>{totalUsers}</Text>}
              <Text style={styles.statLabel}>Total Users</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(245,110,15,0.1)' }]}>
                <Ionicons name="business-outline" size={24} color="#F56E0F" />
              </View>
              {wLoad ? <ActivityIndicator size="small" color="#F56E0F" style={{ marginVertical: 4 }} /> : <Text style={styles.statValue}>{totalWorkshops}</Text>}
              <Text style={styles.statLabel}>Workshops</Text>
            </View>
          </View>

          {/* Minimalist Chart */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>System Activity</Text>
            <View style={styles.chartPlaceholder}>
              <View style={styles.chartBars}>
                {[40, 60, 45, 80, 55, 90, 70].map((h, i) => (
                  <View key={`bar-${i}`} style={[styles.barContainer]}>
                    <View style={[styles.bar, { height: h * 1.2, backgroundColor: i === 5 ? '#F56E0F' : '#E5E7EB' }]} />
                  </View>
                ))}
              </View>
              <View style={styles.chartLabels}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((l, i) => (
                  <Text key={`label-${i}`} style={styles.chartLabel}>{l}</Text>
                ))}
              </View>
            </View>
          </View>

          {/* System Logs */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Event Logs</Text>
            </View>
            <View style={styles.logsBox}>
              <View style={styles.logItem}>
                <View style={[styles.logDot, { backgroundColor: '#10B981' }]} />
                <View style={styles.logInfo}>
                  <Text style={styles.logText}>New Garage: City Motors registered</Text>
                  <Text style={styles.logTime}>2 mins ago</Text>
                </View>
              </View>
              <View style={[styles.logItem, { borderBottomWidth: 0 }]}>
                <View style={[styles.logDot, { backgroundColor: '#F59E0B' }]} />
                <View style={styles.logInfo}>
                  <Text style={styles.logText}>Database maintenance scheduled</Text>
                  <Text style={styles.logTime}>15 mins ago</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  topSection: { 
    paddingHorizontal: theme.spacing.screenPadding, 
    paddingTop: 16, 
    paddingBottom: theme.spacing.headerBottom, 
    position: 'relative', 
    overflow: 'hidden' 
  },
  headerTextRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 },
  headerText: { flex: 1 },
  headerSub: { 
    fontSize: theme.fonts.sizes.caption, 
    color: 'rgba(255,255,255,0.7)', 
    fontWeight: '700', 
    textTransform: 'uppercase', 
    letterSpacing: 1 
  },
  headerTitle: { 
    fontSize: theme.fonts.sizes.pageTitle, 
    color: '#FFFFFF', 
    fontWeight: '900', 
    letterSpacing: -0.5, 
    marginTop: 4 
  },
  

  decCircle1: { position: 'absolute', width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(245,110,15,0.13)', top: -25, right: -25 },
  decCircle2: { position: 'absolute', width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(245,110,15,0.08)', bottom: 10, right: 90 },

  mainCard: { 
    backgroundColor: '#FFFFFF', 
    borderTopLeftRadius: 32, 
    borderTopRightRadius: 32, 
    marginTop: theme.spacing.cardOverlap, 
    flex: 1, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: -4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 20, 
    elevation: 16 
  },
  scroll: { 
    paddingHorizontal: theme.spacing.screenPadding, 
    paddingTop: 28, 
    paddingBottom: 130 
  },

  statsGrid: { flexDirection: 'row', gap: 14, marginBottom: 32 },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, alignItems: 'center', borderWidth: 1.5, borderColor: '#F3F4F6' },
  statIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statValue: { fontSize: 30, fontWeight: '900', color: '#1A1A2E', marginBottom: 2 },
  statLabel: { fontSize: 10, color: '#6B7280', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },

  section: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: theme.fonts.sizes.sectionTitle, fontWeight: '900', color: '#1A1A2E', letterSpacing: -0.3 },

  chartPlaceholder: { backgroundColor: '#FAFAFA', borderRadius: 20, padding: 24, borderWidth: 1.5, borderColor: '#F3F4F6', alignItems: 'center' },
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%', height: 120, marginBottom: 16 },
  barContainer: { flex: 1, alignItems: 'center' },
  bar: { width: 14, borderRadius: 7 },
  chartLabels: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  chartLabel: { flex: 1, textAlign: 'center', fontSize: 12, color: '#9CA3AF', fontWeight: '700' },

  logsBox: { backgroundColor: '#FAFAFA', borderRadius: 18, padding: 16, borderWidth: 1.5, borderColor: '#E5E7EB' },
  logItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 12, borderBottomWidth: 1.5, borderBottomColor: '#F3F4F6' },
  logDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  logInfo: { flex: 1 },
  logText: { fontSize: 14, fontWeight: '700', color: '#1A1A2E', lineHeight: 20 },
  logTime: { fontSize: 12, color: '#6B7280', fontWeight: '600', marginTop: 4 }
}));
