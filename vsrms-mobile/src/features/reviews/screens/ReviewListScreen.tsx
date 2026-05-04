import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMyReviews } from '../queries/queries';
import { useUpdateReview, useDeleteReview } from '../queries/mutations';
import { ReviewCard } from '../components/ReviewCard';
import { ReviewFormModal } from '../components/ReviewFormModal';
import { ReviewFilterBar, ReviewSortOption } from '../components/ReviewFilterBar';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { VehicleSkeleton } from '@/components/feedback/Skeleton';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { FlashList } from '@shopify/flash-list';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { EmptyState } from '@/components/ui/EmptyState';
import { Review } from '../types/reviews.types';

export function ReviewListScreen() {
  const router = useRouter();
  const { theme } = useUnistyles();
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
  if (isError) return <ErrorScreen onRetry={refetch} />;

  return (
    <ScreenWrapper bg="#1A1A2E">
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />

      {/* ── DARK TOP SECTION ── */}
      <View style={styles.topSection}>
        <View style={styles.headerTextRow}>
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => router.back()} 
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Reviews</Text>
          <View style={{ width: 44 }} /> 
        </View>

        {/* Decorative Circles */}
        <View style={styles.decCircle1} />
        <View style={styles.decCircle2} />
      </View>

      {/* ── WHITE LIST SECTION ── */}
      <View style={styles.mainCard}>
        <View style={styles.filterContainer}>
          <ReviewFilterBar
            activeSort={activeSort}
            onSortChange={setActiveSort}
            total={data?.length}
          />
        </View>

        <FlashList<Review>
          data={data || []}
          renderItem={({ item }) => (
            <ReviewCard
              review={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          keyExtractor={(r) => r.id || (r as any)._id}
          onRefresh={refetch}
          refreshing={isLoading}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={{ marginTop: 60 }}>
              <EmptyState message="You haven't written any reviews yet." />
            </View>
          }
        />
      </View>

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
  topSection: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 68,
    position: 'relative',
    overflow: 'hidden',
  },
  headerTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
    marginTop: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  decCircle1: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(245,110,15,0.13)',
    top: -25,
    right: -25,
  },
  decCircle2: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(245,110,15,0.08)',
    bottom: 10,
    right: 90,
  },
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
    elevation: 16,
    overflow: 'hidden',
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  list: {
    padding: theme.spacing.md,
    paddingBottom: 40,
  },
}));
