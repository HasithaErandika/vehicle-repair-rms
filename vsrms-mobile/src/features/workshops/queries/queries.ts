import { useQuery } from '@tanstack/react-query';
import { workshopKeys } from './workshops.keys';
import { fetchWorkshops, fetchNearbyWorkshops, fetchWorkshop } from '../api/workshops.api';

export function useWorkshops(params?: Record<string, any>) {
  return useQuery({
    queryKey: [...workshopKeys.lists(), params],
    queryFn:  () => fetchWorkshops(params),
    staleTime: 5 * 60 * 1000, 
  });
}

export function useNearbyWorkshops(params?: Record<string, any>) {
  return useQuery({
    queryKey: [...workshopKeys.nearby(), params],
    queryFn:  () => fetchNearbyWorkshops(params),
    staleTime: 5 * 60 * 1000, 
  });
}

export function useWorkshop(id: string) {
  return useQuery({
    queryKey: workshopKeys.detail(id),
    queryFn:  () => fetchWorkshop(id),
    staleTime: 5 * 60 * 1000,
  });
}
