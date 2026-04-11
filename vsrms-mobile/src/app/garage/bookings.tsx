import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';

export default function BookingManagementScreen() {
  const router = useRouter();
  const { theme } = useUnistyles();

  const bookings = [
    {
      id: 'b1',
      customer: 'John Perera',
      vehicle: 'Honda Civic (CBA-1234)',
      service: 'Full Service & Oil Change',
      time: 'Today, 10:00 AM',
      status: 'Pending' },
    {
      id: 'b2',
      customer: 'Saman Silva',
      vehicle: 'Toyota Prius (CAA-9876)',
      service: 'Brake Inspection',
      time: 'Today, 02:30 PM',
      status: 'Pending' },
  ];

  return (
    <ScreenWrapper>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Management</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.tabHeader}>
          <View style={styles.tabActive}><Text style={styles.tabActiveText}>Incoming (2)</Text></View>
          <View style={styles.tabInactive}><Text style={styles.tabInactiveText}>Scheduled</Text></View>
        </View>

        {bookings.map((b) => (
          <View key={b.id} style={styles.bookingCard}>
            <View style={styles.cardHeader}>
              <View style={styles.customerBox}>
                <View style={styles.avatar}><Text style={styles.avatarText}>{b.customer[0]}</Text></View>
                <View>
                  <Text style={styles.customerName}>{b.customer}</Text>
                  <Text style={styles.vehicleText}>{b.vehicle}</Text>
                </View>
              </View>
              <View style={styles.statusBadge}><Text style={styles.statusText}>{b.status}</Text></View>
            </View>

            <View style={styles.serviceBox}>
              <Ionicons name="construct-outline" size={16} color={theme.colors.muted} />
              <Text style={styles.serviceText}>{b.service}</Text>
            </View>
            
            <View style={styles.timeBox}>
              <Ionicons name="time-outline" size={16} color={theme.colors.brand} />
              <Text style={styles.timeText}>{b.time}</Text>
            </View>

            <View style={styles.footerRow}>
              <TouchableOpacity style={styles.rejectBtn}>
                <Text style={styles.rejectText}>Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.acceptBtn}>
                <Text style={styles.acceptText}>Accept Booking</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.text },
  backBtn: { 
    width: 40, height: 40, borderRadius: 20, 
    alignItems: 'center', justifyContent: 'center', 
    backgroundColor: theme.colors.background 
  },

  scroll: { padding: theme.spacing.md, paddingBottom: 100 },
  
  tabHeader: { 
    flexDirection: 'row', 
    backgroundColor: theme.colors.border, 
    borderRadius: 10, 
    padding: 4, 
    marginBottom: 20 
  },
  tabActive: { 
    flex: 1, 
    backgroundColor: theme.colors.surface, 
    paddingVertical: 10, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  tabActiveText: { fontWeight: '800', color: theme.colors.text, fontSize: 13 },
  tabInactive: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabInactiveText: { fontWeight: '600', color: theme.colors.muted, fontSize: 13 },

  bookingCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md 
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  customerBox: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  avatar: { 
    width: 40, height: 40, borderRadius: 20, 
    backgroundColor: theme.colors.brandSoft, 
    alignItems: 'center', justifyContent: 'center' 
  },
  avatarText: { color: theme.colors.brand, fontWeight: '800', fontSize: 16 },
  customerName: { fontSize: 16, fontWeight: '800', color: theme.colors.text },
  vehicleText: { fontSize: 12, color: theme.colors.muted, fontWeight: '600' },
  statusBadge: { 
    backgroundColor: theme.colors.warningBackground, 
    paddingHorizontal: 10, paddingVertical: 4, 
    borderRadius: 20, alignSelf: 'flex-start' 
  },
  statusText: { fontSize: 11, fontWeight: '800', color: theme.colors.warningText },

  serviceBox: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 8 },
  serviceText: { fontSize: 14, color: theme.colors.text, fontWeight: '600' },
  timeBox: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 20 },
  timeText: { fontSize: 14, color: theme.colors.brand, fontWeight: '700' },

  footerRow: { flexDirection: 'row', gap: 12 },
  rejectBtn: { 
    flex: 1, paddingVertical: 12, 
    borderRadius: 10, borderWidth: 1, 
    borderColor: theme.colors.border, 
    alignItems: 'center' 
  },
  rejectText: { fontWeight: '700', color: theme.colors.text, fontSize: 13 },
  acceptBtn: { 
    flex: 2, paddingVertical: 12, 
    borderRadius: 10, 
    backgroundColor: theme.colors.brand, 
    alignItems: 'center' 
  },
  acceptText: { fontWeight: '800', color: theme.colors.background, fontSize: 13 }
}));
