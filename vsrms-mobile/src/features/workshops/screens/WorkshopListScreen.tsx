import React from 'react';
import { useWorkshops } from '../queries/queries';
import { WorkshopCard } from '../components/WorkshopCard';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { VehicleSkeleton } from '@/components/feedback/Skeleton';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { FlashList } from '@shopify/flash-list';
import { StyleSheet } from 'react-native-unistyles';
import { EmptyState } from '@/components/ui/EmptyState';
import { Workshop } from '../types/workshops.types';

export function WorkshopListScreen() {
  const { data, isLoading, isError, refetch } = useWorkshops();

  if (isLoading) return <VehicleSkeleton />;       
  if (isError)   return <ErrorScreen onRetry={refetch} />;

  return (
    <ScreenWrapper>
      <FlashList<Workshop>                               
        data={data || []}
        renderItem={({ item }) => <WorkshopCard workshop={item} />}
        estimatedItemSize={120}                 
        keyExtractor={(w) => w._id}
        onRefresh={refetch}
        refreshing={isLoading}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message="No workshops found near you." />}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  list: { padding: theme.spacing.md },
}));
