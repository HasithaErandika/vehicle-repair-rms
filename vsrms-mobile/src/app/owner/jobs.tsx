import React, { useMemo } from 'react';
import { View, Text, ActivityIndicator, StatusBar, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useAuth } from '@/hooks';
import { useWorkshopAppointments } from '@/features/appointments/queries/queries';
import { useWorkshop } from '@/features/workshops/queries/queries';
import { Appointment } from '@/features/appointments/types/appointments.types';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { EmptyState } from '@/components/ui/EmptyState';

function JobCard({ job }: { job: Appointment }) {
  const router = useRouter();
  const customerName = job.userId && typeof job.userId === 'object' ? job.userId.fullName : 'Customer';
  const vehicleName = job.vehicleId && typeof job.vehicleId === 'object' ? `${job.vehicleId.make} ${job.vehicleId.model}` : 'Vehicle';

  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <View style={styles.jobIcon}>
          <Ionicons name="construct-outline" size={24} color="#F56E0F" />
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
    </View>
  );
}

export default function OwnerJobsScreen() {
  const router = useRouter();
  const { workshopId: paramWorkshopId } = useLocalSearchParams<{ workshopId: string }>();
  const { user } = useAuth();
  
    const targetWorkshopId = useMemo(() => paramWorkshopId || 'all', [paramWorkshopId]);
    
    const { data: workshop } = useWorkshop(targetWorkshopId && targetWorkshopId !== 'all' ? targetWorkshopId : '');
    const { data, isLoading, isError, refetch } = useWorkshopAppointments(targetWorkshopId, 'in_progress');

  // Deduplicate by id — guards against stale cache returning same appointment twice
  const appointments = useMemo(() => {
    const seen = new Set<string>();
    return (data ?? []).filter(a => {
      const key = (a as any).id || (a as any)._id;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [data]);
  
    const workshopName = (!targetWorkshopId || targetWorkshopId === 'all') 
      ? 'All Active Jobs' 
      : (workshop && typeof workshop === 'object' ? (workshop as any).name : 'Active Jobs');
  
    return (
      <ScreenWrapper bg="#1A1A2E">
        <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
  
        {/* ── DARK TOP SECTION ── */}
        <View style={styles.topSection}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerSub}>Operations</Text>
              <Text style={styles.headerTitle} numberOfLines={1}>{workshopName}</Text>
            </View>
          <View style={styles.badge}>
             <Ionicons name="flash-outline" size={22} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.decCircle1} />
        <View style={styles.decCircle2} />
      </View>

      {/* ── WHITE CARD SECTION ── */}
      <View style={styles.mainCard}>
        {isLoading && !data ? (
          <View style={styles.centered}><ActivityIndicator size="large" color="#F56E0F" /></View>
        ) : isError ? (
          <ErrorScreen onRetry={refetch} variant="inline" />
        ) : (
          <FlashList
             data={appointments as Appointment[]}
             renderItem={({ item }) => <JobCard job={item as Appointment} />}
             // @ts-expect-error - FlashList requires estimatedItemSize dynamically
             estimatedItemSize={120}
             onRefresh={refetch}
             refreshing={isLoading}
             keyExtractor={(a: Appointment) => (a as any).id || (a as any)._id || Math.random().toString()}
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
  badge: { width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },

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
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { 
    paddingHorizontal: theme.spacing.screenPadding, 
    paddingTop: 24, 
    paddingBottom: 130 
  },

  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 18, marginBottom: 16, borderWidth: 1.5, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  jobIcon: { width: 50, height: 50, borderRadius: 14, backgroundColor: '#FFF7ED', alignItems: 'center', justifyContent: 'center' },
  cardWorkshopName: { 
    fontSize: 10, 
    fontWeight: '800', 
    color: '#EA580C', 
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  jobMain: { flex: 1, paddingLeft: 4 },
  jobTitle: { fontSize: 16, fontWeight: '900', color: '#1A1A2E' },
  jobSub: { fontSize: 13, color: '#6B7280', fontWeight: '600', marginTop: 2 },
  
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  serviceTag: { backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  serviceTagText: { fontSize: 10, fontWeight: '800', color: '#2563EB', textTransform: 'uppercase' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#FFF7ED', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#F56E0F' },
  statusText: { fontSize: 10, fontWeight: '800', color: '#F56E0F', textTransform: 'uppercase' },

  completeBtn: {
    backgroundColor: '#F56E0F',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#F56E0F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  completeBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
}));
