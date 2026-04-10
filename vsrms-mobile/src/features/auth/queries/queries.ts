import { useQuery } from '@tanstack/react-query';
import { authKeys } from './auth.keys';
import { getMe } from '../api/auth.api';

export function useMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn:  getMe,
    staleTime: 5 * 60 * 1000,
  });
}
