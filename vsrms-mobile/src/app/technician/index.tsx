import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useAuth } from '@/hooks';
import { AvatarMenu } from '@/components/ui/AvatarMenu';
import { useWorkshopAppointments } from '@/features/appointments/queries/queries';
import { useWorkshop } from '@/features/workshops/queries/queries';
import { Appointment } from '@/features/appointments/types/appointments.types';
import client from '@/services/http.client';
import { useEffect } from 'react';

function getVehicleLabel(a: Appointment): string {
  if (typeof a.vehicleId === 'object') {
    return `${a.vehicleId.make} ${a.vehicleId.model} (${a.vehicleId.registrationNo})`;
  }
  return 'Vehicle';
}

export default function TechnicianDashboardScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const workshopId = user?.workshopId;
  const { data: workshop, isError: wsError, refetch: refetchWS } = useWorkshop(workshopId ?? '');

  const hasAttemptedRepair = React.useRef(false);

  // AUTO-REPAIR: If workshop is missing or broken, try a profile sync once
  useEffect(() => {
    if (user && (!workshopId || wsError) && !hasAttemptedRepair.current) {
      hasAttemptedRepair.current = true;
      console.log('[DEBUG] Workshop link missing or broken, attempting auto-repair...');
      client.post('/auth/sync-profile').then(() => refetchWS()).catch(e => console.error('Sync failed:', e));
    }
  }, [user, workshopId, wsError]);

  const { data: pending,    isLoading: pLoad } = useWorkshopAppointments(workshopId, 'pending');
  const { data: inProgress, isLoading: iLoad } = useWorkshopAppointments(workshopId, 'in_progress');
  const { data: confirmed,  isLoading: cLoad } = useWorkshopAppointments(workshopId, 'confirmed');
  const anyLoading = pLoad || iLoad || cLoad;

  const displayName = user?.fullName?.split(' ')[0] ?? 'Technician';
  const initials = (user?.fullName ?? user?.email ?? 'TN').split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();
  const myJobs = [...(inProgress ?? []), ...(confirmed ?? [])].slice(0, 5);

  return (
    <ScreenWrapper bg="#1A1A2E">
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />

      {/* ── DARK TOP SECTION ── */}
      <View style={styles.topSection}>
        <View style={styles.headerTextRow}>
          <View style={styles.headerText}>
            <Text style={styles.headerSub}>Technical Assistant</Text>
            <Text style={styles.headerTitle} numberOfLines={1}>Hello, {displayName}</Text>
            {workshop?.name && (
              <View style={styles.wsBadge}>
                <Ionicons name="business" size={10} color="rgba(255,255,255,0.8)" />
                <Text style={styles.wsBadgeText}>{workshop.name}</Text>
              </View>
            )}
          </View>
          <AvatarMenu
            initials={initials}
            onSettings={() => router.push('/technician/settings' as any)}
            onSignOut={signOut}
          />
        </View>
        <View style={styles.decCircle1} />
        <View style={styles.decCircle2} />
      </View>

      {/* ── WHITE CARD SECTION ── */}
      <View style={styles.mainCard}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} bounces={true}>
          
          {/* WORKSHOP WARNING OR BROKEN LINK */}
          {(wsError || !workshopId) && (
            <View style={styles.warningBanner}>
              <Ionicons name="alert-circle" size={20} color="#991B1B" />
              <View style={{ flex: 1 }}>
                <Text style={styles.warningTitle}>
                  {!workshopId ? 'Workshop Not Linked' : 'Broken Workshop Link'}
                </Text>
                <Text style={styles.warningSub}>
                  {!workshopId 
                    ? 'Your account is not assigned to a workshop yet. Contact your manager.' 
                    : 'The workshop you were linked to can no longer be found. Contact your manager to be re-assigned.'}
                </Text>
              </View>
            </View>
          )}

          {/* CONFIRMED JOBS ALERT */}
          {!anyLoading && (confirmed?.length ?? 0) > 0 && (
            <TouchableOpacity 
              style={styles.confirmedAlert} 
              activeOpacity={0.8}
              onPress={() => router.push('/technician/appointments?status=confirmed' as any)}
            >
              <View style={styles.alertIconBox}>
                <Ionicons name="notifications" size={18} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.alertTitle}>New Jobs Ready!</Text>
                <Text style={styles.alertSub}>{confirmed?.length} booking(s) have been approved and are ready to start.</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#059669" />
            </TouchableOpacity>
          )}

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
               <View style={[styles.statIcon, { backgroundColor: 'rgba(245,110,15,0.1)' }]}>
                 <Ionicons name="hammer" size={24} color="#F56E0F" />
               </View>
               {iLoad ? <ActivityIndicator size="small" color="#F56E0F" /> : <Text style={styles.statValue}>{inProgress?.length ?? 0}</Text>}
               <Text style={styles.statLabel}>Active Jobs</Text>
            </View>
            <View style={styles.statCard}>
               <View style={[styles.statIcon, { backgroundColor: '#FEF3C7' }]}>
                 <Ionicons name="calendar-outline" size={24} color="#D97706" />
               </View>
               {pLoad ? <ActivityIndicator size="small" color="#F59E0B" /> : <Text style={styles.statValue}>{pending?.length ?? 0}</Text>}
               <Text style={styles.statLabel}>New Appts</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Daily Operations</Text>
            <View style={styles.quickLinks}>
              {[
                { icon: 'calendar-outline' as const, label: 'Schedule',   href: '/technician/appointments' },
                { icon: 'construct-outline' as const, label: 'Work Tracker', href: '/technician/tracker' },
                { icon: 'document-text-outline' as const, label: 'Add Record', href: '/technician/record' },
              ].map(a => (
                <TouchableOpacity key={a.label} style={styles.actionBtn} onPress={() => router.push(a.href as any)} activeOpacity={0.7}>
                  <View style={styles.actionIconBox}>
                    <Ionicons name={a.icon} size={22} color="#1A1A2E" />
                  </View>
                  <Text style={styles.actionText}>{a.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Active Jobs */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Task Queue</Text>
              <TouchableOpacity onPress={() => router.push('/technician/tracker' as any)}>
                <Text style={styles.linkText}>See Full List</Text>
              </TouchableOpacity>
            </View>

            {anyLoading ? (
              <ActivityIndicator color="#F56E0F" style={{ marginTop: 12 }} />
            ) : myJobs.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons name="checkmark-done-circle-outline" size={36} color="#D1D5DB" />
                <Text style={styles.emptyText}>Queue is completely empty</Text>
              </View>
            ) : (
              myJobs.map((a, idx) => (
                <TouchableOpacity key={a._id || a.id || `job-${idx}`} style={styles.taskCard} activeOpacity={0.7} onPress={() => router.push('/technician/tracker' as any)}>
                  <View style={styles.taskHeader}>
                     <View style={[styles.statusBadge, { backgroundColor: a.status === 'in_progress' ? 'rgba(245,110,15,0.1)' : '#ECFDF5' }]}>
                        <Text style={[styles.statusText, { color: a.status === 'in_progress' ? '#F56E0F' : '#059669' }]}>
                           {a.status === 'in_progress' ? 'In Progress' : 'Confirmed'}
                        </Text>
                     </View>
                     <Text style={styles.taskDate}>
                        {new Date(a.scheduledDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                     </Text>
                  </View>
                  <Text style={styles.taskTitle}>{a.serviceType}</Text>
                  <View style={styles.vehicleRow}>
                     <Ionicons name="car-outline" size={16} color="#9CA3AF" />
                     <Text style={styles.vehicleText}>{getVehicleLabel(a)}</Text>
                  </View>
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
    marginTop: 2 
  },
  wsBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start' },
  wsBadgeText: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase' },
  

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
    paddingTop: 24, 
    paddingBottom: 130 
  },

  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, alignItems: 'center', borderWidth: 1.5, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 },
  statIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statValue: { fontSize: 26, fontWeight: '900', color: '#1A1A2E', marginBottom: 2 },
  statLabel: { fontSize: 10, color: '#6B7280', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },

  section: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: theme.fonts.sizes.sectionTitle, fontWeight: '900', color: '#1A1A2E', letterSpacing: -0.3 },
  linkText: { fontSize: 13, fontWeight: '800', color: '#F56E0F', letterSpacing: 0.2 },

  quickLinks: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, alignItems: 'center' },
  actionIconBox: { width: 62, height: 62, borderRadius: 20, backgroundColor: '#FAFAFA', alignItems: 'center', justifyContent: 'center', marginBottom: 8, borderWidth: 1.5, borderColor: '#E5E7EB' },
  actionText: { fontSize: 11, fontWeight: '800', color: '#6B7280', textAlign: 'center' },

  emptyCard: { backgroundColor: '#FAFAFA', borderRadius: 20, padding: 32, alignItems: 'center', borderWidth: 1.5, borderColor: '#F3F4F6', borderStyle: 'dashed' },
  emptyText: { fontSize: 13, fontWeight: '800', color: '#9CA3AF', marginTop: 12 },

  taskCard: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 18, marginBottom: 12, borderWidth: 1.5, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5 },
  taskDate: { fontSize: 12, color: '#9CA3AF', fontWeight: '700' },
  taskTitle: { fontSize: 16, fontWeight: '900', color: '#1A1A2E', marginBottom: 6, letterSpacing: -0.3 },
  vehicleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  vehicleText: { fontSize: 13, color: '#6B7280', fontWeight: '600' },

  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: '#FECACA',
  },
  warningTitle: { fontSize: 14, fontWeight: '900', color: '#991B1B' },
  warningSub: { fontSize: 12, fontWeight: '600', color: '#B91C1C', marginTop: 2, lineHeight: 16 },

  debugBox: { marginTop: 40, padding: 12, backgroundColor: '#F3F4F6', borderRadius: 10, borderStyle: 'dotted', borderWidth: 1, borderColor: '#D1D5DB' },
  debugText: { fontSize: 10, color: '#9CA3AF', fontFamily: 'Courier', fontWeight: '600' },

  confirmedAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ECFDF5',
    padding: 16,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
  },
  alertIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTitle: { fontSize: 14, fontWeight: '900', color: '#065F46' },
  alertSub: { fontSize: 12, fontWeight: '600', color: '#047857', marginTop: 2 },
}));
