import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter, Href } from 'expo-router';
import { Car, ChevronRight, Calendar, Settings } from 'lucide-react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { ScreenWrapper } from '@/components/layout/ScreenWrapper';

export default function DashboardScreen() {
  const router = useRouter();
  const { theme } = useUnistyles();

  const handleLogout = () => {
    router.replace('/auth/login' as Href<string>);
  };

  return (
    <ScreenWrapper>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.userName}>Seneja Thehansi</Text>
        </View>
        <TouchableOpacity style={styles.avatarBox} onPress={handleLogout} activeOpacity={0.7}>
          <Text style={styles.avatarText}>ST</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* STATS ROW */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
                <Car size={18} color={theme.colors.brand} />
            </View>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Vehicles</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, styles.statIconBoxSuccess]}>
                <Calendar size={18} color={theme.colors.successText} />
            </View>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>Active Appt.</Text>
          </View>
        </View>

        {/* RECENT VEHICLES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Vehicles</Text>
            <TouchableOpacity onPress={() => router.push('/tabs/vehicles' as Href<string>)}>
              <Text style={styles.linkText}>View All</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => router.push('/tabs/vehicles' as Href<string>)}
          >
            <View style={styles.cardRow}>
              <View style={styles.iconBox}>
                <Car size={24} color={theme.colors.text} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>Honda Civic 2020</Text>
                <Text style={styles.cardSubtitle}>CBA-1234 • Last Serviced: Oct 12, 2024</Text>
              </View>
              <ChevronRight size={20} color={theme.colors.muted} />
            </View>
          </TouchableOpacity>
        </View>

        {/* ACTIVE APPOINTMENTS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            <TouchableOpacity onPress={() => router.push('/tabs/schedule' as Href<string>)}>
              <Text style={styles.linkText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.apptCard}>
            <View style={styles.apptHeader}>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Confirmed</Text>
              </View>
              <Text style={styles.apptDate}>Tomorrow, 10:00 AM</Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.apptTitle}>Full Service & Oil Change</Text>
            <Text style={styles.apptSub}>For Honda Civic (CBA-1234)</Text>
            <View style={styles.garageBox}>
              <Settings size={16} color={theme.colors.muted} style={styles.garageIcon} />
              <View>
                <Text style={styles.garageName}>AutoCare Garage Colombo</Text>
                <Text style={styles.garageAddress}>123 Main St, Colombo 03</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTextContainer: { flex: 1 },
  greeting: { 
    fontSize: theme.fonts.sizes.xs, 
    color: theme.colors.muted, 
    fontWeight: '600', 
    marginBottom: 2 
  },
  userName: { 
    fontSize: theme.fonts.sizes.xl, 
    color: theme.colors.text, 
    fontWeight: '800', 
    letterSpacing: -0.3 
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.brandSoft,
    borderWidth: 1,
    borderColor: 'rgba(245, 110, 15, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { 
    fontSize: theme.fonts.sizes.md, 
    fontWeight: '800', 
    color: theme.colors.brand 
  },
  scroll: {
    padding: theme.spacing.md,
    paddingBottom: 100,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 2,
  },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: theme.radii.sm,
    backgroundColor: theme.colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  statIconBoxSuccess: {
    backgroundColor: theme.colors.successBackground,
  },
  statValue: { 
    fontSize: theme.fonts.sizes.xxxl, 
    fontWeight: '900', 
    color: theme.colors.text, 
    marginBottom: 4 
  },
  statLabel: { 
    fontSize: theme.fonts.sizes.xs, 
    color: theme.colors.muted, 
    fontWeight: '600', 
    textTransform: 'uppercase' 
  },
  section: { 
    marginBottom: theme.spacing.xl 
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: { 
    fontSize: theme.fonts.sizes.lg, 
    fontWeight: '800', 
    color: theme.colors.text 
  },
  linkText: { 
    fontSize: theme.fonts.sizes.sm, 
    fontWeight: '700', 
    color: theme.colors.brand 
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: theme.radii.sm,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  cardInfo: { flex: 1 },
  cardTitle: { 
    fontSize: theme.fonts.sizes.md, 
    fontWeight: '700', 
    color: theme.colors.text, 
    marginBottom: 4 
  },
  cardSubtitle: { 
    fontSize: theme.fonts.sizes.sm, 
    color: theme.colors.muted, 
    fontWeight: '500' 
  },
  apptCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.brand,
    elevation: 2,
  },
  apptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.successBackground,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radii.full,
    gap: 6,
  },
  statusDot: { 
    width: 6, 
    height: 6, 
    borderRadius: theme.radii.full, 
    backgroundColor: theme.colors.successText 
  },
  statusText: { 
    fontSize: theme.fonts.sizes.xs, 
    fontWeight: '700', 
    color: theme.colors.successText 
  },
  apptDate: { 
    fontSize: theme.fonts.sizes.sm, 
    fontWeight: '700', 
    color: theme.colors.text 
  },
  divider: { 
    height: 1, 
    backgroundColor: theme.colors.border, 
    marginVertical: theme.spacing.sm 
  },
  apptTitle: { 
    fontSize: theme.fonts.sizes.md, 
    fontWeight: '800', 
    color: theme.colors.text, 
    marginBottom: 4 
  },
  apptSub: { 
    fontSize: theme.fonts.sizes.sm, 
    color: theme.colors.muted, 
    fontWeight: '500', 
    marginBottom: theme.spacing.sm 
  },
  garageBox: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.md,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  garageIcon: {
    marginRight: theme.spacing.sm,
    marginTop: 2,
  },
  garageName: { 
    fontSize: theme.fonts.sizes.sm, 
    fontWeight: '700', 
    color: theme.colors.text, 
    marginBottom: 2 
  },
  garageAddress: { 
    fontSize: theme.fonts.sizes.sm, 
    color: theme.colors.muted 
  },
}));
