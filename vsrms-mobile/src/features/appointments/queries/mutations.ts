import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentKeys } from './appointments.keys';
import { createAppointment, updateAppointmentStatus } from '../api/appointments.api';
import { useToast } from '@/providers/ToastProvider';

export function useCreateAppointment() {
  const qc = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: appointmentKeys.mine() });
      showToast('Appointment booked successfully!', 'success');
    },
    onError:   (e: Error) => showToast(e.message, 'error'), 
  });
}

export function useUpdateAppointmentStatus() {
  const qc = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateAppointmentStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: appointmentKeys.mine() });
      showToast('Status updated', 'success');
    },
    onError:   (e: Error) => showToast(e.message, 'error'),
  });
}
