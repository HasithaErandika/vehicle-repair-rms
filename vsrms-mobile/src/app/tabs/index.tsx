import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter, Href } from 'expo-router';
import { Car, ChevronRight, Calendar, Settings } from 'lucide-react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useAuth } from '@/providers/AuthProvider';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

export default function DashboardScreen() {
  const { user, mockSignIn } = useAuth();
  const router = useRouter();
  const { theme } = useUnistyles();

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const displayName = user?.fullName || 'Guest User';
  const initials = getInitials(displayName);

  return (
    <ScreenWrapper bg="#F9FAFB">
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.userName}>{displayName}</Text>
        </View>
        <TouchableOpacity style={styles.avatarBox} activeOpacity={0.7}>
          <Text style={styles.avatarText}>{initials}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* STATS ROW */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>VEHICLES</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>ACTIVE APPT.</Text>
          </View>
        </View>

        {/* MY VEHICLES */}
        <Animated.View entering={FadeInUp.delay(100)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Vehicles</Text>
            <TouchableOpacity onPress={() => router.push('/tabs/vehicles' as Href<string>)}>
              <Text style={styles.linkText}>View All</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.vehicleCard}
            activeOpacity={0.8}
            onPress={() => router.push('/tabs/vehicles' as Href<string>)}
          >
            <View style={styles.vehicleIconBox}>
              <Ionicons name="car-outline" size={24} color="#1A1A2E" />
            </View>
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleTitle}>Honda Civic 2020</Text>
              <Text style={styles.vehicleSubtitle}>CBA-1234 • Last Serviced: Oct 12, 2024</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#E5E7EB" />
          </TouchableOpacity>
        </Animated.View>

        {/* UPCOMING APPOINTMENTS */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.section}>
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
            
            <View style={styles.apptBody}>
              <Text style={styles.apptTitle}>Full Service & Oil Change</Text>
              <Text style={styles.apptSubTitle}>For Honda Civic (CBA-1234)</Text>
              
              <View style={styles.garageBox}>
                <Text style={styles.garageName}>AutoCare Garage Colombo</Text>
                <Text style={styles.garageAddress}>123 Main St, Colombo 03</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  headerTextContainer: { flex: 1 },
  greeting: { fontSize: 13, color: '#9CA3AF', fontWeight: '600' },
  userName: { fontSize: 24, color: '#1A1A2E', fontWeight: '900', letterSpacing: -0.5, marginTop: 2 },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#F56E0F',
  },
  avatarText: { fontSize: 16, fontWeight: '900', color: '#F56E0F' },
  
  scroll: { padding: 24 },
  
  statsGrid: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  statValue: { fontSize: 36, fontWeight: '900', color: '#1A1A2E' },
  statLabel: { fontSize: 10, color: '#9CA3AF', fontWeight: '800', marginTop: 4, letterSpacing: 0.5 },

  section: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#1A1A2E' },
  linkText: { fontSize: 14, fontWeight: '800', color: '#F56E0F', letterSpacing: -0.2 },

  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
  },
  vehicleIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  vehicleInfo: { flex: 1 },
  vehicleTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A2E' },
  vehicleSubtitle: { fontSize: 12, color: '#9CA3AF', fontWeight: '600', marginTop: 2 },

  apptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderLeftWidth: 6,
    borderLeftColor: '#F56E0F',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    padding: 20,
  },
  apptHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  statusText: { fontSize: 12, fontWeight: '800', color: '#10B981' },
  apptDate: { fontSize: 13, fontWeight: '800', color: '#1A1A2E' },
  
  apptBody: { },
  apptTitle: { fontSize: 18, fontWeight: '900', color: '#1A1A2E', marginBottom: 4 },
  apptSubTitle: { fontSize: 13, color: '#9CA3AF', fontWeight: '600', marginBottom: 16 },
  
  garageBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  garageName: { fontSize: 14, fontWeight: '800', color: '#1A1A2E' },
  garageAddress: { fontSize: 12, color: '#9CA3AF', fontWeight: '500', marginTop: 2 },
  
  bottomSpacer: { height: 100 }
}));
