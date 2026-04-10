import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authKeys } from './auth.keys';
import { updateMe, syncProfile } from '../api/auth.api';
import { useToast } from '@/providers/ToastProvider';

export function useUpdateMe() {
  const qc = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: authKeys.me() });
      showToast('Profile updated', 'success');
    },
    onError:   (e: Error) => showToast(e.message, 'error'), 
  });
}

export function useSyncProfile() {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: syncProfile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
}
