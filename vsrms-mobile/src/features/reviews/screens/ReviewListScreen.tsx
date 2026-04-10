import React from 'react';
import { useMyReviews } from '../queries/queries';
import { ReviewCard } from '../components/ReviewCard';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { VehicleSkeleton } from '@/components/feedback/Skeleton';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { FlashList } from '@shopify/flash-list';
import { StyleSheet } from 'react-native-unistyles';
import { EmptyState } from '@/components/ui/EmptyState';
import { Review } from '../types/reviews.types';

export function ReviewListScreen() {
  const { data, isLoading, isError, refetch } = useMyReviews();

  if (isLoading) return <VehicleSkeleton />;       
  if (isError)   return <ErrorScreen onRetry={refetch} />;

  return (
    <ScreenWrapper>
      <FlashList<Review>                               
        data={data || []}
        renderItem={({ item }) => <ReviewCard review={item} />}
        estimatedItemSize={120}                 
        keyExtractor={(r) => r._id}
        onRefresh={refetch}
        refreshing={isLoading}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message="You haven't written any reviews yet." />}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  list: { padding: theme.spacing.md },
}));
