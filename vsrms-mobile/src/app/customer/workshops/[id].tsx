import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { WorkshopDetailScreen } from '@/features/workshops/screens/WorkshopDetailScreen';

export default function WorkshopDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  if (!id) return null;
  
  return <WorkshopDetailScreen id={id} />;
}
