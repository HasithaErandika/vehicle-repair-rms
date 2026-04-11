import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { Ionicons } from '@expo/vector-icons';
import { AppLogo } from '@/components/ui/AppLogo';

const { height: SCREEN_H } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />

      {/* ── DARK TOP SECTION ── */}
      <View style={styles.topSection}>
        <View style={styles.logoContainer}>
          <AppLogo size={52} showText={true} variant="light" />
        </View>

        <Text style={styles.headline}>Your Vehicle.</Text>
        <Text style={styles.subHeadline}>Fully Managed.</Text>
        
        <Text style={styles.desc}>
          Book workshops, track repairs, and manage your vehicle history effortlessly from your phone.
        </Text>

        {/* Decorative elements to match Login/Register */}
        <View style={styles.decCircle1} />
        <View style={styles.decCircle2} />
      </View>

      {/* ── WHITE BOTTOM CARD ── */}
      <View style={styles.bottomCard}>
        <View style={styles.btnContainer}>
          
          <TouchableOpacity
            style={styles.btnPrimary}
            activeOpacity={0.85}
            onPress={() => router.push('/auth/register' as any)}
          >
            <Ionicons name="rocket-outline" size={20} color="#FFFFFF" />
            <Text style={styles.btnPrimaryText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSecondary}
            activeOpacity={0.85}
            onPress={() => router.push('/auth/login' as any)}
          >
            <Text style={styles.btnSecondaryText}>Sign In</Text>
          </TouchableOpacity>

        </View>

        {/* ── FOOTER ── */}
        <View style={styles.footer}>
          <Ionicons name="shield-checkmark-outline" size={13} color="#9CA3AF" />
          <Text style={styles.footerText}> Secured by </Text>
          <Text style={styles.footerBrand}>Asgardeo · WSO2</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  safe: { flex: 1, backgroundColor: '#1A1A2E' },

  /* ── Dark top ── */
  topSection: {
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 32,
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 40,
    position: 'relative',
    overflow: 'hidden',
  },
  logoContainer: {
    marginBottom: 44,
    alignItems: 'flex-start',
  },
  headline: {
    fontSize: 44,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
    marginBottom: 4,
  },
  subHeadline: {
    fontSize: 44,
    fontWeight: '900',
    color: '#F56E0F',
    letterSpacing: -1,
    marginBottom: 20,
  },
  desc: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
    lineHeight: 24,
    paddingRight: 10,
  },

  decCircle1: {
    position: 'absolute', width: 220, height: 220, borderRadius: 110,
    backgroundColor: 'rgba(245,110,15,0.08)', top: -60, right: -100,
  },
  decCircle2: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(245,110,15,0.05)', bottom: 60, right: -20,
  },

  /* ── White card ── */
  bottomCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    marginTop: -32,
    paddingHorizontal: 32,
    paddingTop: 44,
    paddingBottom: 36,
    minHeight: SCREEN_H * 0.35,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 20,
  },

  btnContainer: {
    gap: 16,
  },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#F56E0F',
    height: 60,
    borderRadius: 16,
    shadowColor: '#F56E0F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 17, fontWeight: '800', letterSpacing: 0.4 },

  btnSecondary: {
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFAFA',
  },
  btnSecondaryText: { color: '#1A1A2E', fontSize: 16, fontWeight: '800' },

  /* Footer */
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 32,
  },
  footerText: { fontSize: 12, color: '#9CA3AF', fontWeight: '500' },
  footerBrand: { fontSize: 12, color: '#F56E0F', fontWeight: '800' },
}));
