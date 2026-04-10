import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewKeys } from './reviews.keys';
import { createReview } from '../api/reviews.api';
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
