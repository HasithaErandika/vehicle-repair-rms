import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workshopKeys } from './workshops.keys';
import {
  createWorkshop,
  updateWorkshop,
  deactivateWorkshop,
  addTechnicianToWorkshop,
  removeTechnicianFromWorkshop,
} from '../api/workshops.api';
import { useToast } from '@/providers/ToastProvider';
import { handleApiError } from '@/services/error.handler';
import { CreateWorkshopPayload, AddTechnicianPayload } from '../types/workshops.types';

export function useCreateWorkshop() {
  const qc = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateWorkshopPayload) => createWorkshop(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: workshopKeys.lists() });
      qc.invalidateQueries({ queryKey: workshopKeys.mine() });
      showToast('Workshop created', 'success');
    },
    onError: (e: any) => showToast(handleApiError(e), 'error'),
  });
}

export function useUpdateWorkshop(workshopId: string) {
  const qc = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (payload: Partial<CreateWorkshopPayload>) => updateWorkshop(workshopId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: workshopKeys.detail(workshopId) });
      qc.invalidateQueries({ queryKey: workshopKeys.mine() });
      showToast('Workshop updated', 'success');
    },
    onError: (e: any) => showToast(handleApiError(e), 'error'),
  });
}

export function useDeactivateWorkshop() {
  const qc = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (id: string) => deactivateWorkshop(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: workshopKeys.lists() });
      qc.invalidateQueries({ queryKey: workshopKeys.mine() });
      showToast('Workshop deactivated', 'success');
    },
    onError: (e: any) => showToast(handleApiError(e), 'error'),
  });
}

export function useAddTechnician(workshopId: string) {
  const qc = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (payload: AddTechnicianPayload) => addTechnicianToWorkshop(workshopId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: workshopKeys.technicians(workshopId) });
      showToast('Technician added', 'success');
    },
    onError: (e: any) => showToast(handleApiError(e), 'error'),
  });
}

export function useRemoveTechnician(workshopId: string) {
  const qc = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (userId: string) => removeTechnicianFromWorkshop(workshopId, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: workshopKeys.technicians(workshopId) });
      showToast('Technician removed', 'success');
    },
    onError: (e: any) => showToast(handleApiError(e), 'error'),
  });
}
