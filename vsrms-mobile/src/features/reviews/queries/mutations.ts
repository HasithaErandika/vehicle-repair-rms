import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewKeys } from './reviews.keys';
import { createReview, updateReview, deleteReview } from '../api/reviews.api';
import { useToast } from '@/providers/ToastProvider';

export function useCreateReview() {
  const qc = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: createReview,
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: reviewKeys.mine() });
      if (data.workshopId) qc.invalidateQueries({ queryKey: reviewKeys.workshop(data.workshopId) });
      showToast('Review submitted successfully!', 'success');
    },
    onError:   (e: Error) => showToast(e.message, 'error'), 
  });
}

export function useUpdateReview() {
  const qc = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string, payload: any }) => updateReview(id, payload),
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: reviewKeys.mine() });
      if (data.workshopId) qc.invalidateQueries({ queryKey: reviewKeys.workshop(data.workshopId) });
      showToast('Review updated successfully!', 'success');
    },
    onError: (e: Error) => showToast(e.message, 'error'),
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: reviewKeys.all() }); // Simplest to invalidate all for now
      showToast('Review deleted successfully!', 'success');
    },
    onError: (e: Error) => showToast(e.message, 'error'),
  });
}
