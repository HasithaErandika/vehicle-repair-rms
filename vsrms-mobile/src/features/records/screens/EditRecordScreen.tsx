import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { ChevronLeft, Save, Wrench, DollarSign, Gauge, User, CalendarDays, Package } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { useRecord } from '../queries/queries';
import { useUpdateRecord } from '../queries/mutations';
import { handleApiError } from '@/services/error.handler';
import { UpdateRecordPayload } from '../types/records.types';

// ─── Validation helpers ────────────────────────────────────────────────────────

function isValidDate(str: string): boolean {
  if (!str.trim()) return false;
  const d = new Date(str);
  return !isNaN(d.getTime());
}

function validateForm(form: FormState): Partial<Record<keyof FormState, string>> {
  const errors: Partial<Record<keyof FormState, string>> = {};

  if (!form.workDone.trim()) {
    errors.workDone = 'Work description is required.';
  } else if (form.workDone.trim().length < 5) {
    errors.workDone = 'Work description must be at least 5 characters.';
  }

  if (!form.serviceDate.trim()) {
    errors.serviceDate = 'Service date is required.';
  } else if (!isValidDate(form.serviceDate)) {
    errors.serviceDate = 'Enter a valid date (YYYY-MM-DD).';
  }

  if (form.totalCost !== '') {
    const cost = parseFloat(form.totalCost);
    if (isNaN(cost) || cost < 0) {
      errors.totalCost = 'Cost must be a non-negative number.';
    }
  }

  if (form.mileage !== '') {
    const m = parseInt(form.mileage, 10);
    if (isNaN(m) || m < 0) {
      errors.mileage = 'Mileage must be a non-negative integer.';
    }
  }

  return errors;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  workDone:     string;
  serviceDate:  string;
  totalCost:    string;
  mileage:      string;
  techName:     string;
  parts:        string; // comma-separated string in UI, split into array on submit
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EditRecordScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router  = useRouter();
  const { theme } = useUnistyles();

  // Load the existing record to pre-fill the form
  const { data: record, isLoading: isLoadingRecord, isError, error, refetch } = useRecord(id!);
  const { mutate: updateRecord, isPending } = useUpdateRecord(id!);

  const [form, setForm]     = useState<FormState>({
    workDone:    '',
    serviceDate: '',
    totalCost:   '',
    mileage:     '',
    techName:    '',
    parts:       '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});

  // Pre-fill form as soon as the record loads
  useEffect(() => {
    if (!record) return;
    setForm({
      workDone:    record.workDone ?? '',
      serviceDate: record.serviceDate
        ? new Date(record.serviceDate).toISOString().split('T')[0]
        : '',
      totalCost:   record.totalCost != null ? String(record.totalCost) : '',
      mileage:     record.mileageAtService != null ? String(record.mileageAtService) : '',
      techName:    record.technicianName ?? '',
      parts:       (record.partsReplaced ?? []).join(', '),
    });
  }, [record]);

  const setField = (key: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setTouched(prev => ({ ...prev, [key]: true }));
    // Clear field error on change
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = () => {
    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    // Mark all fields as touched so errors appear
    setTouched({ workDone: true, serviceDate: true, totalCost: true, mileage: true, techName: true, parts: true });

    if (Object.keys(validationErrors).length > 0) return;

    const partsArray = form.parts
      .split(',')
      .map(p => p.trim())
      .filter(Boolean);

    const payload: UpdateRecordPayload = {
      workDone:     form.workDone.trim(),
      serviceDate:  new Date(form.serviceDate).toISOString(),
      partsReplaced: partsArray,
    };

    if (form.totalCost !== '')    payload.totalCost        = parseFloat(form.totalCost);
    if (form.mileage !== '')      payload.mileageAtService = parseInt(form.mileage, 10);
    if (form.techName.trim())     payload.technicianName   = form.techName.trim();

    updateRecord(payload, {
      onSuccess: () => router.back(),
    });
  };

  // ── Loading / Error states ─────────────────────────────────────────────────

  if (isLoadingRecord) {
    return (
      <ScreenWrapper bg="#1A1A2E">
        <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
        <View style={styles.fullCenter}>
          <ActivityIndicator size="large" color="#F56E0F" />
          <Text style={styles.loadingText}>Loading record…</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (isError || !record) {
    return (
      <ScreenWrapper bg="#1A1A2E">
        <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
        <View style={styles.errorWrapper}>
          <ErrorScreen
            onRetry={refetch}
            variant="inline"
            message={isError ? handleApiError(error) : 'Record not found'}
          />
        </View>
      </ScreenWrapper>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <ScreenWrapper bg="#1A1A2E">
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />

      {/* ── DARK TOP SECTION ── */}
      <View style={styles.topSection}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <ChevronLeft size={24} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerSub}>Edit Mode</Text>
            <Text style={styles.headerTitle}>Update Record</Text>
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
            {/* Work Performed */}
            <InputGroup
              label="Work Performed"
              icon={<Wrench size={16} color="#6B7280" />}
              error={touched.workDone ? errors.workDone : undefined}
              required
            >
              <TextInput
                style={[styles.input, styles.textArea, touched.workDone && errors.workDone && styles.inputError]}
                value={form.workDone}
                onChangeText={(v) => setField('workDone', v)}
                placeholder="Describe the repairs or maintenance performed…"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </InputGroup>

            {/* Service Date */}
            <InputGroup
              label="Service Date"
              icon={<CalendarDays size={16} color="#6B7280" />}
              error={touched.serviceDate ? errors.serviceDate : undefined}
              hint="Format: YYYY-MM-DD"
              required
            >
              <TextInput
                style={[styles.input, touched.serviceDate && errors.serviceDate && styles.inputError]}
                value={form.serviceDate}
                onChangeText={(v) => setField('serviceDate', v)}
                placeholder="e.g. 2024-11-15"
                placeholderTextColor="#9CA3AF"
                keyboardType="numbers-and-punctuation"
              />
            </InputGroup>

            {/* Parts Replaced */}
            <InputGroup
              label="Parts Replaced"
              icon={<Package size={16} color="#6B7280" />}
              hint="Separate multiple parts with commas"
            >
              <TextInput
                style={styles.input}
                value={form.parts}
                onChangeText={(v) => setField('parts', v)}
                placeholder="e.g. Oil filter, Brake pads, Air filter"
                placeholderTextColor="#9CA3AF"
              />
            </InputGroup>

            {/* Cost + Mileage side-by-side */}
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <InputGroup
                  label="Total Cost (LKR)"
                  icon={<DollarSign size={16} color="#6B7280" />}
                  error={touched.totalCost ? errors.totalCost : undefined}
                >
                  <TextInput
                    style={[styles.input, touched.totalCost && errors.totalCost && styles.inputError]}
                    value={form.totalCost}
                    onChangeText={(v) => setField('totalCost', v)}
                    placeholder="e.g. 15000"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                </InputGroup>
              </View>
              <View style={{ flex: 1 }}>
                <InputGroup
                  label="Mileage (km)"
                  icon={<Gauge size={16} color="#6B7280" />}
                  error={touched.mileage ? errors.mileage : undefined}
                >
                  <TextInput
                    style={[styles.input, touched.mileage && errors.mileage && styles.inputError]}
                    value={form.mileage}
                    onChangeText={(v) => setField('mileage', v)}
                    placeholder="e.g. 45200"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                </InputGroup>
              </View>
            </View>

            {/* Technician Name */}
            <InputGroup
              label="Technician Name"
              icon={<User size={16} color="#6B7280" />}
            >
              <TextInput
                style={styles.input}
                value={form.techName}
                onChangeText={(v) => setField('techName', v)}
                placeholder="Who performed this service?"
                placeholderTextColor="#9CA3AF"
              />
            </InputGroup>

            {/* Save Button */}
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
                  <Save size={20} color="#fff" strokeWidth={2.5} />
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ScreenWrapper>
  );
}

// ─── Reusable InputGroup sub-component ────────────────────────────────────────

interface InputGroupProps {
  label:     string;
  icon?:     React.ReactNode;
  error?:    string;
  hint?:     string;
  required?: boolean;
  children:  React.ReactNode;
}

function InputGroup({ label, icon, error, hint, required, children }: InputGroupProps) {
  return (
    <View style={styles.inputGroup}>
      <View style={styles.labelRow}>
        {icon && <View style={styles.labelIcon}>{icon}</View>}
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      </View>
      {children}
      {hint && !error && <Text style={styles.hint}>{hint}</Text>}
      {error && (
        <View style={styles.errorRow}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create((theme) => ({
  fullCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  errorWrapper: { flex: 1 },

  topSection: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: 16,
    paddingBottom: theme.spacing.headerBottom,
    position: 'relative',
    overflow: 'hidden',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 20, zIndex: 10, marginTop: 12 },
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
  headerTitle: {
    fontSize: theme.fonts.sizes.pageTitle,
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: -0.5,
    marginTop: 4,
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

  row: { flexDirection: 'row', gap: 16 },

  inputGroup: { marginBottom: 24 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10, marginLeft: 2 },
  labelIcon: { width: 20, alignItems: 'center' },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  required: { color: '#EF4444', fontWeight: '900' },

  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
  },
  inputError: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FFF5F5',
  },
  textArea: { height: 120, textAlignVertical: 'top' },

  hint: { fontSize: 11, color: '#9CA3AF', fontWeight: '600', marginTop: 6, marginLeft: 2 },
  errorRow: { marginTop: 6, marginLeft: 2 },
  errorText: { fontSize: 12, color: '#EF4444', fontWeight: '700' },

  saveBtn: {
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
  saveBtnText: { color: '#fff', fontWeight: '900', fontSize: 16, letterSpacing: 0.5 },
}));
