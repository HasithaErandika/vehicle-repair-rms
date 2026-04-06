import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getAppointment, deleteAppointment } from '../../api/appointments';

const STATUS_COLORS = {
  pending: '#F4A700', confirmed: '#007AFF', in_progress: '#AF52DE',
  completed: '#34C759', cancelled: '#FF3B30',
};

export default function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [appt, setAppt]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const res = await getAppointment(id);
        if (mounted) setAppt(res.data.appointment);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, [id]);

  const handleCancel = () => {
    Alert.alert('Cancel Appointment', 'Are you sure?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes, cancel', style: 'destructive', onPress: async () => {
        try {
          await deleteAppointment(id);
          router.back();
        } catch (err) {
          Alert.alert('Error', err.message);
        }
      }},
    ]);
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  if (error)   return <Text style={styles.error}>{error}</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.service}>{appt.serviceType}</Text>
        <View style={[styles.badge, { backgroundColor: STATUS_COLORS[appt.status] }]}>
          <Text style={styles.badgeTxt}>{appt.status.replace('_', ' ')}</Text>
        </View>
      </View>
      <Text style={styles.row}>📅 {new Date(appt.scheduledDate).toDateString()}</Text>
      {appt.notes && <Text style={styles.row}>Notes: {appt.notes}</Text>}
      {appt.status === 'pending' && (
        <>
          <TouchableOpacity style={styles.editBtn} onPress={() => router.push(`/appointments/${id}/edit`)}>
            <Text style={styles.editBtnTxt}>Edit / Reschedule</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
            <Text style={styles.cancelBtnTxt}>Cancel Appointment</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:  { padding: 20 },
  header:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  service:    { fontSize: 20, fontWeight: '700' },
  badge:      { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4 },
  badgeTxt:   { color: '#fff', fontWeight: '600', textTransform: 'capitalize' },
  row:        { fontSize: 15, color: '#444', marginBottom: 8 },
  editBtn:    { backgroundColor: '#007AFF', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 20 },
  editBtnTxt: { color: '#fff', fontWeight: '600', fontSize: 16 },
  cancelBtn:  { backgroundColor: '#fff', borderWidth: 1, borderColor: '#FF3B30', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 8 },
  cancelBtnTxt: { color: '#FF3B30', fontWeight: '600', fontSize: 16 },
  error:      { color: 'red', padding: 16 },
});
