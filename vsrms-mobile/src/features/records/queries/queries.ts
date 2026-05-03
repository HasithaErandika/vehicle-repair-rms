import { useQuery } from '@tanstack/react-query';
import { recordKeys } from './records.keys';
import { fetchRecordsByVehicle, fetchRecord, fetchWorkshopRecords } from '../api/records.api';

/**
 * Fetches all service records for a vehicle.
 * Service history is historical — no real-time polling needed.
 */
export function useVehicleRecords(vehicleId: string, params?: Record<string, any>) {
  return useQuery({
    queryKey: [...recordKeys.vehicle(vehicleId), params],
    queryFn:  () => fetchRecordsByVehicle(vehicleId, params),
    enabled:  !!vehicleId,
    staleTime: 5 * 60 * 1000, // 5 minutes — historical data changes rarely
  });
}

/**
 * Fetches a single service record by ID.
 */
export function useRecord(id: string) {
  return useQuery({
    queryKey: recordKeys.detail(id),
    queryFn:  () => fetchRecord(id),
    enabled:  !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetches all records for a workshop.
 * Workshop records can update frequently as jobs are completed,
 * so we use a moderate poll interval.
 */
export function useWorkshopRecords(workshopId: string, params?: Record<string, any>) {
  return useQuery({
    queryKey: [...recordKeys.workshop(workshopId), params],
    queryFn:  () => fetchWorkshopRecords(workshopId, params),
    enabled:  !!workshopId,
    staleTime: 0,
    refetchInterval: 30_000, // 30s is reasonable for a live dashboard
  });
}

