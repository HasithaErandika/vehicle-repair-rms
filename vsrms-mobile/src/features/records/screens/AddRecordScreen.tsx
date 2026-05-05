import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useCreateRecord } from '../queries/mutations';
import { handleApiError } from '@/services/error.handler';
import { useToast } from '@/providers/ToastProvider';

// ─── Validation ────────────────────────────────────────────────────────────────

interface FormState {
  workDone: string;
  totalCost: string;
  serviceDate: string;
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

function validateForm(form: FormState): FieldErrors {
  const errors: FieldErrors = {};

  if (!form.serviceDate.trim()) {
    errors.serviceDate = 'Service date is required.';
  } else {
    const d = new Date(form.serviceDate);
    if (isNaN(d.getTime())) {
      errors.serviceDate = 'Enter a valid date (YYYY-MM-DD).';
    }
  }

  if (!form.workDone.trim()) {
    errors.workDone = 'Work description is required.';
  } else if (form.workDone.trim().length < 5) {
    errors.workDone = 'Description must be at least 5 characters.';
  }

  if (form.totalCost.trim() !== '') {
    const cost = parseFloat(form.totalCost);
    if (isNaN(cost) || cost < 0) {
      errors.totalCost = 'Cost must be a non-negative number.';
    }
  }

  return errors;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function AddRecordScreen() {
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const router = useRouter();
  const { theme } = useUnistyles();
  const { mutate: create, isPending } = useCreateRecord();
  const { showToast } = useToast();

  const [form, setForm] = useState<FormState>({
    workDone: '',
    totalCost: '',
    serviceDate: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});

  const setField = (key: keyof FormState, value: string) => {
    setForm(f => ({ ...f, [key]: value }));
    setTouched(t => ({ ...t, [key]: true }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = () => {
    const allTouched: Record<keyof FormState, boolean> = { workDone: true, totalCost: true, serviceDate: true };
    setTouched(allTouched);

    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    create(
      {
        vehicleId: vehicleId!,
        workDone: form.workDone.trim(),
        totalCost: form.totalCost ? parseFloat(form.totalCost) : 0,
        serviceDate: form.serviceDate,
      },
      {
        onSuccess: () => {
          showToast('Record added successfully', 'success');
          router.back();
        },
        onError: (err) => showToast(handleApiError(err), 'error'),
      },
    );
  };

  return (
    <ScreenWrapper bg="#1A1A2E">
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />

      {/* ── DARK TOP SECTION ── */}
      <View style={styles.topSection}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerSub}>Technical Entry</Text>
            <Text style={styles.headerTitle}>Add Record</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>
        <View style={styles.decCircle1} />
        <View style={styles.decCircle2} />
      </View>

      {/* ── WHITE CARD SECTION ── */}
      <View style={styles.mainCard}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* Service Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Service Date <Text style={styles.required}>*</Text></Text>
            <View style={[
              styles.inputRow,
              touched.serviceDate && errors.serviceDate && styles.inputRowError,
            ]}>
              <Ionicons name="calendar-outline" size={18} color={touched.serviceDate && errors.serviceDate ? '#EF4444' : '#9CA3AF'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={form.serviceDate}
                onChangeText={(v) => setField('serviceDate', v)}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9CA3AF"
                keyboardType="numbers-and-punctuation"
                maxLength={10}
              />
            </View>
            {touched.serviceDate && errors.serviceDate
              ? <Text style={styles.errorText}>{errors.serviceDate}</Text>
              : <Text style={styles.hintText}>Format: YYYY-MM-DD</Text>
            }
          </View>

          {/* Description of Work */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description of Work <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                touched.workDone && errors.workDone && styles.inputError,
              ]}
              value={form.workDone}
              onChangeText={(v) => setField('workDone', v)}
              placeholder="Details of the repairs or maintenance performed..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            {touched.workDone && errors.workDone
              ? <Text style={styles.errorText}>{errors.workDone}</Text>
              : null
            }
          </View>

          {/* Total Cost */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Total Cost (LKR) <Text style={styles.optional}>(optional)</Text></Text>
            <View style={[
              styles.inputRow,
              touched.totalCost && errors.totalCost && styles.inputRowError,
            ]}>
              <Ionicons name="cash-outline" size={18} color={touched.totalCost && errors.totalCost ? '#EF4444' : '#9CA3AF'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={form.totalCost}
                onChangeText={(v) => setField('totalCost', v)}
                keyboardType="numeric"
                placeholder="e.g. 15000"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            {touched.totalCost && errors.totalCost
              ? <Text style={styles.errorText}>{errors.totalCost}</Text>
              : null
            }
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, isPending && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={isPending}
            activeOpacity={0.8}
          >
            {isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={styles.saveBtnText}>Save Service Record</Text>
              </>
            )}
          </TouchableOpacity>

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
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 10, marginTop: 12 },
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
    textAlign: 'center',
  },
  headerTitle: {
    fontSize: theme.fonts.sizes.pageTitle,
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: -0.5,
    marginTop: 4,
    textAlign: 'center',
  },
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
  scroll: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: 32,
    paddingBottom: 130,
  },

  inputGroup: { marginBottom: 24 },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  required: { color: '#EF4444', fontWeight: '900' },
  optional: { fontWeight: '500', color: '#9CA3AF', textTransform: 'none', letterSpacing: 0 },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 54,
  },
  inputRowError: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
  },
  inputError: { borderColor: '#FCA5A5', backgroundColor: '#FFF5F5' },
  textArea: { height: 120, textAlignVertical: 'top' },

  errorText: { fontSize: 12, color: '#EF4444', fontWeight: '700', marginTop: 6, marginLeft: 2 },
  hintText: { fontSize: 11, color: '#9CA3AF', fontWeight: '600', marginTop: 6, marginLeft: 2, fontStyle: 'italic' },

  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: theme.colors.brand,
    borderRadius: 18,
    height: 58,
    marginTop: 8,
    shadowColor: theme.colors.brand,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  saveBtnText: { color: '#fff', fontWeight: '900', fontSize: 16, letterSpacing: 0.5 },
}));
