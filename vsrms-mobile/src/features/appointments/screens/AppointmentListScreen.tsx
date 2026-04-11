import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useMyAppointments } from '../queries/queries';
import { AppointmentCard } from '../components/AppointmentCard';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { VehicleSkeleton } from '@/components/feedback/Skeleton';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { FlashList } from '@shopify/flash-list';
import { StyleSheet } from 'react-native-unistyles';
import { EmptyState } from '@/components/ui/EmptyState';
import { Appointment } from '../types/appointments.types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export function AppointmentListScreen() {
  const { data, isLoading, isError, refetch } = useMyAppointments();
  const [activeTab, setActiveTab] = useState('Upcoming');
  const router = useRouter();

  if (isLoading) return <VehicleSkeleton />;       
  if (isError)   return <ErrorScreen onRetry={refetch} />;

  const tabs = ['Upcoming', 'Past'];

  return (
    <ScreenWrapper bg="#F9FAFB">
      <View style={styles.header}>
        <Text style={styles.title}>Appointments</Text>
        <TouchableOpacity 
          style={styles.bookBtn} 
          onPress={() => router.push('/tabs/schedule/book')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.bookBtnText}>Book</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <View style={styles.segmentedControl}>
          {tabs.map(tab => (
            <TouchableOpacity 
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlashList<Appointment>                               
        data={data || []}
        renderItem={({ item }) => <AppointmentCard appointment={item} />}
        estimatedItemSize={250}                 
        keyExtractor={(a) => a._id}
        onRefresh={refetch}
        refreshing={isLoading}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message={`No ${activeTab.toLowerCase()} appointments.`} />}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 24, 
    paddingTop: 40, 
    paddingBottom: 24,
    backgroundColor: '#FFFFFF'
  },
  title: { fontSize: 28, fontWeight: '900', color: '#1A1A2E' },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F56E0F',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 4
  },
  bookBtnText: { color: 'white', fontSize: 14, fontWeight: '800' },

  tabsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF'
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    padding: 4
  },
  tab: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    boxShadow: [{
      offsetX: 0,
      offsetY: 2,
      blurRadius: 4,
      color: 'rgba(0,0,0,0.05)',
    }],
    elevation: 2
  },
  tabText: { fontSize: 14, fontWeight: '700', color: '#9CA3AF' },
  tabTextActive: { color: '#1A1A2E' },

  list: { paddingHorizontal: 24, paddingVertical: 24, paddingBottom: 100 },
}));
