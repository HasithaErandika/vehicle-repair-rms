import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { useAuth } from '@/providers/AuthProvider';
import { AppLogo } from '@/components/ui/AppLogo';

const { height: SCREEN_H } = Dimensions.get('window');

export function LoginScreen() {
  const { loginWithCredentials, bypassLogin } = useAuth();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });

  const validate = () => {
    let valid = true;
    let newErrors = { email: '', password: '' };

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    }

    setFieldErrors(newErrors);
    return valid;
  };

  const handleSignIn = async () => {
  if (!validate()) return;   
  setLoading(true);
  setError(null);
  try {
    await loginWithCredentials(email.trim().toLowerCase(), password);

  } catch (err: any) {
    setError(err?.message || 'Invalid credentials. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* ── DARK TOP SECTION ── */}
          <View style={styles.topSection}>
            <AppLogo size={44} showText variant="light" />
            <Text style={styles.greeting}>Welcome back</Text>
            <Text style={styles.greetingSub}>Sign in to continue</Text>

            {/* decorative orange pill */}
            <View style={styles.pill} />
          </View>

          {/* ── WHITE FORM CARD ── */}
          <View style={styles.formCard}>

            {error ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={16} color="#B91C1C" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* EMAIL */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email address</Text>
              <View style={[styles.inputRow, fieldErrors.email ? styles.inputRowError : null]}>
                <Ionicons name="mail-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="your@email.com"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
                    if (error) setError(null);
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                />
              </View>
              {fieldErrors.email ? <Text style={styles.inlineErrorText}>{fieldErrors.email}</Text> : null}
            </View>

            {/* PASSWORD */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputRow, fieldErrors.password ? styles.inputRowError : null]}>
                <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
                    if (error) setError(null);
                  }}
                  returnKeyType="done"
                  onSubmitEditing={handleSignIn}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={10}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
              {fieldErrors.password ? <Text style={styles.inlineErrorText}>{fieldErrors.password}</Text> : null}
            </View>

            {/* SIGN IN BUTTON */}
            <TouchableOpacity
              style={[styles.signInBtn, loading && styles.btnDisabled]}
              onPress={handleSignIn}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color="#FFFFFF" />
                : (
                  <View style={styles.btnInner}>
                    <Ionicons name="log-in-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.signInBtnText}>Sign In</Text>
                  </View>
                )
              }
            </TouchableOpacity>

            {/* DIVIDER */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* CREATE ACCOUNT */}
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => router.push('/auth/register' as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryBtnText}>Create a new account</Text>
            </TouchableOpacity>

            {/* DEVELOPMENT MOCKS */}
            <View style={styles.devMockContainer}>
               <Text style={styles.devMockLabel}>Development Bypasses</Text>
               <View style={styles.devMockGrid}>
                  <TouchableOpacity style={styles.devMockBtn} onPress={() => bypassLogin('admin')} activeOpacity={0.8}>
                     <Text style={styles.devMockBtnText}>Admin</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.devMockBtn} onPress={() => bypassLogin('customer')} activeOpacity={0.8}>
                     <Text style={styles.devMockBtnText}>Customer</Text>
                  </TouchableOpacity>
               </View>
               <View style={styles.devMockGrid}>
                  <TouchableOpacity style={styles.devMockBtn} onPress={() => bypassLogin('workshop_owner')} activeOpacity={0.8}>
                     <Text style={styles.devMockBtnText}>Owner</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.devMockBtn} onPress={() => bypassLogin('workshop_staff')} activeOpacity={0.8}>
                     <Text style={styles.devMockBtnText}>Technician</Text>
                  </TouchableOpacity>
               </View>
            </View>
          </View>

          {/* ── FOOTER ── */}
          <View style={styles.footer}>
            <Ionicons name="shield-checkmark-outline" size={13} color="#9CA3AF" />
            <Text style={styles.footerText}> Secured by </Text>
            <Text style={styles.footerBrand}>Asgardeo · WSO2</Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  safe: { flex: 1, backgroundColor: '#1A1A2E' },
  scroll: { flexGrow: 1 },

  /* ── DARK TOP ── */
  topSection: {
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 64,
    alignItems: 'flex-start',
    position: 'relative',
    overflow: 'hidden',
  },
  greeting: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.8,
    marginTop: 28,
    marginBottom: 6,
  },
  greetingSub: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '500',
  },
  pill: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(245,110,15,0.15)',
    top: -20,
    right: -20,
  },

  /* ── FORM CARD ── */
  formCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -28,
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 32,
    flex: 1,
    minHeight: SCREEN_H * 0.62,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 16,
  },

  errorBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FEF2F2', borderRadius: 12, padding: 14,
    marginBottom: 24, gap: 8, borderWidth: 1, borderColor: '#FECACA',
  },
  errorText: { color: '#B91C1C', fontSize: 13, fontWeight: '600', flex: 1 },

  inputGroup: { marginBottom: 20 },
  label: { fontSize: 12, fontWeight: '800', color: '#6B7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.6 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 14,
    paddingHorizontal: 16, height: 54,
    backgroundColor: '#FAFAFA',
  },
  inputRowError: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  inlineErrorText: { color: '#EF4444', fontSize: 12, marginTop: 6, marginLeft: 4, fontWeight: '600' },
  inputIcon: { marginRight: 10 },
  textInput: { flex: 1, fontSize: 15, color: '#1A1A2E', fontWeight: '500' },

  signInBtn: {
    backgroundColor: '#F56E0F',
    borderRadius: 14,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#F56E0F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  btnDisabled: { opacity: 0.6 },
  btnInner: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  signInBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { fontSize: 13, color: '#9CA3AF', fontWeight: '600' },

  secondaryBtn: {
    height: 52, borderRadius: 14,
    borderWidth: 1.5, borderColor: '#E5E7EB',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  secondaryBtnText: { fontSize: 15, fontWeight: '700', color: '#1A1A2E' },

  devMockContainer: { marginTop: 32, alignItems: 'center' },
  devMockLabel: { fontSize: 10, fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  devMockGrid: { flexDirection: 'row', gap: 10, width: '100%', marginBottom: 10 },
  devMockBtn: { flex: 1, backgroundColor: '#FAFAFA', borderWidth: 1.5, borderColor: '#F3F4F6', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  devMockBtnText: { fontSize: 13, fontWeight: '800', color: '#6B7280' },

  footer: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
  },
  footerText: { fontSize: 12, color: '#9CA3AF' },
  footerBrand: { fontSize: 12, color: '#F56E0F', fontWeight: '700' },
}));
