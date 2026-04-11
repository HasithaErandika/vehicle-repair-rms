import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useAuth } from '@/hooks';
import { useWorkshopAppointments } from '@/features/appointments/queries/queries';
import { useCreateRecord } from '@/features/records/queries/mutations';
import { Appointment } from '@/features/appointments/types/appointments.types';

function getVehicleLabel(a: Appointment): string {
  if (typeof a.vehicleId === 'object') {
    return `${a.vehicleId.make} ${a.vehicleId.model} · ${a.vehicleId.registrationNo}`;
  }
  return a.vehicleId;
}

function getVehicleId(a: Appointment): string {
  if (typeof a.vehicleId === 'object') return a.vehicleId._id;
  return a.vehicleId;
}

export default function CreateRecordScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const params = useLocalSearchParams<{ appointmentId?: string }>();
  const { user } = useAuth();

  // Appointment picker
  const workshopId = user?.workshopId;
  const { data: inProgressAppts } = useWorkshopAppointments(workshopId, 'in_progress');
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  // Form fields
  const [workDone, setWorkDone]         = useState('');
  const [mileage, setMileage]           = useState('');
  const [cost, setCost]                 = useState('');
  const [techName, setTechName]         = useState('');
  const [parts, setParts]               = useState('');
  const [error, setError]               = useState('');

  const { mutate: createRecord, isPending } = useCreateRecord();

  const handleSubmit = () => {
    if (!selectedAppt) { setError('Please select an appointment.'); return; }
    if (!workDone.trim()) { setError('Work done description is required.'); return; }
    const costNum = parseFloat(cost);
    if (isNaN(costNum) || costNum < 0) { setError('Enter a valid cost.'); return; }
    setError('');

    const partsArray = parts.split(',').map(p => p.trim()).filter(Boolean);

    createRecord({
      vehicleId:        getVehicleId(selectedAppt),
      appointmentId:    selectedAppt._id ?? selectedAppt.id,
      serviceDate:      new Date().toISOString(),
      workDone:         workDone.trim(),
      partsReplaced:    partsArray,
      totalCost:        costNum,
      mileageAtService: mileage ? parseInt(mileage, 10) : undefined,
      technicianName:   techName.trim() || undefined,
    }, { onSuccess: () => router.back() });
  };

  return (
    <ScreenWrapper bg={theme.colors.surface}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="close" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Service Record</Text>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">

          {error ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle-outline" size={16} color="#DC2626" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Appointment selector */}
          <View style={styles.field}>
            <Text style={styles.label}>Linked Appointment (In Progress) *</Text>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => setShowPicker(!showPicker)}
            >
              <Text style={[styles.selectorText, !selectedAppt && { color: theme.colors.muted }]}>
                {selectedAppt ? getVehicleLabel(selectedAppt) : 'Select appointment...'}
              </Text>
              <Ionicons name={showPicker ? 'chevron-up' : 'chevron-down'} size={18} color={theme.colors.muted} />
            </TouchableOpacity>

            {showPicker && (
              <View style={styles.pickerList}>
                {(inProgressAppts ?? []).length === 0
                  ? <Text style={styles.pickerEmpty}>No in-progress appointments</Text>
                  : (inProgressAppts ?? []).map(a => (
                    <TouchableOpacity
                      key={a._id}
                      style={[styles.pickerItem, selectedAppt?._id === a._id && styles.pickerItemActive]}
                      onPress={() => { setSelectedAppt(a); setShowPicker(false); }}
                    >
                      <Text style={styles.pickerItemText}>{getVehicleLabel(a)}</Text>
                      <Text style={styles.pickerItemSub}>{a.serviceType}</Text>
                    </TouchableOpacity>
                  ))
                }
              </View>
            )}
          </View>

          {/* Work done */}
          <View style={styles.field}>
            <Text style={styles.label}>Work Done *</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={workDone}
              onChangeText={setWorkDone}
              placeholder="Describe all services performed..."
              placeholderTextColor={theme.colors.muted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Parts replaced */}
          <View style={styles.field}>
            <Text style={styles.label}>Parts Replaced (comma separated)</Text>
            <TextInput
              style={styles.input}
              value={parts}
              onChangeText={setParts}
              placeholder="Oil filter, brake pads, spark plugs"
              placeholderTextColor={theme.colors.muted}
            />
          </View>

          {/* Mileage */}
          <View style={styles.field}>
            <Text style={styles.label}>Mileage at Service (km)</Text>
            <TextInput
              style={styles.input}
              value={mileage}
              onChangeText={setMileage}
              placeholder="45200"
              placeholderTextColor={theme.colors.muted}
              keyboardType="numeric"
            />
          </View>

          {/* Technician */}
          <View style={styles.field}>
            <Text style={styles.label}>Technician Name</Text>
            <TextInput
              style={styles.input}
              value={techName}
              onChangeText={setTechName}
              placeholder="e.g. Amal Perera"
              placeholderTextColor={theme.colors.muted}
            />
          </View>

          {/* Cost */}
          <View style={styles.field}>
            <Text style={styles.label}>Total Cost (LKR) *</Text>
            <TextInput
              style={styles.input}
              value={cost}
              onChangeText={setCost}
              placeholder="15000"
              placeholderTextColor={theme.colors.muted}
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, isPending && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={isPending}
          >
            {isPending
              ? <ActivityIndicator color="#fff" />
              : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                  <Text style={styles.submitText}>Save Record</Text>
                </>
              )
            }
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.text },
  closeBtn: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background,
  },

  body: { padding: theme.spacing.md, gap: 20, paddingBottom: 60 },

  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FEF2F2', padding: 12, borderRadius: 10,
    borderWidth: 1, borderColor: '#FECACA',
  },
  errorText: { flex: 1, fontSize: 13, color: '#DC2626', fontWeight: '600' },

  field: { gap: 7 },
  label: { fontSize: 13, fontWeight: '700', color: theme.colors.text },
  input: {
    height: 48, paddingHorizontal: 14, borderRadius: 10,
    borderWidth: 1, borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface, fontSize: 14, color: theme.colors.text,
  },
  textarea: { height: 110, paddingTop: 12, paddingBottom: 12 },

  selector: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    height: 48, paddingHorizontal: 14, borderRadius: 10,
    borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface,
  },
  selectorText: { fontSize: 14, color: theme.colors.text, flex: 1 },
  pickerList: {
    borderWidth: 1, borderColor: theme.colors.border, borderRadius: 10,
    backgroundColor: theme.colors.surface, overflow: 'hidden',
  },
  pickerEmpty: { padding: 14, fontSize: 13, color: theme.colors.muted, textAlign: 'center' },
  pickerItem: { padding: 14, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  pickerItemActive: { backgroundColor: theme.colors.brandSoft },
  pickerItemText: { fontSize: 14, fontWeight: '700', color: theme.colors.text },
  pickerItemSub: { fontSize: 12, color: theme.colors.muted, marginTop: 2 },

  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 52, borderRadius: 12, backgroundColor: theme.colors.brand,
    shadowColor: theme.colors.brand, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  submitText: { fontSize: 16, fontWeight: '800', color: '#fff' },
}));
