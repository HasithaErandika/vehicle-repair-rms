import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { StyleSheet } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useMyAppointments } from '../queries/queries';
import { AppointmentCard } from '../components/AppointmentCard';
import { Button } from '@/components/ui/Button';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { Appointment } from '../types/appointments.types';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type TabKey = 'upcoming' | 'past';
const TAB_STATUS: Record<TabKey, string> = {
  upcoming: 'pending,confirmed,in_progress',
  past: 'completed,cancelled',
};

export function AppointmentListScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>('upcoming');
  const { data, isLoading, isError, refetch } = useMyAppointments(TAB_STATUS[tab]);

  return (
    <ScreenWrapper bg="#1A1A2E">
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />

      {/* ── DARK TOP SECTION ── */}
      <View style={styles.topSection}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerSub}>Tracking</Text>
            <Text style={styles.headerTitle}>My Schedule</Text>
          </View>
        </View>

        {/* Custom Segmented Control */}
        <View style={styles.tabContainer}>
          {(['upcoming', 'past'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              style={[styles.tab, tab === t && styles.activeTab]}
            >
              <Text style={[styles.tabText, tab === t && styles.activeTabText]}>
                {t === 'upcoming' ? 'Upcoming' : 'Past'}
              </Text>
              {tab === t && <View style={styles.activeLine} />}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.decCircle1} />
        <View style={styles.decCircle2} />
      </View>

      {/* ── WHITE CARD SECTION ── */}
      <View style={[styles.mainCard, { overflow: 'hidden' }]}>
        {isLoading && !data ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#F56E0F" />
            <Text style={styles.loadingText}>Loading your plans...</Text>
          </View>
        ) : isError ? (
          <ErrorScreen onRetry={refetch} variant="inline" />
        ) : (
          <FlashList
            data={(data || []) as Appointment[]}
            renderItem={({ item }) => <AppointmentCard appointment={item as Appointment} />}
            // @ts-expect-error - FlashList requires estimatedItemSize dynamically
            estimatedItemSize={160}
            onRefresh={refetch}
            refreshing={isLoading}
            keyExtractor={(a: Appointment) => a._id || a.id || Math.random().toString()}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<EmptyState message={tab === 'upcoming' ? 'No upcoming appointments.' : 'No past appointments.'} />}
          />
        )}
      </View>

      {/* FAB - Book Appointment */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push('/customer/workshops' as any)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  topSection: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: 16,
    paddingBottom: 60,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#1A1A2E'
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 10, marginBottom: 24, marginTop: 12 },
  headerSub: {
    fontSize: theme.fonts.sizes.caption,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  headerTitle: {
    fontSize: theme.fonts.sizes.pageTitle,
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: -0.5,
    marginTop: 4
  },

  tabContainer: { flexDirection: 'row', gap: 24, zIndex: 10 },
  tab: { paddingVertical: 8, position: 'relative' },
  tabText: { fontSize: 14, color: 'rgba(255,255,255,0.5)', fontWeight: '700' },
  activeTabText: { color: '#FFFFFF' },
  activeLine: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, backgroundColor: '#F56E0F', borderRadius: 2 },
  activeTab: {},

  decCircle1: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(245,110,15,0.12)', top: -30, right: -20 },
  decCircle2: { position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(245,110,15,0.06)', bottom: 10, right: 90 },

  mainCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: theme.spacing.cardOverlap,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 16
  },

  loaderContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 13, color: theme.colors.muted, fontWeight: '600' },

  list: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: 24,
    paddingBottom: 130
  },

  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F56E0F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F56E0F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 8,
    zIndex: 999,
  },
}));
