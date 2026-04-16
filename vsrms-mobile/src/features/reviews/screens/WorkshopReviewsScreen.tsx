import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useUnistyles } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useWorkshopReviews } from '../queries/queries';
import { ReviewCard } from '../components/ReviewCard';
import { ReviewFilterBar, ReviewSortOption } from '../components/ReviewFilterBar';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';

export function WorkshopReviewsScreen() {
  const { workshopId, name } = useLocalSearchParams<{ workshopId: string; name?: string }>();
  const router = useRouter();
  const { theme } = useUnistyles();
  const [activeSort, setActiveSort] = useState<ReviewSortOption>('newest');

  const { 
    data: reviews, 
    isLoading, 
    isError, 
    refetch,
    isInitialLoading 
  } = useWorkshopReviews(workshopId ?? '', { sort: activeSort });

  if (isInitialLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.brand} />
      </View>
    );
  }

  if (isError) {
    return <ErrorScreen onRetry={refetch} />;
  }

  return (
    <ScreenWrapper bg="#FFFFFF">
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {name ? `${name} Reviews` : 'Workshop Reviews'}
        </Text>
      </View>

      <ReviewFilterBar 
        activeSort={activeSort} 
        onSortChange={setActiveSort} 
        total={reviews?.length} 
      />

      <FlashList
        data={reviews}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ReviewCard review={item} />
          </View>
        )}
        keyExtractor={(item) => item.id}
        estimatedItemSize={120}
        contentContainerStyle={styles.listContent}
        onRefresh={refetch}
        refreshing={isLoading}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbox-outline" size={48} color={theme.colors.border} />
            <Text style={[styles.emptyText, { color: theme.colors.muted }]}>
              No reviews found for this workshop yet.
            </Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 16,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  cardWrapper: {
    marginBottom: 16,
  },
  emptyContainer: {
    paddingTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
