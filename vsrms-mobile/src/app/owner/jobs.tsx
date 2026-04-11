import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/hooks';
import { useWorkshopAppointments } from '@/features/appointments/queries/queries';
import { useUpdateAppointmentStatus } from '@/features/appointments/queries/mutations';
import { Appointment } from '@/features/appointments/types/appointments.types';

function getVehicleLabel(a: Appointment): string {
  if (typeof a.vehicleId === 'object') {
    return `${a.vehicleId.make} ${a.vehicleId.model}`;
  }
  return 'Vehicle';
}

function getVehicleReg(a: Appointment): string {
  if (typeof a.vehicleId === 'object') return a.vehicleId.registrationNo;
  return a.vehicleId;
}

function getCustomerLabel(a: Appointment): string {
  if (typeof a.userId === 'object') return a.userId.fullName ?? a.userId.email;
  return 'Customer';
}

function JobCard({
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
        <View style={styles.inProgressBadge}>
          <View style={styles.inProgressDot} />
          <Text style={styles.inProgressText}>In Progress</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Ionicons name="person-outline" size={14} color={theme.colors.muted} />
        <Text style={styles.metaText}>{getCustomerLabel(item)}</Text>
      </View>
      <View style={styles.metaRow}>
        <Ionicons name="construct-outline" size={14} color={theme.colors.muted} />
        <Text style={styles.metaText}>{item.serviceType}</Text>
      </View>
      <View style={styles.metaRow}>
        <Ionicons name="calendar-outline" size={14} color={theme.colors.muted} />
        <Text style={styles.metaText}>
          {new Date(item.scheduledDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
        </Text>
      </View>

      <TouchableOpacity style={styles.completeBtn} onPress={() => onComplete(id)}>
        <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
        <Text style={styles.completeBtnText}>Mark as Completed</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function JobTrackerScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { user } = useAuth();

  const workshopId = user?.workshopId;
  const { data, isLoading, isError, refetch } = useWorkshopAppointments(workshopId, 'in_progress');
  const { mutate: updateStatus, isPending } = useUpdateAppointmentStatus();

  const handleComplete = (id: string) => {
    Alert.alert('Complete Job', 'Mark this job as completed?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Complete', onPress: () => updateStatus({ id, status: 'completed' }) },
    ]);
  };

  if (isError) return <ErrorScreen onRetry={refetch} />;

  return (
    <ScreenWrapper bg={theme.colors.surface}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Active Jobs</Text>
        {isPending
          ? <ActivityIndicator color={theme.colors.brand} />
          : <View style={{ width: 28 }} />
        }
      </View>

      {isLoading
        ? <ActivityIndicator style={{ marginTop: 40 }} size="large" color={theme.colors.brand} />
        : (
          <FlashList<Appointment>
            data={data ?? []}
            keyExtractor={a => a._id ?? a.id ?? ''}
            renderItem={({ item }) => <JobCard item={item} onComplete={handleComplete} />}
            estimatedItemSize={180}
            onRefresh={refetch}
            refreshing={isLoading}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<EmptyState message="No active jobs right now." />}
          />
        )
      }
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.text },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background,
  },

  list: { paddingHorizontal: theme.spacing.md, paddingBottom: 100 },

  card: {
    backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg,
    padding: theme.spacing.md, marginBottom: theme.spacing.sm,
    borderWidth: 1, borderColor: theme.colors.border,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  vehicleBlock: { flex: 1 },
  vehicleName: { fontSize: 16, fontWeight: '900', color: theme.colors.text, letterSpacing: -0.3 },
  vehicleReg: { fontSize: 12, color: theme.colors.muted, fontWeight: '600', marginTop: 2 },

  inProgressBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#EFF6FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
  },
  inProgressDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#3B82F6' },
  inProgressText: { fontSize: 11, fontWeight: '800', color: '#2563EB' },

  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  metaText: { fontSize: 13, color: theme.colors.muted, fontWeight: '500' },

  completeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 44, borderRadius: 10, backgroundColor: '#059669', marginTop: 14,
  },
  completeBtnText: { fontSize: 14, fontWeight: '800', color: '#fff' },
}));
