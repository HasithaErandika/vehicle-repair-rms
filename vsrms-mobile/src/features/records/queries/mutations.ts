import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recordKeys } from './records.keys';
import { createRecord } from '../api/records.api';
import { useToast } from '@/hooks';
import { handleApiError } from '@/services/error.handler';
import { ServiceRecord } from '../types/records.types';

export function useCreateRecord() {
  const qc = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (payload: Partial<ServiceRecord>) => createRecord(payload),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: recordKeys.lists() });
      if (data.vehicleId) qc.invalidateQueries({ queryKey: recordKeys.vehicle(data.vehicleId) });
      showToast('Record added successfully', 'success');
    },
    onError: (e) => showToast(handleApiError(e), 'error'),
  });
}
