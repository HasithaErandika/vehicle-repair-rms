import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';

export function AppointmentCard({ appointment }: { appointment: any }) {
  const { theme } = useUnistyles();
  const router = useRouter();

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.dateTimeBox}>
          <Text style={styles.dateText}>{appointment.date || 'Tomorrow, Oct 25'}</Text>
          <Text style={styles.timeText}>{appointment.time || '10:00 AM'}</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{appointment.status || 'Confirmed'}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{appointment.serviceType}</Text>
        <Text style={styles.subtitle}>{appointment.vehicleInfo || (appointment.vehicleId?._id ? `${appointment.vehicleId.make} ${appointment.vehicleId.model}` : 'Honda Civic (CBA-1234)')}</Text>

        <View style={styles.garageBox}>
          <MapPin size={14} color="#1A1A2E" />
          <Text style={styles.garageName}>{appointment.workshopId?.name || 'AutoCare Garage Colombo'}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.rescheduleBtn}>
          <Text style={styles.rescheduleText}>Reschedule</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.directionsBtn}>
          <Text style={styles.directionsText}>Get Directions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    boxShadow: [{
      offsetX: 0,
      offsetY: 4,
      blurRadius: 10,
      color: 'rgba(0,0,0,0.03)',
    }],
    elevation: 2
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20
  },
  dateTimeBox: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6'
  },
  dateText: { fontSize: 13, fontWeight: '800', color: '#1A1A2E' },
  timeText: { fontSize: 13, fontWeight: '800', color: '#F56E0F', marginTop: 2 },
  
  statusBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },
  statusText: { fontSize: 11, fontWeight: '800', color: '#10B981' },
  
  content: { marginBottom: 20 },
  title: { fontSize: 19, fontWeight: '900', color: '#1A1A2E', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#9CA3AF', fontWeight: '600', marginBottom: 16 },
  
  garageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start'
  },
  garageName: { fontSize: 13, fontWeight: '800', color: '#1A1A2E' },
  
  footer: { flexDirection: 'row', gap: 12 },
  rescheduleBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF'
  },
  rescheduleText: { fontSize: 14, fontWeight: '800', color: '#1A1A2E' },
  directionsBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F56E0F',
    alignItems: 'center',
    justifyContent: 'center'
  },
  directionsText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' }
}));
