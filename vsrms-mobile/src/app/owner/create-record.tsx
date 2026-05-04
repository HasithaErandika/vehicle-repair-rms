import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, ActivityIndicator, StatusBar,
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
  if (typeof a.vehicleId === 'object' && a.vehicleId !== null) {
    return `${a.vehicleId.make} ${a.vehicleId.model} · ${a.vehicleId.registrationNo}`;
  }
  return a.vehicleId as string;
}

function getVehicleId(a: Appointment): string {
  if (typeof a.vehicleId === 'object' && a.vehicleId !== null) return (a.vehicleId as any).id || (a.vehicleId as any)._id;
  return a.vehicleId as string;
}

export default function OwnerCreateRecordScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const params = useLocalSearchParams<{ appointmentId?: string, workshopId?: string }>();
  const { user } = useAuth();

  const targetWorkshopId = params.workshopId || user?.workshopId;
  const { data: inProgressAppts } = useWorkshopAppointments(targetWorkshopId, 'in_progress');

  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [showPicker, setShowPicker]     = useState(false);
  const [workDone, setWorkDone]         = useState('');
  const [mileage, setMileage]           = useState('');
  const [totalCost, setTotalCost]       = useState('');
  const [techName, setTechName]         = useState('');
  const [parts, setParts]               = useState('');
  const [error, setError]               = useState('');

  const { mutate: createRecord, isPending } = useCreateRecord();

  // Handle pre-selected appointment if passed in params
  React.useEffect(() => {
    if (params.appointmentId && inProgressAppts) {
      const found = inProgressAppts.find(a => (a._id || a.id) === params.appointmentId);
      if (found) setSelectedAppt(found);
    }
  }, [params.appointmentId, inProgressAppts]);

  const handleSubmit = () => {
    if (!selectedAppt) { setError('Please select an appointment.'); return; }
    if (!workDone.trim()) { setError('Work done description is required.'); return; }
    const costNum = parseFloat(totalCost);
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
    <ScreenWrapper bg="#1A1A2E">
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />

      {/* ── DARK TOP SECTION ── */}
      <View style={styles.topSection}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerSub}>Technical Logs</Text>
            <Text style={styles.headerTitle}>New Record</Text>
          </View>
        </View>

        <View style={styles.decCircle1} />
        <View style={styles.decCircle2} />
      </View>

      {/* ── WHITE CARD SECTION ── */}
      <View style={styles.mainCard}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
        >
          <ScrollView 
            contentContainerStyle={styles.scroll} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {error ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={20} color="#DC2626" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Appointment selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Linked Appointment (Active)</Text>
              <TouchableOpacity 
                style={[styles.selector, showPicker && styles.selectorActive]} 
                onPress={() => setShowPicker(!showPicker)}
              >
                <Text style={[styles.selectorText, !selectedAppt && { color: '#9CA3AF' }]} numberOfLines={1}>
                  {selectedAppt ? getVehicleLabel(selectedAppt) : 'Select an active job...'}
                </Text>
                <Ionicons name={showPicker ? 'chevron-up' : 'chevron-down'} size={20} color="#9CA3AF" />
              </TouchableOpacity>

              {showPicker && (
                <View style={styles.pickerList}>
                  {(inProgressAppts ?? []).length === 0 ? (
                    <Text style={styles.pickerEmpty}>No active jobs in progress</Text>
                  ) : (
                    inProgressAppts?.map((a, idx) => (
                      <TouchableOpacity
                        key={a._id || a.id || `appt-${idx}`}
                        style={[styles.pickerItem, (selectedAppt?._id || selectedAppt?.id) === (a._id || a.id) && styles.pickerItemActive]}
                        onPress={() => { setSelectedAppt(a); setShowPicker(false); }}
                      >
                        <Text style={styles.pickerItemText}>{getVehicleLabel(a)}</Text>
                        <Text style={styles.pickerItemSub}>{a.serviceType}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Work summary</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={workDone}
                onChangeText={setWorkDone}
                placeholder="Details of the service or repair..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Parts Installed</Text>
              <TextInput
                style={styles.input}
                value={parts}
                onChangeText={setParts}
                placeholder="List parts separated by commas"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.row}>
               <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Mileage (km)</Text>
                  <TextInput
                    style={styles.input}
                    value={mileage}
                    onChangeText={setMileage}
                    placeholder="e.g. 45200"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
               </View>
               <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Billing (LKR)</Text>
                  <TextInput
                    style={styles.input}
                    value={totalCost}
                    onChangeText={setTotalCost}
                    placeholder="15000"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
               </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Technician Name</Text>
              <TextInput
                style={styles.input}
                value={techName}
                onChangeText={setTechName}
                placeholder="Who performed this work?"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, (isPending || !selectedAppt) && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={isPending || !selectedAppt}
              activeOpacity={0.8}
            >
              {isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                  <Text style={styles.submitText}>Save Record</Text>
                </>
              )}
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  topSection: { 
    paddingHorizontal: theme.spacing.screenPadding, 
    paddingTop: 16, 
    paddingBottom: 60, 
    position: 'relative', 
    overflow: 'hidden',
    backgroundColor: '#1A1A2E'
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 20, zIndex: 10, marginTop: 12, marginBottom: 24 },
  headerSub: { 
    fontSize: theme.fonts.sizes.caption, 
    color: 'rgba(255,255,255,0.7)', 
    fontWeight: '700', 
    textTransform: 'uppercase', 
    letterSpacing: 1 
  },
  headerTitle: { 
    fontSize: theme.fonts.sizes.pageTitle, 
    color: '#FFFFFF', 
    fontWeight: '900', 
    letterSpacing: -0.5, 
    marginTop: 4 
  },

  decCircle1: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(245,110,15,0.12)', top: -30, right: -20 },
  decCircle2: { position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(245,110,15,0.06)', bottom: 10, right: 90 },

  mainCard: { 
    backgroundColor: '#FFFFFF', 
    borderTopLeftRadius: 32, 
    borderTopRightRadius: 32, 
    marginTop: theme.spacing.cardOverlap, 
    flex: 1, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: -4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 20, 
    elevation: 16 
  },
  scroll: { 
    paddingHorizontal: theme.spacing.screenPadding, 
    paddingTop: 32, 
    paddingBottom: 130 
  },

  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FEF2F2', padding: 16, borderRadius: 16,
    borderWidth: 1.5, borderColor: '#FECACA', marginBottom: 24,
  },
  errorText: { flex: 1, fontSize: 13, color: '#DC2626', fontWeight: '800' },

  inputGroup: { marginBottom: 24 },
  row: { flexDirection: 'row', gap: 16 },
  label: { 
    fontSize: 13, fontWeight: '800', color: theme.colors.text, 
    textTransform: 'uppercase', marginBottom: 10, marginLeft: 4, letterSpacing: 0.5 
  },
  input: { 
    backgroundColor: '#F9FAFB', 
    borderWidth: 1.5, 
    borderColor: '#F3F4F6', 
    borderRadius: 16, 
    padding: 16, 
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text 
  },
  textArea: { height: 120 },
  
  selector: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#F9FAFB', borderWidth: 1.5, borderColor: '#F3F4F6',
    borderRadius: 16, padding: 16,
  },
  selectorActive: { borderColor: theme.colors.brand, backgroundColor: '#FFF7ED' },
  selectorText: { fontSize: 15, fontWeight: '600', color: theme.colors.text, flex: 1 },
  
  pickerList: {
    marginTop: 8, borderWidth: 1.5, borderColor: '#F3F4F6', borderRadius: 16,
    backgroundColor: '#FFFFFF', overflow: 'hidden', elevation: 4, shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10,
  },
  pickerEmpty: { padding: 16, fontSize: 14, color: '#9CA3AF', textAlign: 'center', fontWeight: '600' },
  pickerItem: { padding: 16, borderBottomWidth: 1.5, borderBottomColor: '#F9FAFB' },
  pickerItemActive: { backgroundColor: '#FFF7ED' },
  pickerItemText: { fontSize: 14, fontWeight: '800', color: theme.colors.text },
  pickerItemSub: { fontSize: 12, color: '#9CA3AF', marginTop: 4, fontWeight: '600' },

  submitBtn: { 
    flexDirection: 'row',
    backgroundColor: theme.colors.brand, 
    borderRadius: 18, 
    height: 58,
    alignItems: 'center', 
    justifyContent: 'center',
    gap: 10,
    marginTop: 16,
    shadowColor: theme.colors.brand,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  submitText: { color: '#fff', fontWeight: '900', fontSize: 16, letterSpacing: 0.5, textTransform: 'uppercase' },
}));
