import React, { useState } from 'react';
import { useMyReviews } from '../queries/queries';
import { useUpdateReview, useDeleteReview } from '../queries/mutations';
import { ReviewCard } from '../components/ReviewCard';
import { ReviewFormModal } from '../components/ReviewFormModal';
import { ReviewFilterBar, ReviewSortOption } from '../components/ReviewFilterBar';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { VehicleSkeleton } from '@/components/feedback/Skeleton';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { FlashList } from '@shopify/flash-list';
import { StyleSheet } from 'react-native-unistyles';
import { EmptyState } from '@/components/ui/EmptyState';
import { Review } from '../types/reviews.types';

export function ReviewListScreen() {
  const [activeSort, setActiveSort] = useState<ReviewSortOption>('newest');
  const { data, isLoading, isError, refetch } = useMyReviews({ sort: activeSort });
  const { mutate: updateReview, isPending: updatingReview } = useUpdateReview();
  const { mutate: deleteReview } = useDeleteReview();

  const [editingReview, setEditingReview] = React.useState<Review | null>(null);

  const handleEdit = (review: Review) => setEditingReview(review);
  const handleDelete = (review: Review) => deleteReview(review.id);
  const handleSubmit = (rating: number, text: string) => {
    if (!editingReview) return;
    updateReview(
      { id: editingReview.id, payload: { rating, reviewText: text } },
      { onSuccess: () => setEditingReview(null) }
    );
  };

  if (isLoading && !data) return <VehicleSkeleton />;       
  if (isError)   return <ErrorScreen onRetry={refetch} />;

  return (
    <ScreenWrapper>
      <ReviewFilterBar 
        activeSort={activeSort} 
        onSortChange={setActiveSort} 
        total={data?.length} 
      />
      <FlashList<Review>                               
        data={data || []}
        renderItem={({ item }) => (
          <ReviewCard 
            review={item} 
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        estimatedItemSize={120}                 
        keyExtractor={(r) => r.id || (r as any)._id}
        onRefresh={refetch}
        refreshing={isLoading}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message="You haven't written any reviews yet." />}
      />
      <ReviewFormModal 
        visible={!!editingReview}
        onClose={() => setEditingReview(null)}
        onSubmit={handleSubmit}
        isSubmitting={updatingReview}
        initialData={editingReview}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  list: { padding: theme.spacing.md },
}));
