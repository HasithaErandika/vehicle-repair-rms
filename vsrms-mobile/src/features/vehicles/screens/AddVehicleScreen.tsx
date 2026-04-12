import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useCreateVehicle } from '../queries/mutations';
import { handleApiError } from '@/services/error.handler';

const VEHICLE_TYPES = [
  { value: 'car',        label: 'Car',        icon: 'car-outline' },
  { value: 'motorcycle', label: 'Motorcycle',  icon: 'bicycle-outline' },
  { value: 'tuk',        label: 'Tuk Tuk',    icon: 'car-outline' },
  { value: 'van',        label: 'Van / SUV',  icon: 'bus-outline' },
] as const;

export type VehicleType = (typeof VEHICLE_TYPES)[number]['value'];
const CURRENT_YEAR = new Date().getFullYear();

export default function AddVehicleScreen() {
  const router = useRouter();
  const { mutate: create, isPending } = useCreateVehicle();

  const [form, setForm] = useState({ registrationNo: '', make: '', model: '', year: '', vehicleType: 'car' as VehicleType, mileage: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField = (key: keyof typeof form) => (val: string) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.registrationNo.trim()) e.registrationNo = 'Registration required';
    if (!form.make.trim())           e.make = 'Make required';
    if (!form.model.trim())          e.model = 'Model required';
    const year = parseInt(form.year);
    if (!form.year || isNaN(year))   e.year = 'Valid year required';
    else if (year < 1990 || year > CURRENT_YEAR + 1) e.year = `Invalid year`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    create({
        registrationNo: form.registrationNo.trim().toUpperCase(),
        make: form.make.trim(),
        model: form.model.trim(),
        year: parseInt(form.year),
        vehicleType: form.vehicleType,
        mileage: form.mileage ? parseInt(form.mileage, 10) : undefined,
      },
      { onSuccess: () => router.back(), onError: (err) => Alert.alert('Error', handleApiError(err)) }
    );
  };

  return (
    <ScreenWrapper bg="#1A1A2E">
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />

      {/* ── DARK TOP SECTION ── */}
      <View style={styles.topSection}>
        <View style={styles.headerTextRow}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={() => router.back()}>
             <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Add Vehicle</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.decCircle1} />
        <View style={styles.decCircle2} />
      </View>

      {/* ── WHITE CARD SECTION ── */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.mainCard}>
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

            {/* VEHICLE TYPE */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Vehicle Type</Text>
              <View style={styles.typeGrid}>
                {VEHICLE_TYPES.map((t) => (
                  <TouchableOpacity key={t.value} style={[styles.typeCard, form.vehicleType === t.value && styles.typeCardActive]} onPress={() => setForm(f => ({ ...f, vehicleType: t.value }))} activeOpacity={0.8}>
                    <Ionicons name={t.icon as any} size={28} color={form.vehicleType === t.value ? '#F56E0F' : '#9CA3AF'} />
                    <Text style={[styles.typeLabel, form.vehicleType === t.value && styles.typeLabelActive]}>{t.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* FORM FIELDS */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Vehicle Details</Text>
              <View style={styles.card}>
                <FieldInput label="Registration No." placeholder="WP-CAB-1234" value={form.registrationNo} onChangeText={setField('registrationNo')} autoCapitalize="characters" error={errors.registrationNo} />
                <View style={styles.rowFields}>
                  <View style={{ flex: 1 }}><FieldInput label="Make" placeholder="Toyota" value={form.make} onChangeText={setField('make')} error={errors.make} /></View>
                  <View style={{ flex: 1 }}><FieldInput label="Model" placeholder="Premio" value={form.model} onChangeText={setField('model')} error={errors.model} /></View>
                </View>
                <View style={styles.rowFields}>
                  <View style={{ flex: 1 }}><FieldInput label="Year" placeholder="2020" value={form.year} onChangeText={setField('year')} keyboardType="numeric" maxLength={4} error={errors.year} /></View>
                  <View style={{ flex: 1 }}><FieldInput label="Mileage" placeholder="45000" value={form.mileage} onChangeText={setField('mileage')} keyboardType="numeric" optional /></View>
                </View>
              </View>
            </View>

            {/* SUBMIT */}
            <TouchableOpacity style={[styles.submitBtn, isPending && styles.submitBtnDisabled]} onPress={handleSubmit} disabled={isPending} activeOpacity={0.85}>
              {isPending
                ? <ActivityIndicator color="#FFFFFF" />
                : <>
                    <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.submitBtnText}>Add to My Vehicles</Text>
                  </>
              }
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

function FieldInput({ label, placeholder, value, onChangeText, error, optional, ...rest }: any) {
  return (
    <View style={fieldStyles.group}>
      <Text style={fieldStyles.label}>{label}{optional ? <Text style={fieldStyles.optional}> (opt)</Text> : null}</Text>
      <TextInput style={[fieldStyles.input, error && fieldStyles.inputError]} placeholder={placeholder} placeholderTextColor="#9CA3AF" value={value} onChangeText={onChangeText} {...rest} />
      {error ? <Text style={fieldStyles.errorText}>{error}</Text> : null}
    </View>
  );
}

const fieldStyles = StyleSheet.create(() => ({
  group: { marginBottom: 20 },
  label: { fontSize: 11, fontWeight: '800', color: '#6B7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  optional: { fontWeight: '600', color: '#D1D5DB', textTransform: 'none' },
  input: { borderWidth: 1.5, borderColor: '#F3F4F6', borderRadius: 14, paddingHorizontal: 16, height: 52, fontSize: 15, color: '#1A1A2E', backgroundColor: '#FAFAFA', fontWeight: '500' },
  inputError: { borderColor: '#FECACA', backgroundColor: '#FEF2F2' },
  errorText: { fontSize: 11, color: '#DC2626', fontWeight: '700', marginTop: 4, marginLeft: 4 },
}));

const styles = StyleSheet.create(() => ({
  topSection: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 68, position: 'relative', overflow: 'hidden' },
  headerTextRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 10, marginTop: 12 },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.3 },
  
  decCircle1: { position: 'absolute', width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(245,110,15,0.13)', top: -25, right: -25 },
  decCircle2: { position: 'absolute', width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(245,110,15,0.08)', bottom: 10, right: 90 },

  mainCard: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -38, flex: 1, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 16 },
  scroll: { padding: 24, paddingBottom: 60 },

  section: { marginBottom: 32 },
  sectionLabel: { fontSize: 13, fontWeight: '900', color: '#1A1A2E', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 },

  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  typeCard: { flex: 1, minWidth: '45%', alignItems: 'center', paddingVertical: 20, paddingHorizontal: 8, borderWidth: 1.5, borderColor: '#F3F4F6', borderRadius: 18, backgroundColor: '#FAFAFA', gap: 8 },
  typeCardActive: { borderColor: '#F56E0F', backgroundColor: '#FFF7ED' },
  typeLabel: { fontSize: 12, fontWeight: '800', color: '#9CA3AF', textAlign: 'center' },
  typeLabelActive: { color: '#C2410C' },

  card: { backgroundColor: '#FFFFFF' },
  rowFields: { flexDirection: 'row', gap: 14 },

  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#F56E0F', borderRadius: 16, height: 56, shadowColor: '#F56E0F', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 8, marginTop: 12 },
  submitBtnDisabled: { opacity: 0.65 },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900', letterSpacing: 0.3 },
}));
