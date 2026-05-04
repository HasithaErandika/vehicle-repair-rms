import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleKeys } from './vehicles.keys';
import { createVehicle, updateVehicle, deleteVehicle, uploadVehicleImage } from '../api/vehicles.api';
import { useToast } from '@/providers/ToastProvider';
import { handleApiError } from '@/services/error.handler';
import { Vehicle } from '../types/vehicles.types';

export function useCreateVehicle() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: vehicleKeys.lists() });
    },
    onError: (e) => {
      // Error handling moved to component level for better UX
    },
  });
}

export function useUpdateVehicle() {
  const qc = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ id, vehicle }: { id: string; vehicle: Partial<Vehicle> }) =>
      updateVehicle(id, vehicle),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: vehicleKeys.lists() });
      qc.invalidateQueries({ queryKey: vehicleKeys.detail(data._id) });
      showToast('Vehicle updated successfully', 'success');
    },
    onError: (e) => showToast(handleApiError(e), 'error'),
  });
}

export function useDeleteVehicle() {
  const qc = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: vehicleKeys.lists() });
      showToast('Vehicle deleted successfully', 'success');
    },
    onError: (e) => showToast(handleApiError(e), 'error'),
  });
}

/**

 * @param onProgress - Optional callback (0-100) for a progress bar.
 *                     Called repeatedly as bytes are transmitted to the server.
 */
export function useUploadVehicleImage() {
  const qc = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    // mutationFn receives the variables object passed to .mutate()
    mutationFn: ({
      id,
      uri,
      onProgress,
    }: {
      id: string;
      uri: string;
      onProgress?: (percent: number) => void;  // forwarded to the API layer
    }) => uploadVehicleImage(id, uri, onProgress),

    onSuccess: (data) => {
      // Directly inject the updated vehicle (with new imageUrl) into the cache.
      // This is instant — no background re-fetch delay — fixing the "photo not
      // displayed after upload" bug (C4). We also invalidate lists so the
      // thumbnail on the VehicleCard updates on next list render.
      qc.setQueryData(vehicleKeys.detail(data._id), data);
      qc.invalidateQueries({ queryKey: vehicleKeys.lists() });
      showToast('Vehicle photo updated', 'success');
    },
    onError: (e) => showToast(handleApiError(e), 'error'),
  });
}

