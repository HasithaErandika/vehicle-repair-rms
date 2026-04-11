import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
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
import { Appointment, AppointmentStatus } from '@/features/appointments/types/appointments.types';

const TABS = [
  { label: 'Pending',    status: 'pending'   as AppointmentStatus },
  { label: 'Confirmed',  status: 'confirmed' as AppointmentStatus },
  { label: 'In Progress',status: 'in_progress' as AppointmentStatus },
];

const STATUS_NEXT: Record<AppointmentStatus, { label: string; next: AppointmentStatus } | null> = {
  pending:     { label: 'Accept',   next: 'confirmed'   },
  confirmed:   { label: 'Start Job', next: 'in_progress' },
  in_progress: { label: 'Complete', next: 'completed'   },
  completed:   null,
  cancelled:   null,
};

function getVehicleLabel(a: Appointment): string {
  if (typeof a.vehicleId === 'object') {
    return `${a.vehicleId.make} ${a.vehicleId.model} · ${a.vehicleId.registrationNo}`;
  }
  return a.vehicleId;
}

function getCustomerLabel(a: Appointment): string {
  if (typeof a.userId === 'object') {
    return a.userId.fullName ?? a.userId.email;
  }
  return 'Unknown';
}

function getCustomerInitial(a: Appointment): string {
  return getCustomerLabel(a)[0]?.toUpperCase() ?? '?';
}

function BookingCard({
  item, onAdvance, onCancel,
}: {
  item: Appointment;
  onAdvance: (id: string, next: AppointmentStatus) => void;
  onCancel:  (id: string) => void;
}) {
  const { theme } = useUnistyles();
  const id   = item._id ?? item.id ?? '';
  const next = STATUS_NEXT[item.status];
  const date = new Date(item.scheduledDate).toLocaleDateString(undefined, {
    weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.customerRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getCustomerInitial(item)}</Text>
          </View>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{getCustomerLabel(item)}</Text>
            <Text style={styles.vehicleText} numberOfLines={1}>{getVehicleLabel(item)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Ionicons name="construct-outline" size={14} color={theme.colors.muted} />
        <Text style={styles.metaText}>{item.serviceType}</Text>
      </View>
      <View style={styles.metaRow}>
        <Ionicons name="calendar-outline" size={14} color={theme.colors.brand} />
        <Text style={[styles.metaText, { color: theme.colors.brand }]}>{date}</Text>
      </View>
      {item.notes ? (
        <View style={styles.metaRow}>
          <Ionicons name="document-text-outline" size={14} color={theme.colors.muted} />
          <Text style={styles.metaText} numberOfLines={2}>{item.notes}</Text>
        </View>
      ) : null}

      <View style={styles.footerRow}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => onCancel(id)}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        {next && (
          <TouchableOpacity
            style={styles.advanceBtn}
            onPress={() => onAdvance(id, next.next)}
          >
            <Text style={styles.advanceText}>{next.label}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function BookingManagementScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const workshopId = user?.workshopId;
  const status = TABS[activeTab].status;

  const { data, isLoading, isError, refetch } = useWorkshopAppointments(workshopId, status);
  const { mutate: updateStatus, isPending } = useUpdateAppointmentStatus();

  const handleAdvance = (id: string, next: AppointmentStatus) => {
    Alert.alert('Confirm', `Move appointment to "${next.replace('_', ' ')}"?`, [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => updateStatus({ id, status: next }) },
    ]);
  };

  const handleCancel = (id: string) => {
    Alert.alert('Cancel Appointment', 'This will cancel the appointment. Continue?', [
      { text: 'No', style: 'cancel' },
      { text: 'Cancel Booking', style: 'destructive', onPress: () => updateStatus({ id, status: 'cancelled' }) },
    ]);
  };

  if (isError) return <ErrorScreen onRetry={refetch} />;

  return (
    <ScreenWrapper bg={theme.colors.surface}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Management</Text>
        {isPending
          ? <ActivityIndicator color={theme.colors.brand} />
          : <View style={{ width: 28 }} />
        }
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((t, i) => (
          <TouchableOpacity
            key={t.status}
            style={[styles.tab, activeTab === i && styles.tabActive]}
            onPress={() => setActiveTab(i)}
          >
            <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading
        ? <ActivityIndicator style={{ marginTop: 40 }} size="large" color={theme.colors.brand} />
        : (
          <FlashList<Appointment>
            data={data ?? []}
            keyExtractor={a => a._id ?? a.id ?? ''}
            renderItem={({ item }) => (
              <BookingCard item={item} onAdvance={handleAdvance} onCancel={handleCancel} />
            )}
            estimatedItemSize={200}
            onRefresh={refetch}
            refreshing={isLoading}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<EmptyState message={`No ${TABS[activeTab].label.toLowerCase()} bookings.`} />}
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

  tabs: {
    flexDirection: 'row', backgroundColor: theme.colors.background,
    marginHorizontal: theme.spacing.md, marginVertical: 12,
    borderRadius: 10, padding: 3,
  },
  tab: { flex: 1, paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  tabActive: { backgroundColor: theme.colors.surface, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 12, fontWeight: '700', color: theme.colors.muted },
  tabTextActive: { color: theme.colors.text },

  list: { paddingHorizontal: theme.spacing.md, paddingBottom: 100 },

  card: {
    backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg,
    padding: theme.spacing.md, marginBottom: theme.spacing.sm,
    borderWidth: 1, borderColor: theme.colors.border,
  },
  cardHeader: { marginBottom: 12 },
  customerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: theme.colors.brandSoft, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '800', color: theme.colors.brand },
  customerInfo: { flex: 1 },
  customerName: { fontSize: 15, fontWeight: '800', color: theme.colors.text },
  vehicleText: { fontSize: 12, color: theme.colors.muted, fontWeight: '600', marginTop: 1 },

  metaRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  metaText: { flex: 1, fontSize: 13, color: theme.colors.muted, fontWeight: '500' },

  footerRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  cancelBtn: {
    flex: 1, height: 42, borderRadius: 10,
    borderWidth: 1, borderColor: theme.colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  cancelText: { fontSize: 13, fontWeight: '700', color: theme.colors.text },
  advanceBtn: {
    flex: 2, height: 42, borderRadius: 10,
    backgroundColor: theme.colors.brand, alignItems: 'center', justifyContent: 'center',
  },
  advanceText: { fontSize: 13, fontWeight: '800', color: '#fff' },
}));
