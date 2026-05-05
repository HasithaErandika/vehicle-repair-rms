import client from '@/services/http.client';
import { ServiceRecord, UpdateRecordPayload } from '../types/records.types';

export const fetchRecordsByVehicle = async (vehicleId: string, params?: Record<string, any>): Promise<ServiceRecord[]> => {
  const { data } = await client.get(`/records/vehicle/${vehicleId}`, { params });
  return data.data || data;
};

export const fetchMyRecords = async (): Promise<ServiceRecord[]> => {
  const { data } = await client.get('/records/mine');
  return data.data || data;
};

export const fetchRecord = async (id: string): Promise<ServiceRecord> => {
  const { data } = await client.get(`/records/${id}`);
  return data.record || data;
};

export const createRecord = async (payload: Partial<ServiceRecord>): Promise<ServiceRecord> => {
  const { data } = await client.post('/records', payload);
  return data.record || data;
};

/**
 * PUT /api/v1/records/:id
 * Allowed fields: serviceDate, workDone, partsReplaced, totalCost, mileageAtService, technicianName
 * Role: workshop_staff | workshop_owner | admin
 */
export const updateRecord = async (id: string, payload: UpdateRecordPayload): Promise<ServiceRecord> => {
  const { data } = await client.put(`/records/${id}`, payload);
  return data.record || data;
};

/**
 * DELETE /api/v1/records/:id
 * Role: workshop_owner (own workshop only) | admin
 */
export const deleteRecord = async (id: string): Promise<{ message: string }> => {
  const { data } = await client.delete(`/records/${id}`);
  return data;
};

export const fetchWorkshopRecords = async (workshopId: string, params?: Record<string, any>): Promise<ServiceRecord[]> => {
  const { data } = await client.get(`/records/workshop/${workshopId}`, { params });
  return data.data || data;
};
