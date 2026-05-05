import React, { useMemo } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useWorkshopAppointments } from '@/features/appointments/queries/queries';
import { useWorkshop } from '@/features/workshops/queries/queries';
import { Appointment } from '@/features/appointments/types/appointments.types';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { EmptyState } from '@/components/ui/EmptyState';

// Type assertion for FlashList to resolve environment-specific type issues
const TypedFlashList = FlashList as any;

function JobCard({ job }: { job: Appointment }) {
  const { theme } = useUnistyles();
  const customerName = job.userId && typeof job.userId === 'object' ? (job.userId as any).fullName : 'Customer';
  const vehicleName = job.vehicleId && typeof job.vehicleId === 'object' ? `${(job.vehicleId as any).make} ${(job.vehicleId as any).model}` : 'Vehicle';

  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <View style={styles.jobIcon}>
          <Ionicons name="construct-outline" size={24} color={theme.colors.brand} />
        </View>
        <View style={styles.jobMain}>
          {job.workshopId && typeof job.workshopId === 'object' && (job.workshopId as any)?.name && (
            <Text style={styles.cardWorkshopName}>{(job.workshopId as any).name}</Text>
          )}
          <Text style={styles.jobTitle}>{customerName}</Text>
          <Text style={styles.jobSub}>{vehicleName}</Text>
          <View style={styles.tagRow}>
            <View style={styles.serviceTag}>
              <Text style={styles.serviceTagText}>{job.serviceType}</Text>
            </View>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>In Progress</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function OwnerJobsScreen() {
  const { theme } = useUnistyles();
  const { workshopId: paramWorkshopId } = useLocalSearchParams<{ workshopId: string }>();
  const targetWorkshopId = useMemo(() => paramWorkshopId || 'all', [paramWorkshopId]);
  const { data: workshop } = useWorkshop(targetWorkshopId && targetWorkshopId !== 'all' ? targetWorkshopId : '');
  const { data, isLoading, isError, refetch } = useWorkshopAppointments(targetWorkshopId, 'in_progress');

  // Deduplicate by id — guards against stale cache returning same appointment twice
  const appointments = useMemo(() => {
    const seen = new Set<string>();
    return (data ?? []).filter(a => {
      const key = (a as any)._id || (a as any).id;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [data]);
  
  const workshopName = (!targetWorkshopId || targetWorkshopId === 'all') 
    ? 'All Active Jobs' 
    : (workshop && typeof workshop === 'object' ? (workshop as any).name : 'Active Jobs');

  return (
    <ScreenWrapper bg={theme.colors.text}>
      {/* ── DARK TOP SECTION ── */}
      <View style={styles.topSection}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerSub}>Operations</Text>
            <Text style={styles.headerTitle} numberOfLines={1}>{workshopName}</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="flash-outline" size={22} color={theme.colors.white} />
          </View>
        </View>

        <View style={styles.decCircle1} />
        <View style={styles.decCircle2} />
      </View>

      {/* ── WHITE CARD SECTION ── */}
      <View style={styles.mainCard}>
        {isLoading && !data ? (
          <View style={styles.centered}><ActivityIndicator size="large" color={theme.colors.brand} /></View>
        ) : isError ? (
          <ErrorScreen onRetry={() => { refetch(); }} variant="inline" />
        ) : (
          <TypedFlashList
            data={appointments as Appointment[]}
            renderItem={({ item }: any) => <JobCard job={item} />}
            estimatedItemSize={120}
            onRefresh={() => { refetch(); }}
            refreshing={isLoading}
            keyExtractor={(a: Appointment) => (a as any)._id || (a as any).id || Math.random().toString()}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<EmptyState message="No active jobs in the workshop currently." />}
          />
        )}
      </View>
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
  badge: { width: 48, height: 48, borderRadius: 14, backgroundColor: theme.colors.whiteAlpha10, alignItems: 'center', justifyContent: 'center' },

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
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { 
    paddingHorizontal: theme.spacing.screenPadding, 
    paddingTop: 24, 
    paddingBottom: theme.spacing.listBottomPadding 
  },

  card: { backgroundColor: theme.colors.background, borderRadius: 24, padding: 18, marginBottom: 16, borderWidth: 1.5, borderColor: theme.colors.borderLight, shadowColor: theme.colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  jobIcon: { width: 50, height: 50, borderRadius: 14, backgroundColor: theme.colors.warningBackground, alignItems: 'center', justifyContent: 'center' },
  cardWorkshopName: { 
    fontSize: 10, 
    fontWeight: '800', 
    color: theme.colors.warningText, 
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  jobMain: { flex: 1, paddingLeft: 4 },
  jobTitle: { fontSize: 16, fontWeight: '900', color: theme.colors.text },
  jobSub: { fontSize: 13, color: theme.colors.muted, fontWeight: '600', marginTop: 2 },
  
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  serviceTag: { backgroundColor: theme.colors.infoBackground, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  serviceTagText: { fontSize: 10, fontWeight: '800', color: theme.colors.infoText, textTransform: 'uppercase' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: theme.colors.warningBackground, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.brand },
  statusText: { fontSize: 10, fontWeight: '800', color: theme.colors.brand, textTransform: 'uppercase' },
}));
