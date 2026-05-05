import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useMyAppointments } from '../queries/queries';
import { AppointmentCard } from '../components/AppointmentCard';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { Appointment } from '../types/appointments.types';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ConfirmModal } from '@/components/feedback/ConfirmModal';
import { useDeleteAppointment } from '../queries/mutations';
import { useToast } from '@/providers/ToastProvider';

// Type assertion for FlashList to resolve environment-specific type issues
const TypedFlashList = FlashList as any;

type TabKey = 'upcoming' | 'past';
const TAB_STATUS: Record<TabKey, string> = {
  upcoming: 'pending,confirmed,in_progress',
  past: 'completed,cancelled',
};

export function AppointmentListScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { showToast } = useToast();
  const [tab, setTab] = useState<TabKey>('upcoming');
  const { data, isLoading, isError, refetch } = useMyAppointments(TAB_STATUS[tab]);
  const { mutate: cancelAppointment } = useDeleteAppointment();

  const [cancelTarget, setCancelTarget] = useState<string | null>(null);

  const handleConfirmCancel = () => {
    if (!cancelTarget) return;
    cancelAppointment(cancelTarget, {
      onSuccess: () => {
        showToast('Appointment cancelled', 'success');
        setCancelTarget(null);
        refetch();
      },
      onError: () => {
        showToast('Failed to cancel', 'error');
      },
    });
  };

  return (
    <ScreenWrapper bg={theme.colors.text}>
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
              accessibilityRole="tab"
              accessibilityState={{ selected: tab === t }}
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
            <ActivityIndicator size="large" color={theme.colors.brand} />
            <Text style={styles.loadingText}>Loading your plans...</Text>
          </View>
        ) : isError ? (
          <ErrorScreen onRetry={() => { refetch(); }} variant="inline" />
        ) : (
          <TypedFlashList
            data={(data || []) as Appointment[]}
            renderItem={({ item }) => (
              <AppointmentCard 
                appointment={item} 
                onCancel={() => setCancelTarget((item._id || item.id) ?? null)}
                onReschedule={() => router.push(`/customer/schedule/edit/${item._id || item.id}` as any)}
              />
            )}
            estimatedItemSize={160}
            onRefresh={() => { refetch(); }}
            refreshing={isLoading}
            keyExtractor={(a) => a._id ?? a.id ?? Math.random().toString()}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<EmptyState message={tab === 'upcoming' ? 'No upcoming appointments.' : 'No past appointments.'} />}
          />
        )}
      </View>

      <ConfirmModal
        visible={!!cancelTarget}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, Cancel"
        type="danger"
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelTarget(null)}
      />

      {/* FAB - Book Appointment */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push('/customer/workshops' as any)}
        activeOpacity={0.8}
        accessibilityLabel="Book new appointment"
        accessibilityRole="button"
      >
        <Ionicons name="add" size={30} color={theme.colors.white} />
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
    backgroundColor: theme.colors.text
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 10, marginBottom: 24, marginTop: 12 },
  headerSub: {
    fontSize: theme.fonts.sizes.caption,
    color: theme.colors.whiteAlpha70,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  headerTitle: {
    fontSize: theme.fonts.sizes.pageTitle,
    color: theme.colors.white,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginTop: 4
  },

  tabContainer: { flexDirection: 'row', gap: 24, zIndex: 10 },
  tab: { paddingVertical: 8, position: 'relative' },
  tabText: { fontSize: 14, color: theme.colors.whiteAlpha70, fontWeight: '700' },
  activeTabText: { color: theme.colors.white },
  activeLine: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, backgroundColor: theme.colors.brand, borderRadius: 2 },
  activeTab: {},

  decCircle1: { zIndex: 0, position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: theme.colors.brandMuted, top: -30, right: -20 },
  decCircle2: { zIndex: 0, position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: theme.colors.brandFaint, bottom: 10, right: 90 },

  mainCard: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: theme.spacing.cardOverlap,
    flex: 1,
    shadowColor: theme.colors.black,
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
    paddingBottom: theme.spacing.listBottomPadding
  },

  fab: {
    position: 'absolute',
    bottom: theme.spacing.tabBarHeight,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.brand,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 8,
    zIndex: 999,
  },
}));
