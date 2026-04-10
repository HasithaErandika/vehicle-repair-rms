import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useCreateVehicle } from '../queries/mutations';
import { handleApiError } from '@/services/error.handler';

const VEHICLE_TYPES = ['car', 'motorcycle', 'tuk', 'van'] as const;
const CURRENT_YEAR = new Date().getFullYear();

export type VehicleType = (typeof VEHICLE_TYPES)[number];

export default function AddVehicleScreen() {
  const router = useRouter();
  const { mutate: create, isPending } = useCreateVehicle();
  
  const [form, setForm] = useState({
    registrationNo: '',
    make: '',
    model: '',
    year: '',
    vehicleType: 'car' as VehicleType,
    mileage: ''
  });

  const setField = (key: keyof typeof form) => (val: string) => 
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    const year = parseInt(form.year);
    if (!form.registrationNo || !form.make || !form.model || !year) {
      Alert.alert('Validation', 'Registration, make, model, and year are required');
      return;
    }
    
    if (year < 1990 || year > CURRENT_YEAR + 1) {
      Alert.alert('Validation', `Year must be between 1990 and ${CURRENT_YEAR + 1}`);
      return;
    }

    create({
      plateNumber: form.registrationNo,
      make: form.make,
      model: form.model,
      year: year,
      // Default additional fields if needed, or update API to handle these
    }, {
      onSuccess: () => router.back(),
      onError: (err) => Alert.alert('Error', handleApiError(err))
    });
  };

  return (
    <ScreenWrapper scroll>
      <View style={styles.container}>
        <Text style={styles.label}>Registration No.</Text>
        <TextInput 
          style={styles.input} 
          value={form.registrationNo} 
          onChangeText={setField('registrationNo')} 
          autoCapitalize="characters" 
          placeholder="WP-CAB-1234" 
        />
        
        <Text style={styles.label}>Make</Text>
        <TextInput 
          style={styles.input} 
          value={form.make} 
          onChangeText={setField('make')} 
          placeholder="Toyota" 
        />
        
        <Text style={styles.label}>Model</Text>
        <TextInput 
          style={styles.input} 
          value={form.model} 
          onChangeText={setField('model')} 
          placeholder="Premio" 
        />
        
        <Text style={styles.label}>Year</Text>
        <TextInput 
          style={styles.input} 
          value={form.year} 
          onChangeText={setField('year')} 
          keyboardType="numeric" 
          placeholder="2020" 
        />
        
        <Text style={styles.label}>Vehicle Type</Text>
        <View style={styles.typeRow}>
          {VEHICLE_TYPES.map((t) => (
            <TouchableOpacity 
              key={t} 
              style={[styles.typeBtn, form.vehicleType === t && styles.typeBtnActive]} 
              onPress={() => setForm(f => ({ ...f, vehicleType: t }))}
            >
              <Text style={[styles.typeTxt, form.vehicleType === t && styles.typeTxtActive]}>
                {t.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.btn} 
          onPress={handleSubmit} 
          disabled={isPending}
        >
          {isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTxt}>Add Vehicle</Text>}
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: { padding: theme.spacing.md },
  label: { fontSize: theme.fonts.sizes.sm, fontWeight: '700', color: theme.colors.text, marginBottom: 4, marginTop: 12 },
  input: { 
    backgroundColor: theme.colors.surface, 
    borderWidth: 1, 
    borderColor: theme.colors.border, 
    borderRadius: theme.radii.md, 
    padding: theme.spacing.md, 
    color: theme.colors.text 
  },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  typeBtn: { 
    borderWidth: 1, 
    borderColor: theme.colors.brand, 
    borderRadius: theme.radii.full, 
    paddingHorizontal: 16, 
    paddingVertical: 8 
  },
  typeBtnActive: { backgroundColor: theme.colors.brand },
  typeTxt: { color: theme.colors.brand, fontWeight: '700', fontSize: theme.fonts.sizes.xs },
  typeTxtActive: { color: '#fff' },
  btn: { 
    backgroundColor: theme.colors.brand, 
    borderRadius: theme.radii.lg, 
    padding: theme.spacing.md, 
    alignItems: 'center', 
    marginTop: 32 
  },
  btnTxt: { color: '#fff', fontWeight: '800', fontSize: theme.fonts.sizes.md },
}));
