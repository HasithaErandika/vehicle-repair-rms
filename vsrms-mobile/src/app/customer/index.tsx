import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StatusBar } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useAuth } from '@/hooks';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { AvatarMenu } from '@/components/ui/AvatarMenu';
import { useVehicles } from '@/features/vehicles/queries/queries';
import { useMyAppointments } from '@/features/appointments/queries/queries';
import { Vehicle } from '@/features/vehicles/types/vehicles.types';
import { Appointment } from '@/features/appointments/types/appointments.types';

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string; label?: string }> = {
  pending: { bg: '#FFFBEB', text: '#D97706', dot: '#F59E0B' },
  confirmed: { bg: '#ECFDF5', text: '#059669', dot: '#10B981' },
  in_progress: { bg: '#EFF6FF', text: '#2563EB', dot: '#3B82F6' },
  completed: { bg: '#F0FDF4', text: '#15803D', dot: '#22C55E' },
  cancelled: { bg: '#FEF2F2', text: '#DC2626', dot: '#EF4444', label: 'REJECTED' },
};

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning,';
  if (h < 17) return 'Good Afternoon,';
  return 'Good Evening,';
}

function getWorkshopLabel(a: Appointment): string {
  if (typeof a.workshopId === 'object') return a.workshopId.name;
  return 'Workshop';
}

function getWorkshopAddress(a: Appointment): string {
  if (typeof a.workshopId === 'object') return a.workshopId.address;
  return '';
}

function getVehicleLabel(a: Appointment): string {
  if (typeof a.vehicleId === 'object') {
    return `${a.vehicleId.make} ${a.vehicleId.model} (${a.vehicleId.registrationNo})`;
  }
  return '';
}

