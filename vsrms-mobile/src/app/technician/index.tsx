import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useAuth } from '@/hooks';
import { useWorkshopAppointments } from '@/features/appointments/queries/queries';
import { Appointment } from '@/features/appointments/types/appointments.types';

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
            <Text style={styles.greeting}>Staff Dashboard</Text>
            <Text style={styles.userName} numberOfLines={1}>Hello, {displayName}</Text>
          </View>
          <TouchableOpacity style={styles.avatar} activeOpacity={0.8} onPress={() => signOut()}>
            <Text style={styles.avatarText}>{initials}</Text>
            <View style={styles.logoutIcon}>
               <Ionicons name="log-out" size={10} color="#FFF" />
            </View>
          </TouchableOpacity>
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
               <View style={[styles.statIcon, { backgroundColor: 'rgba(245,110,15,0.1)' }]}>
                 <Ionicons name="hammer" size={24} color="#F56E0F" />
               </View>
               {iLoad ? <ActivityIndicator size="small" color="#F56E0F" /> : <Text style={styles.statValue}>{inProgress?.length ?? 0}</Text>}
               <Text style={styles.statLabel}>In Progress</Text>
            </View>
            <View style={styles.statCard}>
               <View style={[styles.statIcon, { backgroundColor: '#FEF3C7' }]}>
                 <Ionicons name="time" size={24} color="#D97706" />
               </View>
               {pLoad ? <ActivityIndicator size="small" color="#F59E0B" /> : <Text style={styles.statValue}>{pending?.length ?? 0}</Text>}
               <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shift Actions</Text>
            <View style={styles.quickLinks}>
              {[
                { icon: 'calendar-outline' as const, label: 'Appointments', href: '/technician/appointments' },
                { icon: 'hammer-outline' as const,   label: 'Job Tracker',  href: '/technician/tracker' },
                { icon: 'document-text-outline' as const, label: 'New Record', href: '/technician/record' },
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
              <Text style={styles.sectionTitle}>My Task Queue</Text>
              <TouchableOpacity onPress={() => router.push('/technician/tracker' as any)}>
                <Text style={styles.linkText}>See All</Text>
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
              myJobs.map(a => (
                <TouchableOpacity key={a._id} style={styles.taskCard} activeOpacity={0.7} onPress={() => router.push('/technician/tracker' as any)}>
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
  topSection: { paddingHorizontal: 28, paddingTop: 16, paddingBottom: 64, position: 'relative', overflow: 'hidden' },
  headerTextRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 },
  headerText: { flex: 1 },
  greeting: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  userName: { fontSize: 26, color: '#FFFFFF', fontWeight: '900', letterSpacing: -0.5, marginTop: 4 },
  
  avatar: { width: 46, height: 46, borderRadius: 12, backgroundColor: 'rgba(245,110,15,0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#F56E0F' },
  avatarText: { fontSize: 16, fontWeight: '900', color: '#F56E0F' },
  logoutIcon: { position: 'absolute', bottom: -6, right: -6, backgroundColor: '#F56E0F', borderRadius: 10, padding: 3, borderWidth: 1.5, borderColor: '#1A1A2E' },

  decCircle1: { position: 'absolute', width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(245,110,15,0.13)', top: -25, right: -25 },
  decCircle2: { position: 'absolute', width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(245,110,15,0.08)', bottom: 10, right: 90 },

  mainCard: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -38, flex: 1, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 16 },
  scroll: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 130 },

  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1.5, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 },
  statIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statValue: { fontSize: 26, fontWeight: '900', color: '#1A1A2E', marginBottom: 2 },
  statLabel: { fontSize: 10, color: '#6B7280', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },

  section: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#1A1A2E', letterSpacing: -0.3, marginBottom: 16 },
  linkText: { fontSize: 13, fontWeight: '800', color: '#F56E0F', letterSpacing: 0.2 },

  quickLinks: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, alignItems: 'center' },
  actionIconBox: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#FAFAFA', alignItems: 'center', justifyContent: 'center', marginBottom: 8, borderWidth: 1.5, borderColor: '#E5E7EB' },
  actionText: { fontSize: 11, fontWeight: '800', color: '#6B7280', textAlign: 'center' },

  emptyCard: { backgroundColor: '#FAFAFA', borderRadius: 16, padding: 32, alignItems: 'center', borderWidth: 1.5, borderColor: '#F3F4F6', borderStyle: 'dashed' },
  emptyText: { fontSize: 14, fontWeight: '700', color: '#9CA3AF', marginTop: 12 },

  taskCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, marginBottom: 12, borderWidth: 1.5, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5 },
  taskDate: { fontSize: 12, color: '#9CA3AF', fontWeight: '700' },
  taskTitle: { fontSize: 16, fontWeight: '900', color: '#1A1A2E', marginBottom: 6, letterSpacing: -0.3 },
  vehicleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  vehicleText: { fontSize: 13, color: '#6B7280', fontWeight: '600' },
}));
