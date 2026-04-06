import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { createRecord } from '../../api/records';

export default function CreateRecordScreen() {
  const router = useRouter();
  const [form, setForm]       = useState({ vehicleId: '', serviceDate: '', workDone: '', totalCost: '', mileageAtService: '', technicianName: '', partsReplaced: '' });
  const [loading, setLoading] = useState(false);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.vehicleId || !form.serviceDate || !form.workDone || !form.totalCost) {
      Alert.alert('Validation', 'Vehicle ID, date, work done, and cost are required');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        vehicleId:        form.vehicleId.trim(),
        serviceDate:      form.serviceDate,
        workDone:         form.workDone.trim(),
        totalCost:        parseFloat(form.totalCost),
        mileageAtService: form.mileageAtService ? parseInt(form.mileageAtService) : undefined,
        technicianName:   form.technicianName.trim() || undefined,
        partsReplaced:    form.partsReplaced
          ? form.partsReplaced.split(',').map((p) => p.trim()).filter(Boolean)
          : [],
      };
      await createRecord(payload);
      Alert.alert('Success', 'Service record created.');
      router.back();
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Create Service Record</Text>
      <Text style={styles.label}>Vehicle ID *</Text>
      <TextInput style={styles.input} value={form.vehicleId} onChangeText={set('vehicleId')} placeholder="MongoDB ObjectId of vehicle" />
      <Text style={styles.label}>Service Date * (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} value={form.serviceDate} onChangeText={set('serviceDate')} placeholder="2026-04-06" />
      <Text style={styles.label}>Work Done *</Text>
      <TextInput style={[styles.input, styles.multi]} value={form.workDone} onChangeText={set('workDone')} placeholder="Describe the work performed" multiline numberOfLines={3} />
      <Text style={styles.label}>Total Cost (LKR) *</Text>
      <TextInput style={styles.input} value={form.totalCost} onChangeText={set('totalCost')} keyboardType="numeric" placeholder="0" />
      <Text style={styles.label}>Mileage at Service (km)</Text>
      <TextInput style={styles.input} value={form.mileageAtService} onChangeText={set('mileageAtService')} keyboardType="numeric" placeholder="Optional" />
      <Text style={styles.label}>Technician Name</Text>
      <TextInput style={styles.input} value={form.technicianName} onChangeText={set('technicianName')} placeholder="Optional" />
      <Text style={styles.label}>Parts Replaced (comma-separated)</Text>
      <TextInput style={styles.input} value={form.partsReplaced} onChangeText={set('partsReplaced')} placeholder="e.g. Oil filter, Brake pads" />
      <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTxt}>Create Record</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading:   { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  label:     { fontWeight: '600', marginBottom: 4, marginTop: 12, color: '#333' },
  input:     { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, backgroundColor: '#fff' },
  multi:     { height: 80, textAlignVertical: 'top' },
  btn:       { backgroundColor: '#007AFF', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 24 },
  btnTxt:    { color: '#fff', fontWeight: '600', fontSize: 16 },
});