export default function DashboardScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { theme } = useUnistyles();

  const { data: vehicles, isLoading: vLoad } = useVehicles();
  const { data: appointments, isLoading: aLoad } = useMyAppointments('pending,confirmed,in_progress,cancelled');

  const displayName = user?.fullName ?? user?.email ?? 'Guest';
  const initials = displayName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();
  const upcomingAppt = appointments?.find(a => a.status !== 'cancelled') ?? null;
  const statusCfg = upcomingAppt ? (STATUS_CONFIG[upcomingAppt.status] ?? STATUS_CONFIG.pending) : null;

  return (
    <ScreenWrapper bg="#1A1A2E">
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />

      {/* ── DARK TOP SECTION ── */}
      <View style={styles.topSection}>
        <View style={styles.headerTextRow}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName} numberOfLines={1}>{displayName}</Text>
          </View>
          <AvatarMenu
            initials={initials}
            onSettings={() => router.push('/customer/settings' as any)}
            onSignOut={signOut}
          />
        </View>

        {/* Decorative Circles */}
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
                <Ionicons name="car-outline" size={22} color="#3B82F6" />
              </View>
              {vLoad
                ? <ActivityIndicator size="small" color="#3B82F6" style={{ marginVertical: 4 }} />
                : <Text style={styles.statValue}>{vehicles?.length ?? 0}</Text>
              }
              <Text style={styles.statLabel}>Vehicles</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(245,110,15,0.1)' }]}>
                <Ionicons name="calendar-outline" size={22} color="#F56E0F" />
              </View>
              {aLoad
                ? <ActivityIndicator size="small" color="#F56E0F" style={{ marginVertical: 4 }} />
                : <Text style={styles.statValue}>{appointments?.filter(a => a.status !== 'cancelled').length ?? 0}</Text>
              }
              <Text style={styles.statLabel}>Upcoming</Text>
            </View>
          </View>

          {/* My Vehicles */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Vehicles</Text>
              {(!vLoad && (vehicles ?? []).length > 0) && (
                <TouchableOpacity onPress={() => router.push('/customer/vehicles' as any)}>
                  <Text style={styles.linkText}>View All</Text>
                </TouchableOpacity>
              )}
            </View>

            {vLoad
              ? <ActivityIndicator color="#F56E0F" style={{ marginTop: 8 }} />
              : (vehicles ?? []).length === 0
                ? (
                  <TouchableOpacity
                    style={styles.addVehicleCard}
                    onPress={() => router.push('/customer/vehicles/add' as any)}
                  >
                    <Ionicons name="add-circle-outline" size={26} color="#F56E0F" />
                    <Text style={styles.addVehicleText}>Add your first vehicle</Text>
                  </TouchableOpacity>
                )
                : (vehicles ?? []).slice(0, 2).map((v: Vehicle) => (
                  <TouchableOpacity
                    key={v._id || v.id}
                    style={styles.vehicleCard}
                    activeOpacity={0.7}
                    onPress={() => router.push(`/customer/vehicles/${v._id}` as any)}
                  >
                    <View style={styles.vehicleIconBox}>
                      <Ionicons
                        name={v.vehicleType === 'motorcycle' ? 'bicycle-outline' : 'car-outline'}
                        size={22}
                        color="#F56E0F"
                      />
                    </View>
                    <View style={styles.vehicleInfo}>
                      <Text style={styles.vehicleTitle}>{v.make} {v.model} {v.year}</Text>
                      <Text style={styles.vehicleSub}>{v.registrationNo}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
                  </TouchableOpacity>
                ))
            }
          </View>

          {/* Upcoming Appointments */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Next Appointment</Text>
            </View>

            {aLoad
              ? <ActivityIndicator color="#F56E0F" style={{ marginTop: 8 }} />
              : !upcomingAppt
                ? (
                  <TouchableOpacity
                    style={styles.addVehicleCard}
                    onPress={() => router.push('/customer/workshops' as any)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="calendar-outline" size={26} color="#F56E0F" />
                    <Text style={styles.addVehicleText}>Find a workshop & book</Text>
                  </TouchableOpacity>
                )
                : (
                  <TouchableOpacity
                    style={[styles.apptCard, { borderLeftColor: statusCfg?.dot }]}
                    activeOpacity={0.8}
                    onPress={() => router.push('/customer/schedule' as any)}
                  >
                    <View style={styles.apptHeader}>
                      <View style={[styles.statusBadge, { backgroundColor: statusCfg?.bg }]}>
                        <View style={[styles.statusDot, { backgroundColor: statusCfg?.dot }]} />
                        <Text style={[styles.statusText, { color: statusCfg?.text }]}>
                          {statusCfg?.label ?? upcomingAppt.status.replace('_', ' ')}
                        </Text>
                      </View>
                      <Text style={styles.apptDate}>
                        {new Date(upcomingAppt.scheduledDate).toLocaleDateString(undefined, {
                          weekday: 'short', day: 'numeric', month: 'short',
                        })}
                      </Text>
                    </View>

                    <Text style={styles.apptTitle}>{upcomingAppt.serviceType}</Text>
                    {getVehicleLabel(upcomingAppt) ? (
                      <Text style={styles.apptSub}>For {getVehicleLabel(upcomingAppt)}</Text>
                    ) : null}

                    <View style={styles.workshopBox}>
                      <Ionicons name="business-outline" size={16} color="#9CA3AF" />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.workshopName}>{getWorkshopLabel(upcomingAppt)}</Text>
                        {getWorkshopAddress(upcomingAppt) ? (
                          <Text style={styles.workshopAddr}>{getWorkshopAddress(upcomingAppt)}</Text>
                        ) : null}
                      </View>
                      <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
                    </View>
                  </TouchableOpacity>
                )
            }
          </View>

          {/* Quick Links */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickLinks}>
              {[
                { icon: 'search-outline' as const, label: 'Find Garage', href: '/customer/workshops' },
                { icon: 'calendar-outline' as const, label: 'Schedule', href: '/customer/schedule' },
                { icon: 'star-outline' as const, label: 'My Reviews', href: '/customer/reviews' },
                { icon: 'car-sport-outline' as const, label: 'Add Vehicle', href: '/customer/vehicles/add' },
              ].map(q => (
                <TouchableOpacity
                  key={q.label}
                  style={styles.quickLink}
                  onPress={() => router.push(q.href as any)}
                  activeOpacity={0.7}
                >
                  <View style={styles.quickLinkIconBox}>
                    <Ionicons name={q.icon} size={24} color="#F56E0F" />
                  </View>
                  <Text style={styles.quickLinkText}>{q.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  /* ── Dark Top Area ── */
  topSection: {
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 64,
    position: 'relative',
    overflow: 'hidden',
  },
  headerTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  headerText: { flex: 1 },
  greeting: { fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  userName: { fontSize: 26, color: '#FFFFFF', fontWeight: '900', letterSpacing: -0.5, marginTop: 4 },


  decCircle1: {
    position: 'absolute', width: 130, height: 130, borderRadius: 65,
    backgroundColor: 'rgba(245,110,15,0.13)', top: -25, right: -25,
  },
  decCircle2: {
    position: 'absolute', width: 70, height: 70, borderRadius: 35,
    backgroundColor: 'rgba(245,110,15,0.08)', bottom: 10, right: 90,
  },

  /* ── White Form Card Area ── */
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -38, // Overlaps top
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 16,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 130,
  },

  /* ── Stats ── */
  statsGrid: { flexDirection: 'row', gap: 14, marginBottom: 32 },
  statCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 18,
    padding: 16, alignItems: 'center',
    borderWidth: 1.5, borderColor: '#F3F4F6',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2,
  },
  statIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statValue: { fontSize: 30, fontWeight: '900', color: '#1A1A2E', marginBottom: 2 },
  statLabel: { fontSize: 10, color: '#6B7280', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },

  /* ── Sections ── */
  section: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#1A1A2E', letterSpacing: -0.3 },
  linkText: { fontSize: 13, fontWeight: '800', color: '#F56E0F', letterSpacing: 0.2 },

  /* ── Vehicles ── */
  addVehicleCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: '#FFF7ED', padding: 20, borderRadius: 16,
    borderWidth: 1.5, borderColor: '#F56E0F', borderStyle: 'dashed',
  },
  addVehicleText: { fontSize: 14, fontWeight: '800', color: '#C2410C' },

  vehicleCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FAFAFA', padding: 14, borderRadius: 16,
    borderWidth: 1.5, borderColor: '#E5E7EB', marginBottom: 10,
  },
  vehicleIconBox: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: '#FFF7ED', alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  vehicleInfo: { flex: 1 },
  vehicleTitle: { fontSize: 15, fontWeight: '800', color: '#1A1A2E' },
  vehicleSub: { fontSize: 13, color: '#6B7280', fontWeight: '600', marginTop: 2 },

  /* ── Appointments ── */
  apptCard: {
    backgroundColor: '#FFFFFF', borderRadius: 18,
    borderLeftWidth: 6, borderWidth: 1.5, borderColor: '#E5E7EB',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 14, elevation: 3,
    padding: 20,
  },
  apptHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, gap: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 12, fontWeight: '800', textTransform: 'capitalize' },
  apptDate: { fontSize: 13, fontWeight: '800', color: '#1A1A2E' },

  apptTitle: { fontSize: 18, fontWeight: '900', color: '#1A1A2E', marginBottom: 4, letterSpacing: -0.3 },
  apptSub: { fontSize: 13, color: '#6B7280', fontWeight: '600', marginBottom: 16 },

  workshopBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FAFAFA', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: '#F3F4F6',
  },
  workshopName: { fontSize: 14, fontWeight: '800', color: '#1A1A2E' },
  workshopAddr: { fontSize: 12, color: '#6B7280', fontWeight: '500', marginTop: 2 },

  /* ── Quick Links ── */
  quickLinks: { flexDirection: 'row', gap: 14 },
  quickLink: { flex: 1, alignItems: 'center' },
  quickLinkIconBox: {
    width: 60, height: 60, borderRadius: 18,
    backgroundColor: '#FFF7ED', alignItems: 'center', justifyContent: 'center',
    marginBottom: 8, borderWidth: 1.5, borderColor: '#FDE68A',
  },
  quickLinkText: { fontSize: 12, fontWeight: '700', color: '#1A1A2E', textAlign: 'center' },
}));
