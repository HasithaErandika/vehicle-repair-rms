import React, { useState } from 'react';
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
import { Appointment, AppointmentStatus } from '@/features/appointments/types/appointments.types';

const TABS: { label: string; status: AppointmentStatus }[] = [
  { label: 'Pending',   status: 'pending'   },
  { label: 'Confirmed', status: 'confirmed' },
];

function getVehicleLabel(a: Appointment): string {
  if (typeof a.vehicleId === 'object') {
    return `${a.vehicleId.make} ${a.vehicleId.model} · ${a.vehicleId.registrationNo}`;
  }
  return a.vehicleId;
}

function getCustomerLabel(a: Appointment): string {
  if (typeof a.userId === 'object') return a.userId.fullName ?? a.userId.email;
  return 'Customer';
}

function AppointmentCard({
  item, onAccept, onStart,
}: {
  item: Appointment;
  onAccept: (id: string) => void;
  onStart:  (id: string) => void;
}) {
  const { theme } = useUnistyles();
  const id = item._id ?? item.id ?? '';
  const date = new Date(item.scheduledDate).toLocaleDateString(undefined, {
    weekday: 'short', day: 'numeric', month: 'short',
  });

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.timeChip}>
          <Ionicons name="calendar-outline" size={12} color={theme.colors.brand} />
          <Text style={styles.timeText}>{date}</Text>
        </View>
        <View style={[
          styles.badge,
          item.status === 'pending' ? styles.badgePending : styles.badgeConfirmed,
        ]}>
          <Text style={[
            styles.badgeText,
            item.status === 'pending' ? styles.textPending : styles.textConfirmed,
          ]}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.vehicleName}>{getVehicleLabel(item)}</Text>
      <Text style={styles.serviceName}>{item.serviceType}</Text>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <View style={styles.ownerRow}>
          <View style={styles.avatarMini}>
            <Text style={styles.avatarMiniText}>{getCustomerLabel(item)[0]?.toUpperCase() ?? '?'}</Text>
          </View>
          <Text style={styles.ownerName}>{getCustomerLabel(item)}</Text>
        </View>

        {item.status === 'pending' && (
          <TouchableOpacity style={styles.actionBtn} onPress={() => onAccept(id)}>
            <Text style={styles.actionBtnText}>Accept</Text>
          </TouchableOpacity>
        )}
        {item.status === 'confirmed' && (
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#059669' }]} onPress={() => onStart(id)}>
            <Text style={styles.actionBtnText}>Start Job</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function StaffAppointmentsScreen() {
  const { theme } = useUnistyles();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const workshopId = user?.workshopId;
  const status = TABS[activeTab].status;

  const { data, isLoading, isError, refetch } = useWorkshopAppointments(workshopId, status);
  const { mutate: updateStatus, isPending } = useUpdateAppointmentStatus();

  const handleAccept = (id: string) =>
    Alert.alert('Accept Appointment', 'Confirm this booking?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Accept', onPress: () => updateStatus({ id, status: 'confirmed' }) },
    ]);

  const handleStart = (id: string) =>
    Alert.alert('Start Job', 'Mark this appointment as in progress?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Start', onPress: () => updateStatus({ id, status: 'in_progress' }) },
    ]);

  if (isError) return <ErrorScreen onRetry={refetch} />;

  return (
    <ScreenWrapper bg={theme.colors.surface}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Appointments</Text>
        {isPending
          ? <ActivityIndicator color={theme.colors.brand} />
          : <Text style={styles.headerCount}>{data?.length ?? 0} {TABS[activeTab].label}</Text>
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
              <AppointmentCard item={item} onAccept={handleAccept} onStart={handleStart} />
            )}
            estimatedItemSize={180}
            onRefresh={refetch}
            refreshing={isLoading}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<EmptyState message={`No ${TABS[activeTab].label.toLowerCase()} appointments.`} />}
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

  tabs: {
    flexDirection: 'row', backgroundColor: theme.colors.background,
    marginHorizontal: theme.spacing.md, marginVertical: 12,
    borderRadius: 10, padding: 3,
  },
  tab: { flex: 1, paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  tabActive: { backgroundColor: theme.colors.surface, elevation: 2 },
  tabText: { fontSize: 13, fontWeight: '700', color: theme.colors.muted },
  tabTextActive: { color: theme.colors.text },

  list: { paddingHorizontal: theme.spacing.md, paddingBottom: 120 },

  card: {
    backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg,
    padding: theme.spacing.md, marginBottom: theme.spacing.md,
    borderWidth: 1, borderColor: theme.colors.border, elevation: 1,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  timeChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: theme.colors.brandSoft, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
  },
  timeText: { fontSize: 11, fontWeight: '700', color: theme.colors.brand },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgePending: { backgroundColor: '#FFFBEB' },
  badgeConfirmed: { backgroundColor: '#ECFDF5' },
  badgeText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  textPending: { color: '#D97706' },
  textConfirmed: { color: '#059669' },

  vehicleName: { fontSize: 17, fontWeight: '900', color: theme.colors.text, marginBottom: 3 },
  serviceName: { fontSize: 13, color: theme.colors.muted, fontWeight: '600', marginBottom: 14 },

  divider: { height: 1, backgroundColor: theme.colors.border, marginBottom: 14 },

  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ownerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatarMini: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: theme.colors.border, alignItems: 'center', justifyContent: 'center',
  },
  avatarMiniText: { fontSize: 12, fontWeight: '800', color: theme.colors.text },
  ownerName: { fontSize: 13, fontWeight: '700', color: theme.colors.text },
  actionBtn: {
    backgroundColor: theme.colors.brand, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8,
  },
  actionBtnText: { color: '#fff', fontSize: 13, fontWeight: '800' },
}));
