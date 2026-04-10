import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useVehicle } from '../queries/queries';
import { useUpdateVehicle } from '../queries/mutations';
import { handleApiError } from '@/services/error.handler';
import { VehicleType } from './AddVehicleScreen';

const VEHICLE_TYPES = ['car', 'motorcycle', 'tuk', 'van'] as const;
const CURRENT_YEAR = new Date().getFullYear();

export default function EditVehicleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: vehicle, isLoading, isError, error } = useVehicle(id!);
  const { mutate: update, isPending: isSaving } = useUpdateVehicle();

  const [form, setForm] = useState({
    make: '',
    model: '',
    year: '',
    vehicleType: 'car' as VehicleType,
    mileage: ''
  });

  useEffect(() => {
    if (vehicle) {
      setForm({
        make: vehicle.make || '',
        model: vehicle.model || '',
        year: String(vehicle.year || ''),
        vehicleType: (vehicle as any).vehicleType || 'car', // Use any cast if type is extending
        mileage: vehicle.engineCapacity ? String(vehicle.engineCapacity) : '' // Mapping logic might vary
      });
    }
  }, [vehicle]);

  const setField = (key: keyof typeof form) => (val: string) => 
    setForm((f) => ({ ...f, [key]: val }));

  const handleSave = () => {
    const year = parseInt(form.year);
    if (year < 1990 || year > CURRENT_YEAR + 1) {
      Alert.alert('Validation', `Year must be between 1990 and ${CURRENT_YEAR + 1}`);
      return;
    }

    update({
      id: id!,
      vehicle: {
        make: form.make.trim(),
        model: form.model.trim(),
        year: year,
        //Mapping other fields if necessary
      }
    }, {
      onSuccess: () => {
        Alert.alert('Success', 'Vehicle updated');
        router.back();
      },
      onError: (err) => Alert.alert('Error', handleApiError(err))
    });
  };

  if (isLoading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  if (isError) return <Text style={{ color: 'red', padding: 20 }}>{handleApiError(error)}</Text>;

  return (
    <ScreenWrapper scroll>
      <View style={styles.container}>
        <Text style={styles.heading}>Edit Vehicle</Text>
        
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
          onPress={handleSave} 
          disabled={isSaving}
        >
          {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTxt}>Save Changes</Text>}
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: { padding: theme.spacing.md },
  heading: { fontSize: theme.fonts.sizes.xl, fontWeight: '800', marginBottom: 16, color: theme.colors.text },
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
