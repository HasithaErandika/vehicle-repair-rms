import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native-unistyles';
import { Appointment, AppointmentStatus } from '../types/appointments.types';
import { useRouter } from 'expo-router';

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; bg: string; text: string; accent: string }> = {
  pending: { label: 'Pending', bg: '#FFFBEB', text: '#D97706', accent: '#F59E0B' },
  confirmed: { label: 'Confirmed', bg: '#EFF6FF', text: '#2563EB', accent: '#3B82F6' },
  in_progress: { label: 'In Progress', bg: '#FFF7ED', text: '#EA580C', accent: '#F56E0F' },
  completed: { label: 'Completed', bg: '#ECFDF5', text: '#059669', accent: '#10B981' },
  cancelled: { label: 'Cancelled', bg: '#FEF2F2', text: '#DC2626', accent: '#EF4444' },
};

function getVehicleLabel(vehicleId: Appointment['vehicleId']): string {
  if (typeof vehicleId === 'object' && vehicleId) {
    return `${vehicleId.make} ${vehicleId.model} · ${vehicleId.registrationNo}`;
  }
  return 'Vehicle';
}

function getWorkshopLabel(workshopId: Appointment['workshopId']): string {
  if (typeof workshopId === 'object' && workshopId) {
    return workshopId.name;
  }
  return 'Workshop';
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString('en-LK', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

interface AppointmentCardProps {
  appointment:    Appointment;
  isTechnician?:  boolean;
  onFinalize?:    () => void;
  onCancel?:      () => void;
  onReschedule?:  () => void;
}

export function AppointmentCard({ 
  appointment, 
  isTechnician = false, 
  onFinalize,
  onCancel,
  onReschedule
}: AppointmentCardProps) {
  const router = useRouter();
  const status = appointment.status ?? 'pending';
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;

  const handlePress = () => {
    if (isTechnician) return; // technician taps the Finalize button, not the card
    const id = appointment._id || appointment.id;
    if (id) {
      router.push(`/customer/schedule/${id}`);
    }
  };

  return (
    <TouchableOpacity 
      activeOpacity={isTechnician ? 1 : 0.8} 
      onPress={handlePress}
    >
      <View style={[styles.card, { borderLeftColor: cfg.accent }]}>
        {/* DATE + STATUS */}
        <View style={styles.cardHeader}>
          <View style={styles.dateBox}>
            <Ionicons name="calendar-outline" size={13} color="#6B7280" />
            <Text style={styles.dateText}>{formatDate(appointment.scheduledDate)}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
            <View style={[styles.statusDot, { backgroundColor: cfg.accent }]} />
            <Text style={[styles.statusText, { color: cfg.text }]}>{cfg.label}</Text>
          </View>
        </View>

        {/* SERVICE TYPE */}
        <Text style={styles.serviceType}>{appointment.serviceType}</Text>

        {/* VEHICLE */}
        <View style={styles.infoRow}>
          <Ionicons name="car-outline" size={15} color="#6B7280" />
          <Text style={styles.infoText}>{getVehicleLabel(appointment.vehicleId)}</Text>
        </View>

        {/* WORKSHOP */}
        <View style={styles.infoRow}>
          <Ionicons name="business-outline" size={15} color="#6B7280" />
          <Text style={styles.infoText}>{getWorkshopLabel(appointment.workshopId)}</Text>
        </View>

        {appointment.notes ? (
          <View style={styles.notesBox}>
            <Ionicons name="document-text-outline" size={13} color="#9CA3AF" />
            <Text style={styles.notesText}>{appointment.notes}</Text>
          </View>
        ) : null}

        {isTechnician && onFinalize && (
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.actionBtn} onPress={onFinalize} activeOpacity={0.85}>
              <Ionicons name="checkmark-circle-outline" size={16} color="#FFFFFF" />
              <Text style={styles.actionBtnText}>Mark Complete</Text>
            </TouchableOpacity>
          </View>
        )}

        {!isTechnician && (status === 'pending' || status === 'confirmed') && (onCancel || onReschedule) && (
          <View style={styles.actionContainer}>
            {onReschedule && (
              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB' }]} 
                onPress={(e) => { e.stopPropagation(); onReschedule(); }} 
                activeOpacity={0.7}
              >
                <Ionicons name="calendar-outline" size={16} color="#4B5563" />
                <Text style={[styles.actionBtnText, { color: '#4B5563' }]}>Reschedule</Text>
              </TouchableOpacity>
            )}
            {onCancel && (
              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA' }]} 
                onPress={(e) => { e.stopPropagation(); onCancel(); }} 
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle-outline" size={16} color="#EF4444" />
                <Text style={[styles.actionBtnText, { color: '#EF4444' }]}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create(() => ({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
  },
  dateBox: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  wsHeaderBox: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  wsHeaderText: { fontSize: 13, fontWeight: '800', color: '#1A1A2E', textTransform: 'uppercase', letterSpacing: 0.2 },
  
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 10 },
  dateText: { fontSize: 11, fontWeight: '600', color: '#6B7280' },
  
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.3 },

  serviceType: { fontSize: 16, fontWeight: '800', color: '#1A1A2E', marginBottom: 10, letterSpacing: -0.3 },

  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 },
  infoText: { fontSize: 13, color: '#6B7280', fontWeight: '500', flex: 1 },

  notesBox: {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    marginTop: 10, backgroundColor: '#F9FAFB', borderRadius: 10, padding: 10,
  },
  notesText: { flex: 1, fontSize: 12, color: '#6B7280', fontStyle: 'italic', lineHeight: 18 },

  workshopTag: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    backgroundColor: '#FFF7ED', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 6, 
    marginBottom: 8, 
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#FFEDD5'
  },
  workshopTagText: { 
    fontSize: 10, 
    fontWeight: '800', 
    color: '#EA580C', 
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  actionContainer: {
    flexDirection: 'row',
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 14,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F56E0F',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
}));
