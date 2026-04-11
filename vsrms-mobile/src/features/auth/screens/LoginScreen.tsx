import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  ScrollView,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useAuth } from '@/providers/AuthProvider';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { StyleSheet } from 'react-native-unistyles';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

export function LoginScreen() {
  const { signIn, mockSignIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError(null);
    try {
      // In a real scenario, this would call the API or Asgardeo flow
      // Adding a small delay to simulate processing
      setTimeout(() => {
        setLoading(false);
        setError('Manual login is for demo. Please use the Porta access below for testing.');
      }, 1000);
    } catch (err: any) {
      setError('Invalid credentials. Please try again.');
      setLoading(false);
    }
  };

  const personas = [
    { name: 'Admin', role: 'admin', icon: 'shield-checkmark', color: '#1A1A2E' },
    { name: 'Garage', role: 'workshop_owner', icon: 'business', color: '#F56E0F' },
    { name: 'Staff', role: 'workshop_staff', icon: 'people', color: '#10B981' },
    { name: 'Customer', role: 'customer', icon: 'person', color: '#3B82F6' },
  ] as const;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          
          {/* HEADER LOGO & TITLE */}
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <View style={styles.logoBox}>
                <View style={styles.dotRow}>
                  <View style={styles.whiteDot} />
                  <View style={styles.orangeDot} />
                </View>
              </View>
              <View style={styles.titleCol}>
                <Text style={styles.logoText}>VSRMS</Text>
                <Text style={styles.logoSubtext}>Vehicle Service & Repair</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.settingsBtn}>
              <Ionicons name="settings-outline" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* MAIN SIGN IN CARD */}
          <Animated.View entering={FadeInUp.duration(600)} style={styles.card}>
            <Text style={styles.signInTitle}>Sign In</Text>
            <Text style={styles.signInSubtitle}>Sign in to your account to continue</Text>

            {/* ERROR MESSAGE */}
            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* EMAIL INPUT */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email / Username</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter your email or username" 
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
            </View>

            {/* PASSWORD INPUT */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput 
                  style={styles.passwordInput} 
                  placeholder="Enter your password" 
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.showBtn}>{showPassword ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* SIGN IN BUTTON */}
            <TouchableOpacity 
              style={[styles.signInBtn, loading && { opacity: 0.7 }]} 
              onPress={handleSignIn}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.signInBtnText}>Sign In</Text>}
            </TouchableOpacity>

            <View style={styles.orRow}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.orLine} />
            </View>

            {/* SOCIAL BUTTONS */}
            <TouchableOpacity style={styles.socialBtn}>
              <View style={styles.socialIconBox}>
                <FontAwesome name="google" size={16} color="#1A1A2E" />
              </View>
              <Text style={styles.socialText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialBtn}>
              <View style={styles.socialIconBoxBlue}>
                <FontAwesome name="facebook" size={16} color="white" />
              </View>
              <Text style={styles.socialText}>Continue with Facebook</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* CREATE ACCOUNT LINK */}
          <View style={styles.bottomSection}>
            <View style={styles.createAccountRow}>
              <Text style={styles.noAccountText}>Don't have an account? </Text>
              <TouchableOpacity>
                <Text style={styles.createText}>Create an account</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.asgardeoRow}>
              <Text style={styles.securedText}>Secured by </Text>
              <Text style={styles.asgardeoTextBrand}>Asgardeo</Text>
              <Text style={styles.securedText}> · WSO2</Text>
            </View>
            
            {/* PORTAL ACCESS (DEVELOPER SHORTCUTS) */}
            <View style={styles.personaRow}>
              {personas.map((p) => (
                <TouchableOpacity 
                  key={p.role} 
                  onPress={() => mockSignIn(p.role)}
                  style={styles.personaChip}
                >
                  <Ionicons name={p.icon as any} size={14} color="#6B7280" />
                  <Text style={styles.personaChipText}>{p.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContent: { flexGrow: 1 },
  container: { paddingHorizontal: 20, paddingTop: 20 },
  
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10
  },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoBox: {
    width: 48,
    height: 48,
    backgroundColor: '#1A1A2E',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  dotRow: { flexDirection: 'row', gap: 4 },
  whiteDot: { width: 10, height: 10, borderRadius: 2, backgroundColor: '#FFFFFF' },
  orangeDot: { width: 10, height: 10, borderRadius: 2, backgroundColor: '#F56E0F' },
  titleCol: { justifyContent: 'center' },
  logoText: { fontSize: 20, fontWeight: '800', color: '#1A1A2E' },
  logoSubtext: { fontSize: 11, color: '#6B7280', fontWeight: '500' },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    boxShadow: [{
      offsetX: 0,
      offsetY: 2,
      blurRadius: 10,
      color: 'rgba(0,0,0,0.05)',
    }],
    elevation: 3,
    marginBottom: 30
  },
  signInTitle: { fontSize: 24, fontWeight: '800', color: '#1A1A2E', marginBottom: 8 },
  signInSubtitle: { fontSize: 14, color: '#6B7280', marginBottom: 24 },
  
  errorText: { color: theme.colors.error, fontSize: 12, marginBottom: 16, fontWeight: '600' },
  
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '700', color: '#1A1A2E', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
    color: '#1A1A2E'
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingRight: 14
  },
  passwordInput: {
    flex: 1,
    padding: 14,
    fontSize: 15,
    color: '#1A1A2E'
  },
  showBtn: { color: '#F56E0F', fontWeight: '700', fontSize: 13 },
  
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotText: { color: '#F56E0F', fontSize: 14, fontWeight: '700' },
  
  signInBtn: {
    backgroundColor: '#FFBD80', // Soft orange from screenshot
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24
  },
  signInBtnText: { color: 'white', fontSize: 16, fontWeight: '800' },

  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24
  },
  orLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  orText: { marginHorizontal: 12, fontSize: 12, fontWeight: '700', color: '#9CA3AF' },

  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12
  },
  socialIconBox: {
    width: 28,
    height: 28,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  socialIconBoxBlue: {
    width: 28,
    height: 28,
    backgroundColor: '#1877F2',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  socialText: { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },

  bottomSection: { alignItems: 'center' },
  createAccountRow: { flexDirection: 'row', marginBottom: 20 },
  noAccountText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  createText: { fontSize: 14, color: '#F56E0F', fontWeight: '800' },

  asgardeoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  securedText: { fontSize: 12, color: '#9CA3AF', fontWeight: '600' },
  asgardeoTextBrand: { fontSize: 12, color: '#F56E0F', fontWeight: '800' },
  
  personaRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center', 
    gap: 8,
    paddingHorizontal: 20
  },
  personaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.03)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)'
  },
  personaChipText: { fontSize: 11, fontWeight: '700', color: '#6B7280' }
}));
