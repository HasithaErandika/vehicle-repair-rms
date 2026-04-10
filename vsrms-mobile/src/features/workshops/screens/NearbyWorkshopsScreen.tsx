import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { StyleSheet } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { WorkshopCard } from '../components/WorkshopCard';
import { useNearbyWorkshops } from '../queries/queries';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { VehicleSkeleton } from '@/components/feedback/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Workshop } from '../types/workshops.types';

export function NearbyWorkshopsScreen() {
  const { data, isLoading, isError, refetch } = useNearbyWorkshops();

  if (isLoading) return <VehicleSkeleton />;
  if (isError) return <ErrorScreen onRetry={refetch} />;

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Workshops Near You</Text>
        <FlashList<Workshop>
          data={data || []}
          renderItem={({ item }) => <WorkshopCard workshop={item} />}
          estimatedItemSize={220}
          onRefresh={refetch}
          refreshing={isLoading}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<EmptyState message="No workshops found nearby." />}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: { flex: 1 },
  title: { 
    fontSize: theme.fonts.sizes.xl, 
    fontWeight: '800', 
    color: theme.colors.text, 
    padding: theme.spacing.md 
  },
  list: { padding: theme.spacing.md },
}));
