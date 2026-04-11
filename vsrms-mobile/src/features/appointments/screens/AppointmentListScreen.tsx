import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useMyAppointments } from '../queries/queries';
import { AppointmentCard } from '../components/AppointmentCard';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { VehicleSkeleton } from '@/components/feedback/Skeleton';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { Appointment } from '../types/appointments.types';

const TABS = [
  { label: 'Upcoming', status: 'pending,confirmed,in_progress' },
  { label: 'Past',     status: 'completed,cancelled' },
] as const;

export function AppointmentListScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  // Pass status filter to backend — never filter on client
  const { data, isLoading, isError, refetch } = useMyAppointments(TABS[activeTab].status);

  if (isLoading) return <VehicleSkeleton />;
  if (isError)   return <ErrorScreen onRetry={refetch} />;

  return (
    <ScreenWrapper bg="#F9FAFB">
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Appointments</Text>
          <Text style={styles.subtitle}>{data?.length ?? 0} {TABS[activeTab].label.toLowerCase()}</Text>
        </View>
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() => router.push('/customer/schedule/book' as any)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.bookBtnText}>Book</Text>
        </TouchableOpacity>
      </View>

      {/* SEGMENTED CONTROL */}
      <View style={styles.tabsContainer}>
        <View style={styles.segmentedControl}>
          {TABS.map((tab, i) => (
            <TouchableOpacity
              key={tab.label}
              onPress={() => setActiveTab(i)}
              style={[styles.tab, activeTab === i && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlashList<Appointment>
        data={data ?? []}
        renderItem={({ item }) => <AppointmentCard appointment={item} />}
        estimatedItemSize={120}
        keyExtractor={(a) => a._id}
        onRefresh={refetch}
        refreshing={isLoading}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState message={`No ${TABS[activeTab].label.toLowerCase()} appointments.`} />
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    paddingHorizontal: 24, paddingTop: 52, paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  title: { fontSize: 28, fontWeight: '900', color: '#1A1A2E', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: '#9CA3AF', fontWeight: '600', marginTop: 2 },
  bookBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F56E0F', paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 12, gap: 4,
    shadowColor: '#F56E0F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  bookBtnText: { color: 'white', fontSize: 14, fontWeight: '800' },

  tabsContainer: { paddingHorizontal: 24, paddingBottom: 16, backgroundColor: '#FFFFFF' },
  segmentedControl: {
    flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 14, padding: 4,
  },
  tab: { flex: 1, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  tabText: { fontSize: 14, fontWeight: '700', color: '#9CA3AF' },
  tabTextActive: { color: '#1A1A2E' },

  list: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 120 },
}));
