import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useAuth } from '@/hooks';
import { AvatarMenu } from '@/components/ui/AvatarMenu';
import { useMyWorkshops } from '@/features/workshops/queries/queries';

export default function OwnerOverviewScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { theme } = useUnistyles();

  const { data: workshops = [], isLoading } = useMyWorkshops();

  const displayName = user?.fullName ?? user?.email ?? 'Owner';
  const initials = displayName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();

  const totalWorkshops = workshops.length;
  const activeWorkshops = workshops.filter(w => w.active !== false).length;

  return (
    <ScreenWrapper bg="#1A1A2E">
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />

      {/* ── DARK TOP SECTION ── */}
      <View style={styles.topSection}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerSub}>Control Center</Text>
            <Text style={styles.headerTitle}>Business Overview</Text>
          </View>
          <AvatarMenu
            initials={initials}
            onSettings={() => router.push('/owner/settings' as any)}
            onSignOut={signOut}
          />
        </View>

        {/* Decorative Circles */}
        <View style={styles.decCircle1} />
        <View style={styles.decCircle2} />
      </View>

      {/* ── WHITE DASHBOARD AREA ── */}
      <View style={styles.mainCard}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.welcomeText}>Hello, {displayName.split(' ')[0]}</Text>
          <Text style={styles.welcomeSub}>Here is what's happening today</Text>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(245,110,15,0.1)' }]}>
                <Ionicons name="business-outline" size={24} color="#F56E0F" />
              </View>
              {isLoading ? <ActivityIndicator size="small" color="#F56E0F" /> : <Text style={styles.statValue}>{totalWorkshops}</Text>}
              <Text style={styles.statLabel}>Workshops</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="checkmark-circle-outline" size={24} color="#2563EB" />
              </View>
              <Text style={styles.statValue}>{activeWorkshops}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
          </View>

          {/* Operational Sections */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Access</Text>
            <View style={styles.quickLinks}>
              {[
                { label: 'Workshops',  icon: 'list-outline' as const, color: '#F56E0F', path: '/owner/workshops/list' },
                { label: 'Operations', icon: 'calendar-outline' as const, color: '#2563EB', path: '/owner/bookings' },
                { label: 'History',    icon: 'document-text-outline' as const, color: '#6B7280', path: '/owner/logs' },
              ].map(item => (
                <TouchableOpacity 
                  key={item.label} 
                  style={styles.quickLink} 
                  onPress={() => {
                    // Global links now default to 'all' for owners
                    if (item.path !== '/owner/workshops/list') {
                      router.push({ pathname: item.path, params: { workshopId: 'all' } } as any);
                    } else {
                      router.push(item.path as any);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.quickLinkIcon, { borderColor: item.color + '20' }]}>
                    <Ionicons name={item.icon} size={24} color={item.color} />
                  </View>
                  <Text style={styles.quickLinkText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Highlights / Recent Activity Placeholder */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Main Workshops</Text>
              <TouchableOpacity onPress={() => router.push('/owner/workshops/list' as any)}>
                <Text style={styles.linkText}>Manage All</Text>
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <ActivityIndicator color="#F56E0F" style={{ marginTop: 20 }} />
            ) : workshops.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons name="business-outline" size={32} color="#D1D5DB" />
                <Text style={styles.emptyText}>No workshops found. Create your first one to get started.</Text>
                <TouchableOpacity 
                  style={styles.createBtn}
                  onPress={() => router.push('/owner/workshops/list' as any)}
                >
                  <Text style={styles.createBtnText}>Create Workshop</Text>
                </TouchableOpacity>
              </View>
            ) : (
              workshops.slice(0, 3).map(w => (
                <TouchableOpacity 
                  key={w._id || w.id} 
                  style={styles.workshopCard}
                  onPress={() => router.push(`/owner/workshops/${w._id || w.id}` as any)}
                  activeOpacity={0.8}
                >
                  <View style={styles.wsIcon}>
                    <Ionicons name="storefront-outline" size={22} color="#F56E0F" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.wsName}>{w.name}</Text>
                    <Text style={styles.wsAddr}>{w.address}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
                </TouchableOpacity>
              ))
            )}
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
    paddingBottom: 68,
    position: 'relative',
    overflow: 'hidden',
  },
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    zIndex: 10 
  },
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
    marginTop: -40,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  scroll: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: 32,
    paddingBottom: 130,
  },
  welcomeText: { fontSize: 22, fontWeight: '900', color: '#1A1A2E' },
  welcomeSub: { fontSize: 13, color: '#9CA3AF', fontWeight: '600', marginTop: 4, marginBottom: 24 },

  statsGrid: { flexDirection: 'row', gap: 14, marginBottom: 32 },
  statCard: {
    flex: 1, 
    backgroundColor: '#FFFFFF', 
    borderRadius: 22,
    padding: 16, 
    alignItems: 'center',
    borderWidth: 1.5, 
    borderColor: '#F3F4F6',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.04, 
    shadowRadius: 12, 
    elevation: 2,
  },
  statIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statValue: { fontSize: 26, fontWeight: '900', color: '#1A1A2E', marginBottom: 2 },
  statLabel: { fontSize: 10, color: '#6B7280', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },

  section: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#1A1A2E', letterSpacing: -0.3 },
  linkText: { fontSize: 13, fontWeight: '800', color: '#F56E0F' },

  quickLinks: { flexDirection: 'row', gap: 12 },
  quickLink: { flex: 1, alignItems: 'center' },
  quickLinkIcon: { width: 62, height: 62, borderRadius: 18, backgroundColor: '#FAFAFA', alignItems: 'center', justifyContent: 'center', marginBottom: 8, borderWidth: 1.5, borderColor: '#F3F4F6' },
  quickLinkText: { fontSize: 11, fontWeight: '800', color: '#6B7280', textAlign: 'center' },

  workshopCard: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 14,
    backgroundColor: '#FFFFFF', 
    padding: 14, 
    borderRadius: 18,
    borderWidth: 1.5, 
    borderColor: '#F3F4F6', 
    marginBottom: 10,
  },
  wsIcon: { width: 46, height: 46, borderRadius: 12, backgroundColor: '#FFF7ED', alignItems: 'center', justifyContent: 'center' },
  wsName: { fontSize: 15, fontWeight: '800', color: '#1A1A2E' },
  wsAddr: { fontSize: 12, color: '#9CA3AF', fontWeight: '500', marginTop: 2 },

  emptyCard: { backgroundColor: '#F9FAFB', borderRadius: 20, padding: 32, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#D1D5DB' },
  emptyText: { fontSize: 13, color: '#9CA3AF', fontWeight: '600', textAlign: 'center', marginTop: 12, marginBottom: 20 },
  createBtn: { backgroundColor: '#F56E0F', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  createBtnText: { color: '#FFF', fontWeight: '800' },
}));
