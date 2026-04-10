import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, CustomBorders, Shadows } from '../../constants/theme';
import { ShieldCheck, Eye, EyeOff, User, Mail, Phone, Lock, Check } from 'lucide-react-native';
import { useAuth } from '../../providers/AuthProvider';
import { register as registerApi } from '../../features/auth/api/auth.api';

type Role = 'customer' | 'workshop_owner' | 'workshop_staff' | 'admin';

const ROLES: { key: Role; label: string }[] = [
  { key: 'customer',       label: 'Vehicle Owner' },
  { key: 'workshop_owner', label: 'Garage Owner' },
  { key: 'workshop_staff', label: 'Technician' },
  { key: 'admin',          label: 'Platform Admin' },
];

export default function RegisterScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [step, setStep]               = useState<1 | 2>(1);
  const [role, setRole]               = useState<Role>('customer');
  const [firstName, setFirstName]     = useState('');
  const [lastName, setLastName]       = useState('');
  const [email, setEmail]             = useState('');
  const [phone, setPhone]             = useState('');
  const [password, setPassword]       = useState('');
  const [confirm, setConfirm]         = useState('');
  const [showPwd, setShowPwd]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed]           = useState(false);
  const [focusField, setFocusField]   = useState<string | null>(null);
  const [loading, setLoading]         = useState(false);

  const pwdMatch  = confirm.length > 0 && password === confirm;
  const pwdNoMatch = confirm.length > 0 && password !== confirm;

  const step1Valid = firstName.trim() && lastName.trim() && email.trim() && phone.trim();
  const step2Valid = password.length >= 8 && pwdMatch && agreed;

  const inputStyle = (field: string): any[] => [
    styles.input,
    focusField === field && styles.inputFocused,
  ];

  const handleNext = () => {
    if (step1Valid) setStep(2);
  };

  const handleSubmit = async () => {
    if (!step2Valid) return;
    setLoading(true);
    try {
      await registerApi({
        firstName,
        lastName,
        email,
        phone,
        password,
        role,
      });

      // After successful registration, usually redirect to login or auto-login
      // For now, let's redirect to login with a success message (mobile often uses toast)
      router.replace('/auth/login' as any);
    } catch (error) {
      console.error('Registration failed', error);
      // In a real app, show error toast
    } finally {
      setLoading(false);
    }
  };

  const PasswordStrength = () => {
    const len = password.length;
    const level = len === 0 ? 0 : len < 6 ? 1 : len < 10 ? 2 : 3;
    const colors = [Colors.light.border, Colors.light.error, Colors.light.warning, Colors.light.success];
    const labels = ['', 'Weak', 'Fair', 'Strong'];
    return (
      <View style={pStyles.row}>
        {[1, 2, 3].map(i => (
          <View key={i} style={[pStyles.bar, { backgroundColor: level >= i ? colors[level] : Colors.light.border }]} />
        ))}
        {len > 0 && <Text style={[pStyles.label, { color: colors[level] }]}>{labels[level]}</Text>}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.light.background} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── CARD ── */}
          <View style={styles.card}>

            {/* Brand */}
            <View style={styles.brandRow}>
              <View style={styles.logoBox}>
                <ShieldCheck color={Colors.light.surface} size={28} />
              </View>
              <View>
                <Text style={styles.appName}>VSRMS</Text>
                <Text style={styles.appTagline}>Vehicle Service & Repair</Text>
              </View>
            </View>

            <View style={styles.dividerLine} />

            {/* Title + Step indicator */}
            <View style={styles.titleRow}>
              <View>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Step {step} of 2</Text>
              </View>
              <View style={styles.stepIndicator}>
                <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]} />
                <View style={[styles.stepConnector, step >= 2 && styles.stepConnectorActive]} />
                <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]} />
              </View>
            </View>

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <View>
                {/* Role */}
                <View style={styles.field}>
                  <Text style={styles.label}>I am registering as</Text>
                  <View style={styles.roleRow}>
                    {ROLES.map(r => (
                      <TouchableOpacity
                        key={r.key}
                        style={[styles.roleChip, role === r.key && styles.roleChipActive]}
                        onPress={() => setRole(r.key)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.roleText, role === r.key && styles.roleTextActive]}>
                          {r.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Name row */}
                <View style={styles.row2}>
                  <View style={[styles.field, { flex: 1 }]}>
                    <Text style={styles.label}>First Name</Text>
                    <View style={[styles.inputRow, focusField === 'first' && styles.inputFocused]}>
                      <User size={18} color={focusField === 'first' ? Colors.light.primary : Colors.light.textMuted} style={styles.inputIcon} />
                      <TextInput
                        style={styles.inputFlat}
                        placeholder="John"
                        placeholderTextColor={Colors.light.textMuted}
                        value={firstName}
                        onChangeText={setFirstName}
                        onFocus={() => setFocusField('first')}
                        onBlur={() => setFocusField(null)}
                        autoCapitalize="words"
                      />
                    </View>
                  </View>
                  <View style={[styles.field, { flex: 1 }]}>
                    <Text style={styles.label}>Last Name</Text>
                    <View style={[styles.inputRow, focusField === 'last' && styles.inputFocused]}>
                      <TextInput
                        style={styles.inputFlat}
                        placeholder="Perera"
                        placeholderTextColor={Colors.light.textMuted}
                        value={lastName}
                        onChangeText={setLastName}
                        onFocus={() => setFocusField('last')}
                        onBlur={() => setFocusField(null)}
                        autoCapitalize="words"
                      />
                    </View>
                  </View>
                </View>

                {/* Email */}
                <View style={styles.field}>
                  <Text style={styles.label}>Email Address</Text>
                  <View style={[styles.inputRow, focusField === 'email' && styles.inputFocused]}>
                    <Mail size={18} color={focusField === 'email' ? Colors.light.primary : Colors.light.textMuted} style={styles.inputIcon} />
                    <TextInput
                      style={styles.inputFlat}
                      placeholder="you@example.com"
                      placeholderTextColor={Colors.light.textMuted}
                      value={email}
                      onChangeText={setEmail}
                      onFocus={() => setFocusField('email')}
                      onBlur={() => setFocusField(null)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                {/* Phone */}
                <View style={styles.field}>
                  <Text style={styles.label}>Mobile Number</Text>
                  <View style={[styles.inputRow, focusField === 'phone' && styles.inputFocused]}>
                    <Phone size={18} color={focusField === 'phone' ? Colors.light.primary : Colors.light.textMuted} style={styles.inputIcon} />
                    <TextInput
                      style={styles.inputFlat}
                      placeholder="+94 77 123 4567"
                      placeholderTextColor={Colors.light.textMuted}
                      value={phone}
                      onChangeText={setPhone}
                      onFocus={() => setFocusField('phone')}
                      onBlur={() => setFocusField(null)}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.btnPrimary, !step1Valid && styles.btnMuted, { marginTop: Spacing.one }]}
                  activeOpacity={0.85}
                  onPress={handleNext}
                  disabled={!step1Valid}
                >
                  <Text style={styles.btnText}>Continue</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <View>
                {/* Password */}
                <View style={styles.field}>
                  <Text style={styles.label}>Password</Text>
                  <View style={[styles.inputRow, focusField === 'pwd' && styles.inputFocused]}>
                    <Lock size={18} color={focusField === 'pwd' ? Colors.light.primary : Colors.light.textMuted} style={styles.inputIcon} />
                    <TextInput
                      style={styles.inputFlat}
                      placeholder="Min. 8 characters"
                      placeholderTextColor={Colors.light.textMuted}
                      value={password}
                      onChangeText={setPassword}
                      onFocus={() => setFocusField('pwd')}
                      onBlur={() => setFocusField(null)}
                      secureTextEntry={!showPwd}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={() => setShowPwd(v => !v)} style={styles.eyeBtn}>
                      {showPwd ? <EyeOff size={20} color={Colors.light.primary} /> : <Eye size={20} color={Colors.light.primary} />}
                    </TouchableOpacity>
                  </View>
                  {password.length > 0 && <PasswordStrength />}
                </View>

                {/* Confirm */}
                <View style={styles.field}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <View style={[
                    styles.inputRow,
                    focusField === 'confirm' && styles.inputFocused,
                    pwdMatch   && styles.inputSuccess,
                    pwdNoMatch && styles.inputError,
                  ]}>
                    <Lock size={18} color={focusField === 'confirm' ? Colors.light.primary : Colors.light.textMuted} style={styles.inputIcon} />
                    <TextInput
                      style={styles.inputFlat}
                      placeholder="Re-enter password"
                      placeholderTextColor={Colors.light.textMuted}
                      value={confirm}
                      onChangeText={setConfirm}
                      onFocus={() => setFocusField('confirm')}
                      onBlur={() => setFocusField(null)}
                      secureTextEntry={!showConfirm}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={() => setShowConfirm(v => !v)} style={styles.eyeBtn}>
                      {showConfirm ? <EyeOff size={20} color={Colors.light.primary} /> : <Eye size={20} color={Colors.light.primary} />}
                    </TouchableOpacity>
                  </View>
                  {pwdNoMatch && <Text style={styles.errMsg}>Passwords do not match</Text>}
                  {pwdMatch   && <Text style={styles.okMsg}>Passwords match</Text>}
                </View>

                {/* Terms */}
                <TouchableOpacity style={styles.termsRow} onPress={() => setAgreed(v => !v)} activeOpacity={0.8}>
                  <View style={[styles.checkbox, agreed && styles.checkboxOn]}>
                    {agreed && <Check size={14} color={Colors.light.surface} strokeWidth={3} />}
                  </View>
                  <Text style={styles.termsText}>
                    I agree to the{' '}
                    <Text style={styles.termsLink}>Terms of Service</Text>
                    {' '}and{' '}
                    <Text style={styles.termsLink}>Privacy Policy</Text>
                  </Text>
                </TouchableOpacity>

                {/* Buttons */}
                <View style={styles.row2}>
                  <TouchableOpacity style={styles.btnSecondary} onPress={() => setStep(1)} activeOpacity={0.8}>
                    <Text style={styles.btnSecondaryText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btnPrimary, { flex: 1 }, !step2Valid && styles.btnMuted]}
                    activeOpacity={0.85}
                    onPress={handleSubmit}
                    disabled={!step2Valid || loading}
                  >
                    {loading
                      ? <ActivityIndicator color={Colors.light.surface} size="small" />
                      : <Text style={styles.btnText}>Create Account</Text>}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?  </Text>
            <TouchableOpacity onPress={() => router.push('/auth/login' as any)} activeOpacity={0.7}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Powered by */}
          <View style={styles.poweredRow}>
            <ShieldCheck size={14} color={Colors.light.textMuted} style={{marginRight: 4}} />
            <Text style={styles.poweredText}>Secured by </Text>
            <Text style={styles.poweredBrand}>Asgardeo</Text>
            <Text style={styles.poweredText}> · WSO2</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const pStyles = StyleSheet.create({
  row:   { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  bar:   { flex: 1, height: 4, borderRadius: 2 },
  label: { fontSize: 11, fontWeight: '700', width: 48, textAlign: 'right' },
});

const styles = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: Colors.light.background },
  flex:  { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
  },

  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: CustomBorders.radius.lg,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
    ...Shadows.lg,
  },

  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: Spacing.three },
  logoBox: {
    width: 48, height: 48, borderRadius: CustomBorders.radius.md,
    backgroundColor: Colors.light.primary, alignItems: 'center', justifyContent: 'center',
  },
  appName:    { fontSize: 20, fontWeight: '800', color: Colors.light.text, letterSpacing: 0.5 },
  appTagline: { fontSize: 12, color: Colors.light.textMuted, fontWeight: '500', marginTop: 2 },

  dividerLine: { height: 1, backgroundColor: Colors.light.border, marginBottom: 22 },

  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.four },
  title:    { fontSize: 24, fontWeight: '800', color: Colors.light.text },
  subtitle: { fontSize: 14, color: Colors.light.textMuted, marginTop: 4 },

  stepIndicator: { flexDirection: 'row', alignItems: 'center' },
  stepDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.light.border },
  stepDotActive: { backgroundColor: Colors.light.primary },
  stepConnector: { width: 24, height: 2, backgroundColor: Colors.light.border, marginHorizontal: 4 },
  stepConnectorActive: { backgroundColor: Colors.light.primary },

  field: { marginBottom: Spacing.three },
  label: { fontSize: 13, fontWeight: '600', color: Colors.light.text, marginBottom: 8 },

  roleRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 4 },
  roleChip: {
    minWidth: '45%', flex: 1, paddingHorizontal: 14, paddingVertical: 12, borderRadius: CustomBorders.radius.sm,
    borderWidth: 1.5, borderColor: Colors.light.border, backgroundColor: Colors.light.surface, alignItems: 'center',
  },
  roleChipActive: { borderColor: Colors.light.primary, backgroundColor: Colors.light.primaryMuted },
  roleText: { fontSize: 13, fontWeight: '700', color: Colors.light.textMuted },
  roleTextActive: { color: Colors.light.primary },

  row2: { flexDirection: 'row', gap: 12, marginBottom: 0 },

  input: {
    height: 52, borderWidth: 1.5, borderColor: Colors.light.border,
    borderRadius: CustomBorders.radius.md, paddingHorizontal: 14, fontSize: 15, color: Colors.light.text, backgroundColor: Colors.light.surface,
  },
  inputFocused: { borderColor: Colors.light.primary },
  inputSuccess: { borderColor: Colors.light.success },
  inputError:   { borderColor: Colors.light.error },

  inputRow: {
    height: 52, flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.light.border, borderRadius: CustomBorders.radius.md,
    paddingHorizontal: 14, backgroundColor: Colors.light.surface,
  },
  inputIcon: { marginLeft: 2, marginRight: 8 },
  inputFlat: { flex: 1, fontSize: 15, color: Colors.light.text, height: '100%' },
  eyeBtn: { paddingHorizontal: 8 },

  errMsg: { fontSize: 12, color: Colors.light.error, marginTop: 6, fontWeight: '500' },
  okMsg:  { fontSize: 12, color: Colors.light.success, marginTop: 6, fontWeight: '500' },

  termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: Spacing.four, marginTop: 8 },
  checkbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 2,
    borderColor: Colors.light.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
  },
  checkboxOn: { backgroundColor: Colors.light.primary, borderColor: Colors.light.primary },
  termsText: { flex: 1, fontSize: 13, color: Colors.light.textMuted, lineHeight: 22 },
  termsLink: { color: Colors.light.primary, fontWeight: '700' },

  btnPrimary: {
    height: 54, backgroundColor: Colors.light.primary, borderRadius: CustomBorders.radius.md,
    alignItems: 'center', justifyContent: 'center', ...Shadows.md, shadowColor: Colors.light.primary,
  },
  btnMuted: { opacity: 0.6 },
  btnText:  { color: Colors.light.surface, fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },

  btnSecondary: {
    height: 54, borderRadius: CustomBorders.radius.md, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: Colors.light.border, paddingHorizontal: 24,
  },
  btnSecondaryText: { fontSize: 15, fontWeight: '700', color: Colors.light.text },

  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: Spacing.four },
  footerText: { fontSize: 14, color: Colors.light.textMuted },
  footerLink: { fontSize: 14, color: Colors.light.primary, fontWeight: '700' },

  poweredRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: Spacing.four },
  poweredText:  { fontSize: 12, color: Colors.light.textMuted },
  poweredBrand: { fontSize: 12, color: Colors.light.primary, fontWeight: '700' },
});
