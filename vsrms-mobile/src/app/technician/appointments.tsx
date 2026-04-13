import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useAuth } from '@/hooks';
import { useWorkshopAppointments } from '@/features/appointments/queries/queries';
import { useUpdateAppointmentStatus } from '@/features/appointments/queries/mutations';
import { Appointment } from '@/features/appointments/types/appointments.types';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { EmptyState } from '@/components/ui/EmptyState';

function ApptCard({
  appt,
  onAccept
}: {
  appt: Appointment;
  onAccept: (id: string) => void
}) {
  const customerName = typeof appt.userId === 'object' ? appt.userId.fullName : 'Customer';
  const vehicleName = typeof appt.vehicleId === 'object' ? `${appt.vehicleId.make} ${appt.vehicleId.model}` : 'Vehicle';

  return (
    <View style={styles.card}>
      <View style={styles.cardBody}>
        <View style={styles.statusRow}>
          <View style={[styles.pill, { backgroundColor: appt.status === 'confirmed' ? '#ECFDF5' : '#FFFBEB' }]}>
            <Text style={[styles.pillText, { color: appt.status === 'confirmed' ? '#059669' : '#D97706' }]}>
              {appt.status.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.dateText}>{new Date(appt.scheduledDate).toLocaleDateString()}</Text>
        </View>

        <Text style={styles.serviceTitle}>{appt.serviceType}</Text>
        <Text style={styles.ownerText}>{customerName} • {vehicleName}</Text>
      </View>

      {appt.status === 'pending' && (
        <TouchableOpacity style={styles.acceptBtn} onPress={() => onAccept(appt._id!)}>
          <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
          <Text style={styles.acceptText}>Accept Job</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function TechnicianAppointmentsScreen() {
  const { user } = useAuth();
  const [status, setStatus] = useState<'pending' | 'confirmed' | 'completed'>('pending');

  const { data, isLoading, isError, refetch } = useWorkshopAppointments(user?.workshopId, status);
  const { mutate: updateStatus } = useUpdateAppointmentStatus();

  const handleAccept = (id: string) => {
    updateStatus({ id, status: 'confirmed' });
  };

  return (
    <ScreenWrapper bg="#1A1A2E">
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />

      {/* ── DARK TOP SECTION ── */}
      <View style={styles.topSection}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerSub}>Shift Schedule</Text>
            <Text style={styles.headerTitle}>Appointments</Text>
          </View>
        </View>

        {/* Custom Tabs */}
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
      <View style={[styles.mainCard, { overflow: 'hidden' }]}>
        {isLoading && !data ? (
          <View style={styles.centered}><ActivityIndicator size="large" color="#F56E0F" /></View>
        ) : isError ? (
          <ErrorScreen onRetry={refetch} variant="inline" />
        ) : (
          <FlashList<Appointment>
            data={data || []}
            renderItem={({ item }) => <ApptCard appt={item} onAccept={handleAccept} />}
            // @ts-expect-error - FlashList requires estimatedItemSize dynamically
            estimatedItemSize={140}
            onRefresh={refetch}
            refreshing={isLoading}
            keyExtractor={(a) => a._id || a.id || Math.random().toString()}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<EmptyState message={`No ${status} tasks assigned yet.`} />}
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
    paddingBottom: theme.spacing.headerBottom,
    position: 'relative',
    overflow: 'hidden'
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

  tabContainer: { flexDirection: 'row', gap: 20, zIndex: 10 },
  tab: { paddingVertical: 8, position: 'relative' },
  activeTab: {},
  tabText: { fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: '700' },
  activeTabText: { color: '#FFFFFF' },
  activeLine: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, backgroundColor: '#F56E0F', borderRadius: 2 },

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

  card: { backgroundColor: '#FFFFFF', borderRadius: 22, marginBottom: 16, borderWidth: 1.5, borderColor: '#F3F4F6', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
  cardBody: { padding: 18 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  pill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  pillText: { fontSize: 9, fontWeight: '800' },
  dateText: { fontSize: 12, fontWeight: '700', color: '#9CA3AF' },
  serviceTitle: { fontSize: 17, fontWeight: '900', color: '#1A1A2E', letterSpacing: -0.3 },
  ownerText: { fontSize: 13, color: '#6B7280', fontWeight: '600', marginTop: 4 },

  acceptBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#F56E0F', paddingVertical: 14 },
  acceptText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14, textTransform: 'uppercase' },
}));
