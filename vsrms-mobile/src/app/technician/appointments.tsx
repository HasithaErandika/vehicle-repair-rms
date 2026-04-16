import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StatusBar, ScrollView } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useAuth } from '@/hooks';
import { useWorkshopAppointments } from '@/features/appointments/queries/queries';
import { useUpdateAppointmentStatus } from '@/features/appointments/queries/mutations';
import { Appointment } from '@/features/appointments/types/appointments.types';
import { AppointmentCard } from '@/features/appointments/components/AppointmentCard';
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
  const router = useRouter();
  const { user } = useAuth();
  const [status, setStatus] = useState<'pending' | 'confirmed' | 'completed'>('pending');

  const { data, isLoading, isError, refetch } = useWorkshopAppointments(user?.workshopId, status);
  const { mutate: updateStatus } = useUpdateAppointmentStatus();

  // Deduplicate by id — guards against backend returning same appointment twice
  const appointments = React.useMemo(() => {
    const seen = new Set<string>();
    return (data ?? []).filter(a => {
      const key = (a as any).id || (a as any)._id;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [data]);

  // Smart Switching logic
  React.useEffect(() => {
    if (!initialStatus && !pLoad && !cLoad && !iLoadCount) {
      if ((pData?.length ?? 0) === 0) {
        if ((iData?.length ?? 0) > 0) {
          setStatus('in_progress');
        } else if ((cData?.length ?? 0) > 0) {
          setStatus('confirmed');
        }
      }
    }
  }, [pLoad, cLoad, iLoadCount, pData, cData, iData, initialStatus]);

  // Handle incoming status from params
  React.useEffect(() => {
    if (initialStatus) {
      setStatus(initialStatus);
    }
  }, [initialStatus]);

  const handleAccept = (id: string) => {
    updateStatus({ id, status: 'confirmed' });
  };

  const handleStart = (id: string) => {
    updateStatus({ id, status: 'in_progress' });
  };

  const handleFinalize = (id: string) => {
    router.push({ 
      pathname: '/technician/record', 
      params: { appointmentId: id } 
    } as any);
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

  tabScroll: { zIndex: 10 },
  tabContainer: { flexDirection: 'row', gap: 24 },
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
}));
