import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentKeys } from './appointments.keys';
import { createAppointment, updateAppointment, updateAppointmentStatus, deleteAppointment } from '../api/appointments.api';
import { Appointment } from '../types/appointments.types';
import { useToast } from '@/providers/ToastProvider';
import { handleApiError } from '@/services/error.handler';

export function useCreateAppointment() {
  const qc = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: appointmentKeys.all() });
      showToast('Appointment booked successfully!', 'success');
    },
    onError: (e: any) => showToast(handleApiError(e), 'error'),
  });
}

export function useUpdateAppointmentStatus() {
  const qc = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateAppointmentStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: appointmentKeys.all() });
      showToast('Status updated', 'success');
    },
    onError: (e: any) => showToast(handleApiError(e), 'error'),
  });
}

export function useDeleteAppointment() {
  const qc = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: deleteAppointment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: appointmentKeys.all() });
      showToast('Appointment cancelled', 'success');
    },
    onError: (e: any) => showToast(handleApiError(e), 'error'),
  });
}

export function useUpdateAppointment() {
  const qc = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Appointment> }) => updateAppointment(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: appointmentKeys.mine() });
      qc.invalidateQueries({ queryKey: appointmentKeys.detail(id) });
      showToast('Appointment updated successfully!', 'success');
    },
    onError: (e: any) => showToast(handleApiError(e), 'error'),
  });
}
