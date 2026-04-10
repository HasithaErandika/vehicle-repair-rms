import { useQuery } from '@tanstack/react-query';
import { appointmentKeys } from './appointments.keys';
import { fetchMyAppointments, fetchAppointment } from '../api/appointments.api';

export function useMyAppointments(params?: Record<string, any>) {
  return useQuery({
    queryKey: [...appointmentKeys.mine(), params],
    queryFn:  () => fetchMyAppointments(params),
    staleTime: 5 * 60 * 1000, 
  });
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: appointmentKeys.detail(id),
    queryFn:  () => fetchAppointment(id),
    staleTime: 5 * 60 * 1000,
  });
}
