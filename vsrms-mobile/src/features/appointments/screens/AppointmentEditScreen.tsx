import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native-unistyles';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { useAppointment } from '../queries/queries';
import { useUpdateAppointment } from '../queries/mutations';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { Button } from '@/components/ui/Button';

const SERVICE_TYPES = [
  'Oil Change',
  'Brake Service',
  'Tyre Rotation',
  'Full Service',
  'Engine Diagnostic',
  'Wheel Alignment',
  'AC Service',
  'Battery Replacement',
  'Other',
];

export function AppointmentEditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: appointment, isLoading, isError, refetch } = useAppointment(id as string);
  const { mutate: update, isPending } = useUpdateAppointment();

  const [serviceType, setServiceType] = useState('');
  const [customService, setCustomService] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const workshop = typeof appointment?.workshopId === 'object' ? appointment.workshopId : null;
  const availableServices = (workshop?.servicesOffered && workshop.servicesOffered.length > 0)
    ? [...workshop.servicesOffered, 'Other']
    : SERVICE_TYPES;

  useEffect(() => {
    if (appointment) {
      const isCustom = !SERVICE_TYPES.includes(appointment.serviceType);
      setServiceType(isCustom ? 'Other' : appointment.serviceType);
      if (isCustom) setCustomService(appointment.serviceType);
      
      const d = new Date(appointment.scheduledDate);
      const pad = (n: number) => String(n).padStart(2, '0');
      setDateStr(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
      setNotes(appointment.notes || '');
    }
  }, [appointment]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!serviceType) e.serviceType = 'Select a service type';
    
    const parsedDate = new Date(dateStr);
    if (!dateStr || isNaN(parsedDate.getTime())) e.date = 'Enter a valid date (YYYY-MM-DD)';
    else if (parsedDate <= new Date()) e.date = 'Date must be in the future';
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleUpdate = () => {
    if (!validate()) return;
    const finalService = serviceType === 'Other' ? customService.trim() : serviceType;
    if (!finalService) { setErrors(e => ({ ...e, serviceType: 'Describe the service' })); return; }

    update(
      { 
        id: id as string, 
        payload: { 
          serviceType: finalService, 
          scheduledDate: new Date(dateStr).toISOString(), 
          notes: notes.trim() || undefined 
        } 
      },
      { onSuccess: () => router.back() },
    );
  };

  if (isLoading) return (
    <ScreenWrapper bg="#1A1A2E">
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#F56E0F" />
      </View>
    </ScreenWrapper>
  );

  if (isError || !appointment) return <ErrorScreen onRetry={refetch} />;

  return (
    <ScreenWrapper bg="#1A1A2E">
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />

      {/* ── DARK TOP SECTION ── */}
      <View style={styles.topSection}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerSub}>Modify Booking</Text>
            <Text style={styles.headerTitle}>Reschedule</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>
        <View style={styles.decCircle1} />
        <View style={styles.decCircle2} />
      </View>

      {/* ── WHITE CARD SECTION ── */}
      <View style={styles.mainCard}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          
          {/* SERVICE TYPE */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Service Type *</Text>
            <View style={styles.chipGrid}>
              {availableServices.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.chip, serviceType === s && styles.chipActive]}
                  onPress={() => setServiceType(s)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, serviceType === s && styles.chipTextActive]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {serviceType === 'Other' && (
              <TextInput
                style={styles.input}
                placeholder="Describe the service..."
                placeholderTextColor="#9CA3AF"
                value={customService}
                onChangeText={setCustomService}
              />
            )}
            {errors.serviceType && <Text style={styles.errorText}>{errors.serviceType}</Text>}
          </View>

          {/* DATE */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Reschedule Date *</Text>
            <View style={styles.dateInputRow}>
              <Ionicons name="calendar-outline" size={18} color="#F56E0F" />
              <TextInput
                style={styles.dateInput}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9CA3AF"
                value={dateStr}
                onChangeText={setDateStr}
                keyboardType="numbers-and-punctuation"
                returnKeyType="done"
                maxLength={10}
              />
            </View>
            <Text style={styles.dateHint}>Format: YYYY-MM-DD</Text>
            {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
          </View>

          {/* NOTES */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Updated Notes <Text style={styles.optional}>(optional)</Text></Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any new instructions..."
              placeholderTextColor="#9CA3AF"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <Button 
            title="Update Appointment" 
            onPress={handleUpdate}
            loading={isPending}
            style={styles.actionBtn}
          />

        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  topSection: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: 16,
    paddingBottom: theme.spacing.headerBottom,
    position: 'relative',
    overflow: 'hidden',
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 10, marginTop: 12 },
  backBtn: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerSub: {
    fontSize: theme.fonts.sizes.caption,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerTitle: { fontSize: theme.fonts.sizes.pageTitle, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5, marginTop: 4 },

  decCircle1: { position: 'absolute', width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(245,110,15,0.13)', top: -25, right: -25 },
  decCircle2: { position: 'absolute', width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(245,110,15,0.08)', bottom: 10, right: 90 },

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
    elevation: 16,
  },
  scroll: { padding: 20, paddingBottom: 60 },
  section: { marginBottom: 25 },
  sectionLabel: { fontSize: 14, fontWeight: '800', color: '#1A1A2E', marginBottom: 12 },
  optional: { fontWeight: '500', color: '#9CA3AF' },

  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF',
  },
  chipActive: { borderColor: '#F56E0F', backgroundColor: '#FFF7ED' },
  chipText: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
  chipTextActive: { color: '#F56E0F' },

  dateInputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16,
    borderWidth: 1.5, borderColor: '#E5E7EB',
  },
  dateInput: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1A1A2E' },
  dateHint: { fontSize: 11, color: '#9CA3AF', marginTop: 6, fontStyle: 'italic' },

  input: {
    borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 14,
    padding: 14, fontSize: 14, color: '#1A1A2E', backgroundColor: '#FFFFFF',
  },
  textArea: { minHeight: 90, textAlignVertical: 'top' },
  errorText: { fontSize: 12, color: '#DC2626', fontWeight: '600', marginTop: 4 },

  actionBtn: { height: 58, borderRadius: 16, marginTop: 10 },
}));
