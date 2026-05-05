import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useAppointment } from '../queries/queries';
import { useDeleteAppointment } from '../queries/mutations';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/feedback/Skeleton';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { ConfirmModal } from '@/components/feedback/ConfirmModal';
import { useToast } from '@/providers/ToastProvider';
import { formatDate } from '../../../utils/date.utils';

export function AppointmentDetailScreen() {
  const { theme } = useUnistyles();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const [showCancelModal, setShowCancelModal] = React.useState(false);

  const { data: appointment, isLoading, isError, refetch } = useAppointment(id as string);
  const { mutate: cancelAppointment, isPending: isCancelling } = useDeleteAppointment();

  const onConfirmCancel = () => {
    setShowCancelModal(false);
    cancelAppointment(id as string, {
      onSuccess: () => {
        showToast('Appointment cancelled successfully', 'success');
        router.back();
      },
      onError: () => {
        showToast('Failed to cancel appointment', 'error');
      },
    });
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <ScreenWrapper bg={theme.colors.text}>
        <View style={styles.topSection}>
          <View style={styles.header}>
            <View style={styles.backBtn} />
            <View style={styles.decCircle1} />
            <View style={styles.decCircle2} />
          </View>
        </View>
        <View style={styles.mainCard}>
          <View style={styles.skeletonWrap}>
            <Skeleton width="100%" height={100} borderRadius={20} />
            <View style={{ height: 16 }} />
            <Skeleton width="100%" height={200} borderRadius={20} />
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  if (isError || !appointment) {
    return <ErrorScreen onRetry={() => { refetch(); }} />;
  }

  const canModify = appointment.status === 'pending' || appointment.status === 'confirmed';

  return (
    <ScreenWrapper bg={theme.colors.text}>
      {/* ── DARK TOP SECTION ── */}
      <View style={styles.topSection}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => router.back()} 
            activeOpacity={0.7}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={24} color={theme.colors.white} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerSub}>Appointment</Text>
            <Text style={styles.headerTitle}>Booking Details</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        {/* Status strip in dark area */}
        <View style={styles.statusStrip}>
          <Text style={styles.serviceTypeText} numberOfLines={1}>{appointment.serviceType}</Text>
          <Badge
            label={appointment.status.replace('_', ' ')}
            variant={
              appointment.status === 'completed' ? 'success' :
              appointment.status === 'cancelled' ? 'error' :
              appointment.status === 'pending' ? 'warning' : 'primary'
            }
          />
        </View>

        <View style={styles.decCircle1} />
        <View style={styles.decCircle2} />
      </View>

      {/* ── WHITE CARD SECTION ── */}
      <View style={styles.mainCard}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Details List */}
          <View style={styles.detailsList}>
            <DetailItem
              icon="calendar-outline"
              label="Scheduled Date"
              value={formatDate(appointment.scheduledDate, 'PPP')}
            />
            <DetailItem
              icon="car-outline"
              label="Vehicle"
              value={
                typeof appointment.vehicleId === 'object' && appointment.vehicleId !== null
                  ? `${appointment.vehicleId.make} ${appointment.vehicleId.model} (${appointment.vehicleId.registrationNo})`
                  : 'Vehicle'
              }
            />
            <DetailItem
              icon="business-outline"
              label="Workshop"
              value={
                typeof appointment.workshopId === 'object' && appointment.workshopId !== null
                  ? appointment.workshopId.name
                  : 'Workshop'
              }
            />
            {appointment.notes ? (
              <DetailItem
                icon="document-text-outline"
                label="Notes"
                value={appointment.notes}
                isLast
              />
            ) : (
              <DetailItem
                icon="document-text-outline"
                label="Notes"
                value="No notes provided"
                isLast
              />
            )}
          </View>

          {/* Actions */}
          {canModify && (
            <View style={styles.actions}>
              <Button
                title="Reschedule Booking"
                onPress={() => router.push(`/customer/schedule/edit/${id}`)}
                variant="outline"
                style={styles.actionBtn}
                accessibilityLabel="Reschedule appointment"
              />
              <Button
                title="Cancel Appointment"
                onPress={() => setShowCancelModal(true)}
                variant="danger"
                loading={isCancelling}
                style={styles.actionBtn}
                accessibilityLabel="Cancel appointment"
              />
            </View>
          )}
        </ScrollView>
      </View>

      <ConfirmModal
        visible={showCancelModal}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, Cancel"
        cancelText="No, Keep it"
        type="danger"
        onConfirm={onConfirmCancel}
        onCancel={() => setShowCancelModal(false)}
      />
    </ScreenWrapper>
  );
}

function DetailItem({ icon, label, value, isLast }: { icon: any; label: string; value: string; isLast?: boolean }) {
  const { theme } = useUnistyles();
  return (
    <View style={[styles.detailItem, isLast && { borderBottomWidth: 0 }]}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={18} color={theme.colors.brand} />
      </View>
      <View style={styles.detailText}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  /* ── Dark top ── */
  topSection: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: 16,
    paddingBottom: 56,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: theme.colors.text,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
    marginTop: 12,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: theme.colors.whiteAlpha10,
    alignItems: 'center', justifyContent: 'center',
  },
  headerSub: {
    fontSize: theme.fonts.sizes.caption,
    color: theme.colors.whiteAlpha70,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
  },
  headerTitle: {
    fontSize: theme.fonts.sizes.pageTitle,
    fontWeight: '900',
    color: theme.colors.white,
    letterSpacing: -0.5,
    marginTop: 4,
    textAlign: 'center',
  },

  statusStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    zIndex: 10,
  },
  serviceTypeText: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.colors.white,
    flex: 1,
    marginRight: 12,
    letterSpacing: -0.3,
  },

  decCircle1: {
    zIndex: 0, position: 'absolute', width: 130, height: 130, borderRadius: 65,
    backgroundColor: theme.colors.brandMuted, top: -25, right: -25,
  },
  decCircle2: {
    zIndex: 0, position: 'absolute', width: 70, height: 70, borderRadius: 35,
    backgroundColor: theme.colors.brandSoft, bottom: 10, right: 90,
  },

  /* ── White card ── */
  mainCard: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: theme.spacing.cardOverlap,
    flex: 1,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 16,
  },
  scroll: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: 28,
    paddingBottom: 100,
  },
  skeletonWrap: {
    padding: theme.spacing.screenPadding,
    paddingTop: 28,
  },

  /* ── Details list ── */
  detailsList: {
    backgroundColor: theme.colors.background,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: theme.colors.borderLight,
    marginBottom: 28,
    overflow: 'hidden',
  },
  detailItem: {
    flexDirection: 'row',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    alignItems: 'center',
  },
  iconContainer: {
    width: 42, height: 42, borderRadius: 12,
    backgroundColor: theme.colors.warningBackground,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 16,
  },
  detailText: { flex: 1 },
  detailLabel: { fontSize: 11, fontWeight: '700', color: theme.colors.mutedLight, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.3 },
  detailValue: { fontSize: 15, fontWeight: '700', color: theme.colors.text, lineHeight: 20 },

  /* ── Actions ── */
  actions: { gap: 12 },
  actionBtn: { height: 56, borderRadius: 16 },
}));
