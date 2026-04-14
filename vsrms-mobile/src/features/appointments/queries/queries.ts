import { useQuery } from '@tanstack/react-query';
import { appointmentKeys } from './appointments.keys';
import { fetchMyAppointments, fetchAppointment, fetchWorkshopAppointments } from '../api/appointments.api';

export function useMyAppointments(status?: string) {
  return useQuery({
    queryKey: [...appointmentKeys.mine(), status],
    queryFn: () => fetchMyAppointments(status ? { status } : undefined),
    staleTime: 0,
    refetchInterval: 5000, // Auto-refresh every 5 seconds
    refetchIntervalInBackground: true, // Keep polling even if app is not actively focused
  });
}

export function useWorkshopAppointments(workshopId?: string, status?: string) {
  return useQuery({
    queryKey: [...appointmentKeys.workshop(workshopId ?? 'all'), status],
    queryFn: () => fetchWorkshopAppointments(workshopId!, status ? { status } : undefined),
    staleTime: 0,
    enabled: !!workshopId && workshopId !== 'undefined',
    refetchInterval: 5000, 
    refetchIntervalInBackground: true,
  });
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: appointmentKeys.detail(id),
    queryFn: () => fetchAppointment(id),
    staleTime: 0,
  });
}
