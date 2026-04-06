import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getRecord, updateRecord } from '../../api/records';

export default function EditRecordScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [form, setForm]       = useState({ serviceDate: '', workDone: '', totalCost: '', mileageAtService: '', technicianName: '', partsReplaced: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const res = await getRecord(id);
        const r   = res.data.record;
        if (mounted) {
          setForm({
            serviceDate:      r.serviceDate?.split('T')[0] ?? '',
            workDone:         r.workDone ?? '',
            totalCost:        String(r.totalCost ?? ''),
            mileageAtService: r.mileageAtService != null ? String(r.mileageAtService) : '',
            technicianName:   r.technicianName ?? '',
            partsReplaced:    (r.partsReplaced ?? []).join(', '),
          });
        }
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, [id]);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        serviceDate:      form.serviceDate || undefined,
        workDone:         form.workDone.trim()  || undefined,
        totalCost:        form.totalCost        ? parseFloat(form.totalCost)        : undefined,
        mileageAtService: form.mileageAtService ? parseInt(form.mileageAtService)   : undefined,
        technicianName:   form.technicianName.trim() || undefined,
        partsReplaced:    form.partsReplaced
          ? form.partsReplaced.split(',').map((p) => p.trim()).filter(Boolean)
          : undefined,
      };
      await updateRecord(id, payload);
      Alert.alert('Saved', 'Record updated.');
      router.back();
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  if (error)   return <Text style={styles.error}>{error}</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Edit Service Record</Text>
      <Text style={styles.label}>Service Date (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} value={form.serviceDate} onChangeText={set('serviceDate')} />
      <Text style={styles.label}>Work Done</Text>
      <TextInput style={[styles.input, styles.multi]} value={form.workDone} onChangeText={set('workDone')} multiline numberOfLines={3} />
      <Text style={styles.label}>Total Cost (LKR)</Text>
      <TextInput style={styles.input} value={form.totalCost} onChangeText={set('totalCost')} keyboardType="numeric" />
      <Text style={styles.label}>Mileage at Service (km)</Text>
      <TextInput style={styles.input} value={form.mileageAtService} onChangeText={set('mileageAtService')} keyboardType="numeric" />
      <Text style={styles.label}>Technician Name</Text>
      <TextInput style={styles.input} value={form.technicianName} onChangeText={set('technicianName')} />
      <Text style={styles.label}>Parts Replaced (comma-separated)</Text>
      <TextInput style={styles.input} value={form.partsReplaced} onChangeText={set('partsReplaced')} />
      <TouchableOpacity style={styles.btn} onPress={handleSave} disabled={saving}>
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTxt}>Save Changes</Text>}
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
  error:     { color: 'red', padding: 16 },
});
