import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAppointment } from '@/features/appointments/api/appointments.api';
import { appointmentKeys } from '@/features/appointments/queries/appointment.keys';
import { useToast } from '@/hooks';
import { handleApiError } from '@/services/error.handler';
import { Appointment } from '@/features/appointments/types/appointments.types';

export function useBookWorkshop() {
  const qc = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (payload: Partial<Appointment>) => createAppointment(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: appointmentKeys.lists() });
      showToast('Appointment booked successfully', 'success');
    },
    onError: (e) => showToast(handleApiError(e), 'error'),
  });
}
