import { useQuery } from '@tanstack/react-query';
import { workshopKeys } from './workshops.keys';
import {
  fetchWorkshops,
  fetchNearbyWorkshops,
  fetchMyWorkshops,
  fetchWorkshop,
  fetchWorkshopTechnicians,
} from '../api/workshops.api';

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
    enabled:  !!params,
  });
}

export function useMyWorkshops(params?: Record<string, any>) {
  return useQuery({
    queryKey: [...workshopKeys.mine(), params],
    queryFn:  () => fetchMyWorkshops(params),
    staleTime: 0,
  });
}

export function useWorkshop(id: string) {
  return useQuery({
    queryKey: workshopKeys.detail(id),
    queryFn:  () => fetchWorkshop(id),
    staleTime: 5 * 60 * 1000,
    enabled:  !!id,
  });
}

export function useWorkshopTechnicians(workshopId: string) {
  return useQuery({
    queryKey: workshopKeys.technicians(workshopId),
    queryFn:  () => fetchWorkshopTechnicians(workshopId),
    staleTime: 0,
    enabled:  !!workshopId,
  });
}
