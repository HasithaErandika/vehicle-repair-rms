import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  ActivityIndicator, StyleSheet, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { createVehicle } from '../../api/vehicles';

const VEHICLE_TYPES = ['car', 'motorcycle', 'tuk', 'van'];
const CURRENT_YEAR  = new Date().getFullYear();

export default function AddVehicleScreen() {
  const router = useRouter();
  const [form, setForm]       = useState({ registrationNo: '', make: '', model: '', year: '', vehicleType: 'car', mileage: '' });
  const [loading, setLoading] = useState(false);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    const year = parseInt(form.year);
    if (!form.registrationNo || !form.make || !form.model || !year) {
      Alert.alert('Validation', 'Registration, make, model, and year are required');
      return;
    }
    if (year < 1990 || year > CURRENT_YEAR + 1) {
      Alert.alert('Validation', `Year must be between 1990 and ${CURRENT_YEAR + 1}`);
      return;
    }
    setLoading(true);
    try {
      await createVehicle({ ...form, year, mileage: form.mileage ? parseInt(form.mileage) : undefined });
      router.back();
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Registration No.</Text>
      <TextInput style={styles.input} value={form.registrationNo} onChangeText={set('registrationNo')} autoCapitalize="characters" placeholder="WP-CAB-1234" />
      <Text style={styles.label}>Make</Text>
      <TextInput style={styles.input} value={form.make} onChangeText={set('make')} placeholder="Toyota" />
      <Text style={styles.label}>Model</Text>
      <TextInput style={styles.input} value={form.model} onChangeText={set('model')} placeholder="Premio" />
      <Text style={styles.label}>Year</Text>
      <TextInput style={styles.input} value={form.year} onChangeText={set('year')} keyboardType="numeric" placeholder="2020" />
      <Text style={styles.label}>Vehicle Type</Text>
      <View style={styles.typeRow}>
        {VEHICLE_TYPES.map((t) => (
          <TouchableOpacity key={t} style={[styles.typeBtn, form.vehicleType === t && styles.typeBtnActive]} onPress={() => set('vehicleType')(t)}>
            <Text style={[styles.typeTxt, form.vehicleType === t && styles.typeTxtActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.label}>Mileage (km, optional)</Text>
      <TextInput style={styles.input} value={form.mileage} onChangeText={set('mileage')} keyboardType="numeric" placeholder="0" />
      <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTxt}>Add Vehicle</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label:     { fontWeight: '600', marginBottom: 4, marginTop: 12 },
  input:     { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 4, backgroundColor: '#fff' },
  typeRow:   { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  typeBtn:   { borderWidth: 1, borderColor: '#007AFF', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  typeBtnActive: { backgroundColor: '#007AFF' },
  typeTxt:   { color: '#007AFF' },
  typeTxtActive: { color: '#fff' },
  btn:       { backgroundColor: '#007AFF', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 24 },
  btnTxt:    { color: '#fff', fontWeight: '600', fontSize: 16 },
});
