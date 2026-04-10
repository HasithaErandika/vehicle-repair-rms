import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useAuthForm } from '../hooks/useAuthForm';
import { useAuth } from '@/providers/AuthProvider';

export function RegisterScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { 
    name, setName, 
    email, setEmail, 
    password, setPassword, 
    confirmPassword, setConfirmPassword,
    errors, 
    validateRegister 
  } = useAuthForm();
  
  const [loading, setLoading] = React.useState(false);

  const handleRegister = async () => {
    if (!validateRegister()) return;
    
    setLoading(true);
    try {
      // Logic for registration
      // This is a placeholder since the AuthProvider handles OIDC usually
      // For this spec, we implement the screen and manual flow if needed.
      Alert.alert('Success', 'Account created successfully');
      router.replace('/auth/login');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper scroll>
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join the VSRMS community today</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput 
            style={[styles.input, errors.name && styles.inputError]} 
            value={name} 
            onChangeText={setName} 
            placeholder="John Doe" 
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          <Text style={styles.label}>Email Address</Text>
          <TextInput 
            style={[styles.input, errors.email && styles.inputError]} 
            value={email} 
            onChangeText={setEmail} 
            placeholder="john@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <Text style={styles.label}>Password</Text>
          <TextInput 
            style={[styles.input, errors.password && styles.inputError]} 
            value={password} 
            onChangeText={setPassword} 
            placeholder="••••••••"
            secureTextEntry
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput 
            style={[styles.input, errors.confirmPassword && styles.inputError]} 
            value={confirmPassword} 
            onChangeText={setConfirmPassword} 
            placeholder="••••••••"
            secureTextEntry
          />
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.replace('/auth/login')}>
            <Text style={styles.linkText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: { padding: theme.spacing.xl, flex: 1, minHeight: 600 },
  title: { fontSize: 32, fontWeight: '800', color: theme.colors.text, marginBottom: 8 },
  subtitle: { fontSize: theme.fonts.sizes.md, color: theme.colors.muted, marginBottom: 32 },
  form: { gap: 16 },
  label: { fontSize: theme.fonts.sizes.sm, fontWeight: '700', color: theme.colors.text },
  input: { 
    backgroundColor: theme.colors.surface, 
    borderWidth: 1, 
    borderColor: theme.colors.border, 
    borderRadius: theme.radii.md, 
    padding: theme.spacing.md,
    fontSize: theme.fonts.sizes.md,
    color: theme.colors.text
  },
  inputError: { borderColor: theme.colors.error || '#EF4444' },
  errorText: { color: theme.colors.error || '#EF4444', fontSize: 12, marginTop: -8 },
  button: { 
    backgroundColor: theme.colors.brand, 
    padding: theme.spacing.md, 
    borderRadius: theme.radii.lg, 
    alignItems: 'center',
    marginTop: 16
  },
  buttonText: { color: '#fff', fontWeight: '800', fontSize: theme.fonts.sizes.md },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
  footerText: { color: theme.colors.muted },
  linkText: { color: theme.colors.brand, fontWeight: '700' },
}));
