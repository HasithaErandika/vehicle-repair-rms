import { useQuery } from '@tanstack/react-query';
import { vehicleKeys } from './vehicles.keys';
import { fetchVehicles, fetchVehicle } from '../api/vehicles.api';

export function useVehicles() {
  return useQuery({
    queryKey: vehicleKeys.lists(),
    queryFn:  fetchVehicles,
    staleTime: 5 * 60 * 1000, 
  });
}

export function useVehicle(id: string) {
  return useQuery({
    queryKey: vehicleKeys.detail(id),
    queryFn:  () => fetchVehicle(id),
    staleTime: 5 * 60 * 1000,
  });
}
