import client from '@/services/http.client';
import { Vehicle } from '../types/vehicles.types';

export const fetchVehicles = async (): Promise<Vehicle[]> => {
  const { data } = await client.get('/vehicles');
  return data.data || data;
};

export const fetchVehicle = async (id: string): Promise<Vehicle> => {
  const { data } = await client.get(`/vehicles/${id}`);
  return data.vehicle || data;
};

export const createVehicle = async (vehicle: Partial<Vehicle>): Promise<Vehicle> => {
  const { data } = await client.post('/vehicles', vehicle);
  return data.vehicle || data;
};

export const updateVehicle = async (id: string, vehicle: Partial<Vehicle>): Promise<Vehicle> => {
  const { data } = await client.put(`/vehicles/${id}`, vehicle);
  return data.vehicle || data;
}

export const deleteVehicle = async (id: string): Promise<void> => {
  await client.delete(`/vehicles/${id}`);
}

/**
 * uploadVehicleImage

 * @param id              - The MongoDB _id of the vehicle to attach the photo to
 * @param uri             - Local file URI from expo-image-picker (result.assets[0].uri)
 * @param onUploadProgress - Optional callback receiving upload percentage (0–100)
 *                           Use this to drive a progress bar in the UI.
 */
export const uploadVehicleImage = async (
  id: string,
  uri: string,
  onUploadProgress?: (percent: number) => void,
): Promise<Vehicle> => {
  //  STEP 1: Build FormData 

  const formData = new FormData();

  // Extract the filename from the URI path

  const filename = uri.split('/').pop() ?? 'vehicle.jpg';

  // Determine MIME type from the file extension

  const match = /\.(\w+)$/.exec(filename);
  let ext = match ? match[1].toLowerCase() : 'jpeg';
  if (ext === 'jpg') ext = 'jpeg';
  
  const mimeType = `image/${ext}`;

  // Append the file. React Native's FormData accepts { uri, type, name }.

  formData.append('image', { uri, type: mimeType, name: filename } as any);

  // POST to the backend with progress tracking 
  const { data } = await client.post(`/vehicles/${id}/image`, formData, {
    onUploadProgress: (event) => {
      if (onUploadProgress && event.total) {
        const percent = Math.round((event.loaded * 100) / event.total);
        onUploadProgress(percent);
      }
    },
  });


  return data.vehicle || data;
};
