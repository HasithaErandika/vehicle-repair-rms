import { useQuery } from '@tanstack/react-query';
import { authKeys } from './auth.keys';
import { getMe, listUsers, getAdminLogs } from '../api/auth.api';

export function useMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn:  getMe,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUsers(params?: Record<string, any>) {
  return useQuery({
    queryKey: [...authKeys.users(), params],
    queryFn:  () => listUsers(params),
    staleTime: 0,
  });
}

export function useAdminLogs(limit: number = 10) {
  return useQuery({
    queryKey: [...authKeys.all(), 'adminLogs', limit],
    queryFn: () => getAdminLogs(limit),
    refetchInterval: 30000, // Refetch every 30 seconds for "real-time" feel
  });
}

