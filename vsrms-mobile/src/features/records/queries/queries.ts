import { useQuery } from '@tanstack/react-query';
import { recordKeys } from './records.keys';
import { fetchRecordsByVehicle, fetchRecord } from '../api/records.api';

export function useVehicleRecords(vehicleId: string, params?: Record<string, any>) {
  return useQuery({
    queryKey: [...recordKeys.vehicle(vehicleId), params],
    queryFn:  () => fetchRecordsByVehicle(vehicleId, params),
    staleTime: 5 * 60 * 1000, 
  });
}

export function useRecord(id: string) {
  return useQuery({
    queryKey: recordKeys.detail(id),
    queryFn:  () => fetchRecord(id),
    staleTime: 5 * 60 * 1000,
  });
}
