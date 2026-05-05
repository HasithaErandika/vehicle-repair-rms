import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useVehicles } from '../queries/queries';
import { VehicleCard } from '../components/VehicleCard';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { EmptyState } from '@/components/ui/EmptyState';
import { Vehicle } from '../types/vehicles.types';
import { Ionicons } from '@expo/vector-icons';
import { VehicleFormModal } from '../components/VehicleFormModal';

// Type assertion for FlashList to resolve environment-specific type issues
const TypedFlashList = FlashList as any;

export function VehicleListScreen() {
  const { theme } = useUnistyles();
  const { data: vehicles, isLoading, isError, refetch } = useVehicles();
  const [showAddModal, setShowAddModal] = useState(false);

  const allInsured = useMemo(() => {
    if (!vehicles || vehicles.length === 0) return false;
    return vehicles.every(v => (v as any).isInsured ?? true); 
  }, [vehicles]);

  return (
    <ScreenWrapper bg={theme.colors.text}>
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
            accessibilityLabel="Add new vehicle"
            accessibilityRole="button"
          >
            <Ionicons name="add" size={24} color={theme.colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{vehicles?.length || 0}</Text>
            <Text style={styles.metricLabel}>Total Vehicles</Text>
          </View>
          <View style={styles.metricCard}>
            <Ionicons 
              name={allInsured ? "shield-checkmark" : "shield-outline"} 
              size={24} 
              color={allInsured ? theme.colors.success : theme.colors.mutedLight} 
            />
            <Text style={styles.metricLabel}>{allInsured ? "All Insured" : "Insurance Pending"}</Text>
          </View>
        </View>

        <View style={styles.decCircle1} />
        <View style={styles.decCircle2} />
      </View>

      <View style={[styles.mainCard, { overflow: 'hidden' }]}>
        {isLoading && !vehicles ? (
           <View style={styles.loaderContainer}>
             <ActivityIndicator size="large" color={theme.colors.brand} />
             <Text style={styles.loadingText}>Loading garage...</Text>
           </View>
        ) : isError ? (
          <ErrorScreen onRetry={() => { refetch(); }} variant="inline" />
        ) : (
          <TypedFlashList
            data={vehicles || []}
            renderItem={({ item }) => (
              <VehicleCard vehicle={item} />
            )}
            estimatedItemSize={120}                 
            keyExtractor={(v) => v._id ?? v.id ?? Math.random().toString()}
            onRefresh={() => { refetch(); }}
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
    paddingHorizontal: theme.spacing.screenPadding, 
    paddingTop: 16, 
    paddingBottom: 68, 
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
  addBtn: { 
    width: 48, height: 48, borderRadius: 16, 
    backgroundColor: theme.colors.brand, 
    alignItems: 'center', justifyContent: 'center', 
    shadowColor: theme.colors.brand, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 8 
  },
  
  metricsRow: { flexDirection: 'row', gap: 12, zIndex: 10 },
  metricCard: { 
    flex: 1, 
    backgroundColor: theme.colors.whiteAlpha10, 
    padding: 16, 
    borderRadius: 16, 
    borderLeftWidth: 3, 
    borderLeftColor: theme.colors.brand 
  },
  metricValue: { fontSize: 24, fontWeight: '900', color: theme.colors.white },
  metricLabel: { fontSize: 12, color: theme.colors.whiteAlpha70, fontWeight: '600', marginTop: 4 },

  decCircle1: { zIndex: 0, position: 'absolute', width: 150, height: 150, borderRadius: 75, backgroundColor: theme.colors.brandMuted, top: -30, right: -20 },
  decCircle2: { zIndex: 0, position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: theme.colors.brandFaint, bottom: 20, right: 100 },

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
  loadingText: { fontSize: 14, color: theme.colors.muted, fontWeight: '700' },
  list: { 
    paddingHorizontal: theme.spacing.screenPadding, 
    paddingTop: 32, 
    paddingBottom: theme.spacing.listBottomPadding 
  },
}));
