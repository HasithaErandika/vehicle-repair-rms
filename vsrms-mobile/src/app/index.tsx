import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Car, Wrench, ShieldCheck, MapPin } from 'lucide-react-native';
import { Colors, Spacing, CustomBorders, Shadows } from '../constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.light.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HERO GRAPHIC (SVG instead of Image) ── */}
        <View style={styles.heroContainer}>
          <View style={styles.heroCircleLarger}>
             <View style={styles.heroCircleSmaller}>
                <Car size={64} color={Colors.light.primary} strokeWidth={1.5} />
                <View style={styles.wrenchBadge}>
                  <Wrench size={16} color={Colors.light.surface} strokeWidth={2.5} />
                </View>
             </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          {/* ── BADGE ── */}
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>Sri Lanka's #1 Vehicle App</Text>
          </View>

          {/* ── HEADLINE ── */}
          <View style={styles.headlineBlock}>
            <Text style={styles.h1}>Your Vehicle.</Text>
            <Text style={styles.h1Orange}>Fully Managed.</Text>
            <Text style={styles.sub}>
              Book garages, track repairs, and get smart maintenance reminders — all from your phone.
            </Text>
          </View>

          {/* ── STATS / FEATURES ── */}
          <View style={styles.statsRow}>
            {[
              { value: '500+', label: 'Garages', icon: MapPin },
              { value: '12K+', label: 'Vehicles', icon: Car },
              { value: 'Secured', label: 'By Asgardeo', icon: ShieldCheck },
            ].map((s, i) => (
              <React.Fragment key={s.label}>
                <View style={styles.statCell}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <s.icon size={18} color={Colors.light.primary} style={{ marginRight: 6 }} />
                    <Text style={styles.statValue}>{s.value}</Text>
                  </View>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
                {i < 2 && <View style={styles.statSep} />}
              </React.Fragment>
            ))}
          </View>

          {/* ── BUTTONS ── */}
          <View style={styles.btnGroup}>
            <TouchableOpacity
              style={styles.btnPrimary}
              activeOpacity={0.85}
              onPress={() => router.push('/auth/register' as any)}
            >
              <Text style={styles.btnPrimaryText}>Get Started Free</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnSecondary}
              activeOpacity={0.85}
              onPress={() => router.push('/auth/login' as any)}
            >
              <Text style={styles.btnSecondaryText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.light.background },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.five },

  /* Hero SVG Graphic */
  heroContainer: {
    width: '100%',
    height: 260,
    marginTop: Spacing.six,
    marginBottom: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center' },
  heroCircleLarger: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.light.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center' },
  heroCircleSmaller: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md },
  wrenchBadge: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: Colors.light.primary,
    padding: 8,
    borderRadius: CustomBorders.radius.full,
    borderWidth: 3,
    borderColor: Colors.light.surface },

  /* Content */
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start' },

  /* Badge */
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.light.primaryMuted,
    paddingHorizontal: Spacing.two,
    paddingVertical: 10,
    borderRadius: CustomBorders.radius.full,
    marginBottom: Spacing.four,
    marginHorizontal: Spacing.four,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.1)',
    gap: Spacing.one },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.primary },
  badgeText: {
    color: Colors.light.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5 },

  /* Headline */
  headlineBlock: {
    marginBottom: Spacing.four,
    paddingHorizontal: Spacing.four },
  h1: {
    fontSize: 42,
    fontWeight: '900',
    color: Colors.light.text,
    letterSpacing: -1,
    lineHeight: 48 },
  h1Orange: {
    fontSize: 42,
    fontWeight: '900',
    color: Colors.light.primary,
    letterSpacing: -1,
    lineHeight: 48,
    marginBottom: Spacing.two },
  sub: {
    fontSize: 15,
    color: Colors.light.textMuted,
    lineHeight: 24,
    fontWeight: '500',
    paddingRight: Spacing.three },

  /* Stats */
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surface,
    borderRadius: CustomBorders.radius.lg,
    paddingVertical: Spacing.four,
    marginBottom: Spacing.five,
    marginHorizontal: Spacing.four,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.md },
  statCell: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.one },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.light.text,
    letterSpacing: -0.5 },
  statLabel: {
    fontSize: 11,
    color: Colors.light.textMuted,
    fontWeight: '700',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5 },
  statSep: {
    width: 1,
    marginVertical: Spacing.two,
    backgroundColor: Colors.light.border },

  /* Buttons */
  btnGroup: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.four },
  btnPrimary: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 18,
    borderRadius: CustomBorders.radius.lg,
    alignItems: 'center',
    ...Shadows.lg,
    shadowColor: Colors.light.primary },
  btnPrimaryText: {
    color: Colors.light.surface,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5 },
  btnSecondary: {
    backgroundColor: Colors.light.surface,
    paddingVertical: 18,
    borderRadius: CustomBorders.radius.lg,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.light.border },
  btnSecondaryText: {
    color: Colors.light.text,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5 } });
