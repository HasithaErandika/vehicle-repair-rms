import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createAppointment } from '../../api/appointments';

export default function BookAppointmentScreen() {
  const { workshopId, workshopName } = useLocalSearchParams();
  const router = useRouter();
  const [form, setForm]       = useState({ vehicleId: '', serviceType: '', scheduledDate: '', notes: '' });
  const [loading, setLoading] = useState(false);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.vehicleId || !form.serviceType || !form.scheduledDate) {
      Alert.alert('Validation', 'Vehicle ID, service type, and date are required');
      return;
    }
    if (new Date(form.scheduledDate) <= new Date()) {
      Alert.alert('Validation', 'Scheduled date must be in the future');
      return;
    }
    setLoading(true);
    try {
      await createAppointment({ workshopId, ...form });
      Alert.alert('Success', 'Appointment booked!');
      router.push('/appointments');
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {workshopName && <Text style={styles.workshopName}>Workshop: {workshopName}</Text>}
      <Text style={styles.label}>Vehicle ID</Text>
      <TextInput style={styles.input} value={form.vehicleId} onChangeText={set('vehicleId')} placeholder="Paste vehicle ID from My Vehicles" />
      <Text style={styles.label}>Service Type</Text>
      <TextInput style={styles.input} value={form.serviceType} onChangeText={set('serviceType')} placeholder="e.g. Oil Change, Brake Service" />
      <Text style={styles.label}>Scheduled Date (ISO: YYYY-MM-DD)</Text>
      <TextInput style={styles.input} value={form.scheduledDate} onChangeText={set('scheduledDate')} placeholder="2026-05-01" />
      <Text style={styles.label}>Notes (optional)</Text>
      <TextInput style={[styles.input, styles.multiline]} value={form.notes} onChangeText={set('notes')} placeholder="Any additional information..." multiline numberOfLines={3} />
      <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTxt}>Book Appointment</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { padding: 20 },
  workshopName: { fontSize: 18, fontWeight: '700', marginBottom: 16, color: '#007AFF' },
  label:        { fontWeight: '600', marginBottom: 4, marginTop: 12 },
  input:        { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, backgroundColor: '#fff' },
  multiline:    { height: 80, textAlignVertical: 'top' },
  btn:          { backgroundColor: '#007AFF', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 24 },
  btnTxt:       { color: '#fff', fontWeight: '600', fontSize: 16 },
});
