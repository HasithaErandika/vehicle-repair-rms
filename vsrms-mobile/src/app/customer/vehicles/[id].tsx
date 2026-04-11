import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { VehicleDetailScreen } from '@/features/vehicles/screens/VehicleDetailScreen';

export default function VehicleDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  if (!id) return null;
  
  return <VehicleDetailScreen id={id} />;
}
