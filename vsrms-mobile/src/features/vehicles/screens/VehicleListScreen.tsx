import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useVehicles } from '../queries/queries';
import { VehicleCard } from '../components/VehicleCard';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { VehicleSkeleton } from '@/components/feedback/Skeleton';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { FlashList } from '@shopify/flash-list';
import { StyleSheet } from 'react-native-unistyles';
import { EmptyState } from '@/components/ui/EmptyState';
import { Vehicle } from '../types/vehicles.types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export function VehicleListScreen() {
  const { data, isLoading, isError, refetch } = useVehicles();
  const router = useRouter();

  if (isLoading) return <VehicleSkeleton />;       
  if (isError)   return <ErrorScreen onRetry={refetch} />;

  return (
    <ScreenWrapper bg="#F9FAFB">
      <View style={styles.header}>
        <Text style={styles.title}>My Vehicles</Text>
        <TouchableOpacity 
          style={styles.addBtn} 
          onPress={() => router.push('/tabs/vehicles/add')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlashList<Vehicle>                               
        data={data || []}
        renderItem={({ item }) => <VehicleCard vehicle={item} />}
        estimatedItemSize={160}                 
        keyExtractor={(v) => v._id || v.id!}
        onRefresh={refetch}
        refreshing={isLoading}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message="You haven't added any vehicles yet." />}
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F56E0F',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 4
  },
  addBtnText: { color: 'white', fontSize: 14, fontWeight: '800' },
  list: { paddingHorizontal: 24, paddingBottom: 100 },
}));
