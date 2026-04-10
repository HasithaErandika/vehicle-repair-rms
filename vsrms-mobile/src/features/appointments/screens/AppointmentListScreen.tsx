import React from 'react';
import { useMyAppointments } from '../queries/queries';
import { AppointmentCard } from '../components/AppointmentCard';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { VehicleSkeleton } from '@/components/feedback/Skeleton';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { FlashList } from '@shopify/flash-list';
import { StyleSheet } from 'react-native-unistyles';
import { EmptyState } from '@/components/ui/EmptyState';
import { Appointment } from '../types/appointments.types';

export function AppointmentListScreen() {
  const { data, isLoading, isError, refetch } = useMyAppointments();

  if (isLoading) return <VehicleSkeleton />;       
  if (isError)   return <ErrorScreen onRetry={refetch} />;

  return (
    <ScreenWrapper>
      <FlashList<Appointment>                               
        data={data || []}
        renderItem={({ item }) => <AppointmentCard appointment={item} />}
        estimatedItemSize={88}                 
        keyExtractor={(a) => a._id}
        onRefresh={refetch}
        refreshing={isLoading}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message="No scheduled appointments." />}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  list: { padding: theme.spacing.md },
}));
