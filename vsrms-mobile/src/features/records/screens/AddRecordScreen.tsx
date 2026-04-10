import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useCreateRecord } from '../queries/mutations';
import { handleApiError } from '@/services/error.handler';

export function AddRecordScreen() {
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const router = useRouter();
  const { mutate: create, isPending } = useCreateRecord();
  
  const [form, setForm] = useState({
    description: '',
    cost: '',
    serviceDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = () => {
    if (!form.description || !form.serviceDate) {
      Alert.alert('Validation', 'Description and date are required');
      return;
    }

    create({
      vehicleId: vehicleId!,
      description: form.description,
      cost: form.cost ? parseFloat(form.cost) : undefined,
      serviceDate: form.serviceDate,
    }, {
      onSuccess: () => router.back(),
      onError: (err) => Alert.alert('Error', handleApiError(err))
    });
  };

  return (
    <ScreenWrapper scroll>
      <View style={styles.container}>
        <Text style={styles.title}>Add Service Record</Text>
        
        <Text style={styles.label}>Service Date (YYYY-MM-DD)</Text>
        <TextInput 
          style={styles.input} 
          value={form.serviceDate} 
          onChangeText={(v) => setForm(f => ({ ...f, serviceDate: v }))} 
          placeholder="2024-04-10" 
        />
        
        <Text style={styles.label}>Description</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          value={form.description} 
          onChangeText={(v) => setForm(f => ({ ...f, description: v }))} 
          placeholder="Full service, oil change, etc." 
          multiline
        />
        
        <Text style={styles.label}>Cost (LKR)</Text>
        <TextInput 
          style={styles.input} 
          value={form.cost} 
          onChangeText={(v) => setForm(f => ({ ...f, cost: v }))} 
          keyboardType="numeric" 
          placeholder="5000" 
        />

        <TouchableOpacity 
          style={styles.btn} 
          onPress={handleSubmit} 
          disabled={isPending}
        >
          {isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTxt}>Save Record</Text>}
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: { padding: theme.spacing.md },
  title: { fontSize: theme.fonts.sizes.xl, fontWeight: '800', marginBottom: 24, color: theme.colors.text },
  label: { fontSize: theme.fonts.sizes.sm, fontWeight: '700', color: theme.colors.text, marginBottom: 4, marginTop: 12 },
  input: { 
    backgroundColor: theme.colors.surface, 
    borderWidth: 1, 
    borderColor: theme.colors.border, 
    borderRadius: theme.radii.md, 
    padding: theme.spacing.md, 
    color: theme.colors.text 
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  btn: { 
    backgroundColor: theme.colors.brand, 
    borderRadius: theme.radii.lg, 
    padding: theme.spacing.md, 
    alignItems: 'center', 
    marginTop: 32 
  },
  btnTxt: { color: '#fff', fontWeight: '800', fontSize: theme.fonts.sizes.md },
}));
