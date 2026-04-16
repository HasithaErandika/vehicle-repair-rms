import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useAuth } from '@/hooks';
import { useWorkshopAppointments } from '@/features/appointments/queries/queries';
import { useUpdateAppointmentStatus } from '@/features/appointments/queries/mutations';
import { useWorkshop } from '@/features/workshops/queries/queries';
import { Appointment } from '@/features/appointments/types/appointments.types';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { EmptyState } from '@/components/ui/EmptyState';

function BookingCard({
  appt,
  onStatusChange
}: {
  appt: Appointment;
  onStatusChange: (id: string, s: string) => void
}) {
  const customerName = typeof appt.userId === 'object' ? appt.userId.fullName : 'Customer';
  const vehicleName = typeof appt.vehicleId === 'object' ? `${appt.vehicleId.make} ${appt.vehicleId.model}` : 'Vehicle';

  return (
    <View style={styles.card}>
      <View style={styles.cardMain}>
        <View style={styles.cardHeader}>
          <View style={styles.infoCol}>
            {typeof appt.workshopId === 'object' && (appt.workshopId as any)?.name && (
              <Text style={styles.cardWorkshopName}>{(appt.workshopId as any).name}</Text>
            )}
            <Text style={styles.custName}>{customerName}</Text>
            <Text style={styles.vehName}>{vehicleName}</Text>
          </View>
          <View style={[styles.statusBadge, appt.status === 'confirmed' ? styles.statusConfirmed : styles.statusPending]}>
            <Text style={[styles.statusTabText, appt.status === 'confirmed' ? { color: '#059669' } : { color: '#D97706' }]}>
              {appt.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
            <Text style={styles.metaText}>{new Date(appt.scheduledDate).toLocaleDateString()}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="build-outline" size={14} color="#6B7280" />
            <Text style={styles.metaText}>{appt.serviceType}</Text>
          </View>
        </View>
      </View>

      {appt.status === 'pending' && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.declineBtn}
            onPress={() => onStatusChange(appt._id!, 'cancelled')}
          >
            <Text style={styles.declineText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.approveBtn}
            onPress={() => onStatusChange(appt._id!, 'confirmed')}
          >
            <Text style={styles.approveText}>Approve</Text>
          </TouchableOpacity>
        </View>
      )}

      {appt.status === 'confirmed' && (
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => onStatusChange(appt.id!, 'in_progress')}
          >
            <Ionicons name="play-circle" size={18} color="#FFFFFF" />
            <Text style={styles.actionBtnText}>Start Repair Job</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default function BookingsScreen() {
  const router = useRouter();
  const { workshopId: paramWorkshopId } = useLocalSearchParams<{ workshopId: string }>();
  const { user } = useAuth();
  const [status, setStatus] = useState<'pending' | 'confirmed' | 'completed' | 'cancelled'>('pending');

  const { data, isLoading, isError, refetch } = useWorkshopAppointments(user?.workshopId, status);
  const { mutate: updateStatus } = useUpdateAppointmentStatus();

  // Deduplicate by id — guards against backend returning same appointment twice
  const appointments = useMemo(() => {
    const seen = new Set<string>();
    return (data ?? []).filter(a => {
      const key = (a as any).id || (a as any)._id;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [data]);

  const handleStatusUpdate = (id: string, s: string) => {
    updateStatus({ id, status: s });
  };

  const workshopName = (!targetWorkshopId || targetWorkshopId === 'all')
    ? 'All Workshops'
    : (typeof workshop === 'object' ? (workshop as any).name : 'Workshop');

  return (
    <ScreenWrapper bg="#1A1A2E">
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />

      {/* ── DARK TOP SECTION ── */}
      <View style={styles.topSection}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerSub}>Management</Text>
            <Text style={styles.headerTitle} numberOfLines={1}>{workshopName}</Text>
          </View>
          <TouchableOpacity
            style={styles.jobsBtn}
            onPress={() => router.push('/owner/jobs' as any)}
          >
            <Ionicons name="hammer-outline" size={20} color="#FFFFFF" />
            <Text style={styles.jobsBtnText}>Jobs</Text>
          </TouchableOpacity>
        </View>

        {/* Status Tabs */}
        <View style={styles.tabContainer}>
          {(['pending', 'confirmed', 'completed'] as const).map((s) => (
            <TouchableOpacity
              key={s}
              onPress={() => setStatus(s)}
              style={[styles.tab, status === s && styles.activeTab]}
            >
              <Text style={[styles.tabText, status === s && styles.activeTabText]}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Text>
              {status === s && <View style={styles.activeLine} />}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.decCircle1} />
        <View style={styles.decCircle2} />
      </View>

      {/* ── WHITE CARD SECTION ── */}
      <View style={styles.mainCard}>
        {isLoading && !data ? (
          <View style={styles.centered}><ActivityIndicator size="large" color="#F56E0F" /></View>
        ) : isError ? (
          <ErrorScreen onRetry={refetch} variant="inline" />
        ) : (
          <FlashList
            data={(data || []) as Appointment[]}
            renderItem={({ item }) => <BookingCard appt={item as Appointment} onStatusChange={handleStatusUpdate} />}
            // @ts-expect-error - FlashList requires estimatedItemSize dynamically
            estimatedItemSize={140}
            onRefresh={refetch}
            refreshing={isLoading}
            keyExtractor={(a: Appointment) => a._id || a.id || Math.random().toString()}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<EmptyState message={`No ${status} bookings found.`} />}
          />
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  topSection: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: 16,
    paddingBottom: 20,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#1A1A2E'
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 10, marginBottom: 20 },
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
  jobsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  jobsBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  tabContainer: { flexDirection: 'row', gap: 20, zIndex: 10 },
  tab: { paddingVertical: 8, position: 'relative' },
  tabText: { fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: '700' },
  activeTabText: { color: '#FFFFFF' },
  activeLine: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, backgroundColor: '#F56E0F', borderRadius: 2 },
  activeTab: {},

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
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: 24,
    paddingBottom: 130
  },

  card: { backgroundColor: '#FFFFFF', borderRadius: 24, marginBottom: 16, borderWidth: 1.5, borderColor: '#F3F4F6', overflow: 'hidden' },
  cardMain: { padding: 18 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  infoCol: { flex: 1 },
  custName: { fontSize: 16, fontWeight: '900', color: '#1A1A2E' },
  cardWorkshopName: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EA580C',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  vehName: { fontSize: 13, color: '#6B7280', fontWeight: '600', marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusConfirmed: { backgroundColor: '#ECFDF5' },
  statusPending: { backgroundColor: '#FFFBEB' },
  statusTabText: { fontSize: 9, fontWeight: '800' },

  metaRow: { flexDirection: 'row', gap: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12, fontWeight: '700', color: '#6B7280' },

  actionRow: { flexDirection: 'row', borderTopWidth: 1.5, borderTopColor: '#F3F4F6' },
  declineBtn: { flex: 1, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1.5, borderRightColor: '#F3F4F6' },
  approveBtn: { flex: 1, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F56E0F' },
  declineText: { fontSize: 14, fontWeight: '800', color: '#EF4444' },
  approveText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  
  actionContainer: {
    flexDirection: 'row',
    marginTop: 12,
    borderTopWidth: 1.5,
    borderTopColor: '#F3F4F6',
    paddingTop: 14,
    paddingBottom: 4,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
}));
