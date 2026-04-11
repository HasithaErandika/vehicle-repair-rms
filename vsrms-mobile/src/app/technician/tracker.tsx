import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/hooks';
import { useWorkshopAppointments } from '@/features/appointments/queries/queries';
import { useUpdateAppointmentStatus } from '@/features/appointments/queries/mutations';
import { Appointment } from '@/features/appointments/types/appointments.types';

function getVehicleLabel(a: Appointment): string {
  if (typeof a.vehicleId === 'object') return `${a.vehicleId.make} ${a.vehicleId.model}`;
  return 'Vehicle';
}

function getVehicleReg(a: Appointment): string {
  if (typeof a.vehicleId === 'object') return a.vehicleId.registrationNo;
  return '';
}

function getCustomerLabel(a: Appointment): string {
  if (typeof a.userId === 'object') return a.userId.fullName ?? a.userId.email;
  return 'Customer';
}

function TrackerCard({
  item, onComplete,
}: {
  item: Appointment;
  onComplete: (id: string) => void;
}) {
  const { theme } = useUnistyles();
  const id = item._id ?? item.id ?? '';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.vehicleBlock}>
          <Text style={styles.vehicleName}>{getVehicleLabel(item)}</Text>
          <Text style={styles.vehicleReg}>{getVehicleReg(item)}</Text>
        </View>
        <View style={styles.inProgressChip}>
          <View style={styles.dot} />
          <Text style={styles.inProgressText}>In Progress</Text>
        </View>
      </View>

      <View style={styles.metaGrid}>
        <View style={styles.metaItem}>
          <Ionicons name="person-outline" size={13} color={theme.colors.muted} />
          <Text style={styles.metaText}>{getCustomerLabel(item)}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="construct-outline" size={13} color={theme.colors.muted} />
          <Text style={styles.metaText}>{item.serviceType}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={13} color={theme.colors.muted} />
          <Text style={styles.metaText}>
            {new Date(item.scheduledDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
          </Text>
        </View>
      </View>

      {item.notes ? (
        <View style={styles.notesBox}>
          <Text style={styles.notesText} numberOfLines={2}>{item.notes}</Text>
        </View>
      ) : null}

      <TouchableOpacity style={styles.completeBtn} onPress={() => onComplete(id)}>
        <Ionicons name="checkmark-done-outline" size={18} color="#fff" />
        <Text style={styles.completeBtnText}>Mark Complete</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function StaffTrackerScreen() {
  const { theme } = useUnistyles();
  const { user } = useAuth();

  const workshopId = user?.workshopId;
  const { data, isLoading, isError, refetch } = useWorkshopAppointments(workshopId, 'in_progress');
  const { mutate: updateStatus, isPending } = useUpdateAppointmentStatus();

  const handleComplete = (id: string) => {
    Alert.alert('Complete Job', 'Mark this job as completed? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Complete', onPress: () => updateStatus({ id, status: 'completed' }) },
    ]);
  };

  if (isError) return <ErrorScreen onRetry={refetch} />;

  return (
    <ScreenWrapper bg={theme.colors.surface}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Job Tracker</Text>
        {isPending
          ? <ActivityIndicator color={theme.colors.brand} />
          : <Text style={styles.headerCount}>{data?.length ?? 0} active</Text>
        }
      </View>

      {isLoading
        ? <ActivityIndicator style={{ marginTop: 40 }} size="large" color={theme.colors.brand} />
        : (
          <FlashList<Appointment>
            data={data ?? []}
            keyExtractor={a => a._id ?? a.id ?? ''}
            renderItem={({ item }) => <TrackerCard item={item} onComplete={handleComplete} />}
            estimatedItemSize={200}
            onRefresh={refetch}
            refreshing={isLoading}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<EmptyState message="No active jobs at this time." />}
          />
        )
      }
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.md, paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border,
  },
  headerTitle: { fontSize: 24, fontWeight: '900', color: theme.colors.text, letterSpacing: -0.5 },
  headerCount: { fontSize: 13, color: theme.colors.muted, fontWeight: '700' },

  list: { paddingHorizontal: theme.spacing.md, paddingBottom: 120 },

  card: {
    backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg,
    padding: theme.spacing.md, marginBottom: theme.spacing.md,
    borderWidth: 1, borderColor: theme.colors.border, elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  vehicleBlock: { flex: 1 },
  vehicleName: { fontSize: 18, fontWeight: '900', color: theme.colors.text, letterSpacing: -0.3 },
  vehicleReg: { fontSize: 12, color: theme.colors.muted, fontWeight: '700', letterSpacing: 0.5, marginTop: 2 },

  inProgressChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#EFF6FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#3B82F6' },
  inProgressText: { fontSize: 10, fontWeight: '800', color: '#2563EB' },

  metaGrid: { gap: 6, marginBottom: 14 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 13, color: theme.colors.muted, fontWeight: '500' },

  notesBox: {
    backgroundColor: theme.colors.background, borderRadius: 8, padding: 10, marginBottom: 14,
    borderWidth: 1, borderColor: theme.colors.border,
  },
  notesText: { fontSize: 12, color: theme.colors.muted, fontStyle: 'italic' },

  completeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 46, borderRadius: 10, backgroundColor: '#059669',
  },
  completeBtnText: { fontSize: 14, fontWeight: '800', color: '#fff' },
}));
