import client from '@/services/http.client';
import { Vehicle } from '../types/vehicles.types';

export const fetchVehicles = async (): Promise<Vehicle[]> => {
  const { data } = await client.get('/vehicles');
  return data.data || data;
};

export const fetchVehicle = async (id: string): Promise<Vehicle> => {
  const { data } = await client.get(`/vehicles/${id}`);
  return data.data || data;
};

export const createVehicle = async (vehicle: Partial<Vehicle>): Promise<Vehicle> => {
  const { data } = await client.post('/vehicles', vehicle);
  return data.data || data;
};

export const updateVehicle = async (id: string, vehicle: Partial<Vehicle>): Promise<Vehicle> => {
  const { data } = await client.put(`/vehicles/${id}`, vehicle);
  return data.data || data;
}

export const deleteVehicle = async (id: string): Promise<void> => {
  await client.delete(`/vehicles/${id}`);
}
