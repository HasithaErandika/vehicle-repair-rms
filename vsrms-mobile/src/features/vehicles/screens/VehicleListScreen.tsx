import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { useVehicles } from '../queries/queries';
import { VehicleCard } from '../components/VehicleCard';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { FlashList } from '@shopify/flash-list';
import { StyleSheet } from 'react-native-unistyles';
import { EmptyState } from '@/components/ui/EmptyState';
import { Vehicle } from '../types/vehicles.types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { VehicleFormModal } from '../components/VehicleFormModal';
import Animated, { FadeInUp } from 'react-native-reanimated';

export function VehicleListScreen() {
  const { data: vehicles, isLoading, isError, refetch } = useVehicles();
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <ScreenWrapper bg="#1A1A2E">
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />

      {/* ── DARK TOP SECTION ── */}
      <View style={styles.topSection}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerSub}>Fleet Manager</Text>
            <Text style={styles.headerTitle}>My Vehicles</Text>
          </View>
          <TouchableOpacity 
            style={styles.addBtn} 
            onPress={() => setShowAddModal(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{vehicles?.length || 0}</Text>
            <Text style={styles.metricLabel}>Total Vehicles</Text>
          </View>
          <View style={styles.metricCard}>
            <Ionicons name="shield-checkmark-outline" size={24} color="#10B981" />
            <Text style={styles.metricLabel}>All Insured</Text>
          </View>
        </View>

        <View style={styles.decCircle1} />
        <View style={styles.decCircle2} />
      </View>

      {/* ── WHITE CARD SECTION ── */}
      <View style={[styles.mainCard, { overflow: 'hidden' }]}>
        {isLoading && !vehicles ? (
           <View style={styles.loaderContainer}>
             <ActivityIndicator size="large" color="#F56E0F" />
             <Text style={styles.loadingText}>Loading garage...</Text>
           </View>
        ) : isError ? (
          <ErrorScreen onRetry={refetch} variant="inline" />
        ) : (
          <FlashList<Vehicle>                               
            data={vehicles || []}
            renderItem={({ item }) => (
              <VehicleCard vehicle={item} />
            )}
            // @ts-expect-error - FlashList requires estimatedItemSize dynamically
            estimatedItemSize={120}                 
            keyExtractor={(v) => v._id || v.id!}
            onRefresh={refetch}
            refreshing={isLoading}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<EmptyState message="You haven't added any vehicles yet." />}
          />
        )}
      </View>
      <VehicleFormModal 
        visible={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  topSection: { 
    paddingHorizontal: 24, 
    paddingTop: 16, 
    paddingBottom: 68, 
    position: 'relative', 
    overflow: 'hidden' 
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 10, marginBottom: 24, marginTop: 12 },
  headerSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  headerTitle: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: -0.5,
    marginTop: 4
  },
  addBtn: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#F56E0F', alignItems: 'center', justifyContent: 'center', shadowColor: '#F56E0F', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 8 },
  
  metricsRow: { flexDirection: 'row', gap: 12, zIndex: 10 },
  metricCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', padding: 16, borderRadius: 16, borderLeftWidth: 3, borderLeftColor: '#F56E0F' },
  metricValue: { fontSize: 24, fontWeight: '900', color: '#FFFFFF' },
  metricLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginTop: 4 },

  decCircle1: { position: 'absolute', width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(245,110,15,0.15)', top: -30, right: -30 },
  decCircle2: { position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(245,110,15,0.08)', bottom: 20, right: 100 },

  mainCard: { 
    backgroundColor: '#FFFFFF', 
    borderTopLeftRadius: 32, 
    borderTopRightRadius: 32, 
    marginTop: -38, 
    flex: 1, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: -4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 20, 
    elevation: 16 
  },
  loaderContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: '#6B7280', fontWeight: '700' },
  list: { 
    paddingHorizontal: 24, 
    paddingTop: 32, 
    paddingBottom: 130 
  },
}));
