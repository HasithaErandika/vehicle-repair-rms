import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recordKeys } from './records.keys';
import { createRecord, updateRecord, deleteRecord } from '../api/records.api';
import { useToast } from '@/hooks';
import { handleApiError } from '@/services/error.handler';
import { ServiceRecord, UpdateRecordPayload } from '../types/records.types';

export function useCreateRecord() {
  const qc = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (payload: Partial<ServiceRecord>) => createRecord(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: recordKeys.all() });
      // Invalidate appointments cache since status becomes 'completed'
      qc.invalidateQueries({ queryKey: ['appointments'] });
      showToast('Record added successfully', 'success');
    },
    onError: (e) => showToast(handleApiError(e), 'error'),
  });
}

/**
 * Updates a service record via PUT /api/v1/records/:id.
 * Invalidates both the specific detail cache and all list caches so
 * the detail screen and any list views stay consistent.
 */
export function useUpdateRecord(id: string) {
  const qc = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (payload: UpdateRecordPayload) => updateRecord(id, payload),
    onSuccess: (updated) => {
      // Immediately update the detail cache so the detail screen
      // reflects the new data without a refetch round-trip.
      qc.setQueryData(recordKeys.detail(id), updated);
      qc.invalidateQueries({ queryKey: recordKeys.all() });
      showToast('Record updated successfully', 'success');
    },
    onError: (e) => showToast(handleApiError(e), 'error'),
  });
}

/**
 * Deletes a service record via DELETE /api/v1/records/:id.
 * Roles: workshop_owner (own workshop) | admin
 */
export function useDeleteRecord() {
  const qc = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (id: string) => deleteRecord(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: recordKeys.all() });
      showToast('Record deleted successfully', 'success');
    },
    onError: (e) => showToast(handleApiError(e), 'error'),
  });
}
