import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { StyleSheet } from 'react-native-unistyles';
import { login as loginApi } from '../api/auth.api';

export function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      const { access_token } = await loginApi({ email, password });
      await signIn(access_token);
    } catch (error) {
      console.error('Login failed', error);
      // Show error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Email" 
          value={email} 
          onChangeText={setEmail} 
          autoCapitalize="none" 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry 
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: { flex: 1, padding: theme.spacing.xl, justifyContent: 'center' },
  title: { fontSize: theme.fonts.sizes.xxl, fontWeight: '800', color: theme.colors.text, marginBottom: theme.spacing.xl, textAlign: 'center' },
  input: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radii.md, padding: theme.spacing.md, marginBottom: theme.spacing.md },
  button: { backgroundColor: theme.colors.brand, borderRadius: theme.radii.lg, padding: theme.spacing.md, alignItems: 'center', marginTop: theme.spacing.sm },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: theme.fonts.sizes.md },
}));
