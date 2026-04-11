import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';

const APPOINTMENTS = [
  { id: 1, vehicle: 'Honda Insight', owner: 'Amila Perera', time: '10:30 AM', service: 'Hybrid System Check', status: 'New' },
  { id: 2, vehicle: 'Toyota Vitz', owner: 'Kamani Silva', time: '11:45 AM', service: 'General Service', status: 'New' },
  { id: 3, vehicle: 'Suzuki Wagon R', owner: 'Nuwan Perera', time: '01:30 PM', service: 'Wheel Alignment', status: 'Confirmed' },
];

export default function StaffAppointmentsScreen() {
  const { theme } = useUnistyles();

  return (
    <ScreenWrapper>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Incoming Appts</Text>
        <Text style={styles.apptsCount}>{APPOINTMENTS.length} Total</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {APPOINTMENTS.map(a => (
          <View key={a.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.timeBox}>
                <Text style={styles.timeText}>{a.time}</Text>
              </View>
              <View style={[styles.badge, a.status === 'New' ? styles.badgeNew : styles.badgeConfirmed]}>
                <Text style={[styles.badgeText, a.status === 'New' ? styles.textNew : styles.textConfirmed]}>{a.status}</Text>
              </View>
            </View>

            <Text style={styles.vehicleName}>{a.vehicle}</Text>
            <Text style={styles.serviceName}>{a.service}</Text>
            
            <View style={styles.divider} />
            
            <View style={styles.footer}>
              <View style={styles.ownerInfo}>
                <View style={styles.avatarMini}>
                  <Text style={styles.avatarMiniText}>{a.owner[0]}</Text>
                </View>
                <Text style={styles.ownerName}>{a.owner}</Text>
              </View>
              <TouchableOpacity style={styles.acceptBtn}>
                <Text style={styles.acceptBtnText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  headerTitle: { fontSize: 24, fontWeight: '900', color: theme.colors.text, letterSpacing: -0.5 },
  apptsCount: { fontSize: 13, color: theme.colors.muted, fontWeight: '700' },

  scroll: { padding: theme.spacing.md, paddingBottom: 120 },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 2,
    shadowColor: theme.colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  timeBox: { backgroundColor: theme.colors.background, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  timeText: { fontSize: 12, fontWeight: '800', color: theme.colors.text },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeNew: { backgroundColor: theme.colors.brandSoft },
  badgeConfirmed: { backgroundColor: theme.colors.successBackground },
  badgeText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  textNew: { color: theme.colors.brand },
  textConfirmed: { color: theme.colors.successText },

  vehicleName: { fontSize: 18, fontWeight: '800', color: theme.colors.text, marginBottom: 4 },
  serviceName: { fontSize: 14, color: theme.colors.muted, fontWeight: '600', marginBottom: 16 },
  
  divider: { height: 1, backgroundColor: theme.colors.border, marginBottom: 16 },
  
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ownerInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatarMini: { width: 28, height: 28, borderRadius: 14, backgroundColor: theme.colors.border, alignItems: 'center', justifyContent: 'center' },
  avatarMiniText: { fontSize: 12, fontWeight: '800', color: theme.colors.text },
  ownerName: { fontSize: 14, fontWeight: '700', color: theme.colors.text },
  
  acceptBtn: { backgroundColor: theme.colors.brand, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  acceptBtnText: { color: theme.colors.surface, fontSize: 13, fontWeight: '800' }
}));
