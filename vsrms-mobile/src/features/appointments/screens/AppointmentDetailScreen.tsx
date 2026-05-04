import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useAppointment } from '../queries/queries';
import { useDeleteAppointment } from '../queries/mutations';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/feedback/Skeleton';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { formatDate } from '../../../utils/date.utils';

export function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const { data: appointment, isLoading, isError, refetch } = useAppointment(id as string);
  const { mutate: cancelAppointment, isPending: isCancelling } = useDeleteAppointment();

  const handleCancel = () => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this booking? This action cannot be undone.',
      [
        { text: 'No, Keep it', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: () => {
            cancelAppointment(id as string, {
              onSuccess: () => {
                Alert.alert('Success', 'Appointment cancelled successfully');
                router.back();
              }
            });
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <ScreenWrapper bg="#F9FAFB">
        <View style={styles.loadingContainer}>
          <Skeleton width="90%" height={200} borderRadius={24} />
          <View style={{ height: 20 }} />
          <Skeleton width="70%" height={24} borderRadius={8} />
          <View style={{ height: 10 }} />
          <Skeleton width="40%" height={16} borderRadius={8} />
        </View>
      </ScreenWrapper>
    );
  }

  if (isError || !appointment) {
    return <ErrorScreen onRetry={refetch} />;
  }

  const isPending = appointment.status === 'pending';

  return (
    <ScreenWrapper bg="#F9FAFB">
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#1A1A2E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking Details</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View>
              <Text style={styles.statusLabel}>Service Status</Text>
              <Text style={styles.serviceTitle}>{appointment.serviceType}</Text>
            </View>
            <Badge 
              label={appointment.status.replace('_', ' ')} 
              variant={
                appointment.status === 'completed' ? 'success' : 
                appointment.status === 'cancelled' ? 'error' : 
                appointment.status === 'pending' ? 'warning' : 'primary'
              } 
            />
          </View>
        </View>

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
            value={typeof appointment.vehicleId === 'object' && appointment.vehicleId !== null ? `${appointment.vehicleId.make} ${appointment.vehicleId.model} (${appointment.vehicleId.registrationNo})` : 'Vehicle'} 
          />
          <DetailItem 
            icon="business-outline" 
            label="Workshop" 
            value={typeof appointment.workshopId === 'object' && appointment.workshopId !== null ? appointment.workshopId.name : 'Workshop'} 
          />
          {appointment.notes ? (
            <DetailItem 
              icon="document-text-outline" 
              label="Notes" 
              value={appointment.notes} 
              isLast
            />
          ) : null}
        </View>

        {/* Actions */}
        {isPending && (
          <View style={styles.actions}>
            <Button 
              title="Reschedule Booking" 
              onPress={() => router.push(`/customer/schedule/edit/${id}`)}
              variant="outline"
              style={styles.actionBtn}
            />
            <Button 
              title="Cancel Appointment" 
              onPress={handleCancel}
              variant="danger"
              loading={isCancelling}
              style={styles.actionBtn}
            />
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

function DetailItem({ icon, label, value, isLast }: { icon: any, label: string, value: string, isLast?: boolean }) {
  return (
    <View style={[styles.detailItem, isLast && { borderBottomWidth: 0 }]}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={20} color="#6B7280" />
      </View>
      <View style={styles.detailText}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: { paddingBottom: 40 },
  loadingContainer: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingTop: 12,
    paddingBottom: 20
  },
  backButton: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F3F4F6' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A2E' },
  
  statusCard: { 
    marginHorizontal: 20, 
    backgroundColor: '#FFFFFF', 
    borderRadius: 24, 
    padding: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 20
  },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  statusLabel: { fontSize: 13, fontWeight: '600', color: '#6B7280', marginBottom: 4 },
  serviceTitle: { fontSize: 20, fontWeight: '900', color: '#1A1A2E' },

  detailsList: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  detailItem: { 
    flexDirection: 'row', 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F3F4F6',
    alignItems: 'center'
  },
  iconContainer: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  detailText: { flex: 1 },
  detailLabel: { fontSize: 12, fontWeight: '600', color: '#9CA3AF', marginBottom: 2 },
  detailValue: { fontSize: 15, fontWeight: '700', color: '#1A1A2E', lineHeight: 20 },

  actions: { paddingHorizontal: 20, marginTop: 30, gap: 12 },
  actionBtn: { height: 56, borderRadius: 16 },
}));
