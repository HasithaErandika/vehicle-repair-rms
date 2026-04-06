import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getVehicle, updateVehicle } from '../../api/vehicles';

const VEHICLE_TYPES  = ['car', 'motorcycle', 'tuk', 'van'];
const CURRENT_YEAR   = new Date().getFullYear();

export default function EditVehicleScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [form, setForm]       = useState({ make: '', model: '', year: '', vehicleType: 'car', mileage: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const res = await getVehicle(id);
        const v   = res.data.vehicle;
        if (mounted) {
          setForm({
            make:        v.make ?? '',
            model:       v.model ?? '',
            year:        String(v.year ?? ''),
            vehicleType: v.vehicleType ?? 'car',
            mileage:     v.mileage != null ? String(v.mileage) : '',
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
    const year = parseInt(form.year);
    if (year < 1990 || year > CURRENT_YEAR + 1) {
      Alert.alert('Validation', `Year must be between 1990 and ${CURRENT_YEAR + 1}`);
      return;
    }
    setSaving(true);
    try {
      await updateVehicle(id, {
        make:        form.make.trim()  || undefined,
        model:       form.model.trim() || undefined,
        year:        year              || undefined,
        vehicleType: form.vehicleType  || undefined,
        mileage:     form.mileage ? parseInt(form.mileage) : undefined,
      });
      Alert.alert('Saved', 'Vehicle updated.');
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
      <Text style={styles.heading}>Edit Vehicle</Text>
      <Text style={styles.label}>Make</Text>
      <TextInput style={styles.input} value={form.make} onChangeText={set('make')} placeholder="Toyota" />
      <Text style={styles.label}>Model</Text>
      <TextInput style={styles.input} value={form.model} onChangeText={set('model')} placeholder="Premio" />
      <Text style={styles.label}>Year</Text>
      <TextInput style={styles.input} value={form.year} onChangeText={set('year')} keyboardType="numeric" />
      <Text style={styles.label}>Vehicle Type</Text>
      <View style={styles.typeRow}>
        {VEHICLE_TYPES.map((t) => (
          <TouchableOpacity key={t} style={[styles.typeBtn, form.vehicleType === t && styles.typeBtnActive]} onPress={() => set('vehicleType')(t)}>
            <Text style={[styles.typeTxt, form.vehicleType === t && styles.typeTxtActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.label}>Mileage (km)</Text>
      <TextInput style={styles.input} value={form.mileage} onChangeText={set('mileage')} keyboardType="numeric" placeholder="Optional" />
      <TouchableOpacity style={styles.btn} onPress={handleSave} disabled={saving}>
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTxt}>Save Changes</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:      { padding: 20 },
  heading:        { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  label:          { fontWeight: '600', marginBottom: 4, marginTop: 12, color: '#333' },
  input:          { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, backgroundColor: '#fff' },
  typeRow:        { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeBtn:        { borderWidth: 1, borderColor: '#007AFF', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  typeBtnActive:  { backgroundColor: '#007AFF' },
  typeTxt:        { color: '#007AFF' },
  typeTxtActive:  { color: '#fff' },
  btn:            { backgroundColor: '#007AFF', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 24 },
  btnTxt:         { color: '#fff', fontWeight: '600', fontSize: 16 },
  error:          { color: 'red', padding: 16 },
});
