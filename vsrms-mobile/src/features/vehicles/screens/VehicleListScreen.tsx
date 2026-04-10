import React from 'react';
import { useVehicles } from '../queries/queries';
import { VehicleCard } from '../components/VehicleCard';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { VehicleSkeleton } from '@/components/feedback/Skeleton';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { FlashList } from '@shopify/flash-list';
import { StyleSheet } from 'react-native-unistyles';
import { EmptyState } from '@/components/ui/EmptyState';
import { Vehicle } from '../types/vehicles.types';

export function VehicleListScreen() {
  const { data, isLoading, isError, refetch } = useVehicles();

  if (isLoading) return <VehicleSkeleton />;       
  if (isError)   return <ErrorScreen onRetry={refetch} />;

  return (
    <ScreenWrapper>
      <FlashList<Vehicle>                               
        data={data || []}
        renderItem={({ item }) => <VehicleCard vehicle={item} />}
        estimatedItemSize={88}                 
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
  list: { padding: theme.spacing.md },
}));
