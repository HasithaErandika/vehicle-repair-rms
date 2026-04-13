import client from '@/services/http.client';
import { Workshop, CreateWorkshopPayload, AddTechnicianPayload } from '../types/workshops.types';
import { User } from '@/features/auth/types/auth.types';

export const fetchWorkshops = async (params?: Record<string, any>): Promise<Workshop[]> => {
  const { data } = await client.get('/workshops', { params });
  return data.data || data;
};

export const fetchNearbyWorkshops = async (params?: Record<string, any>): Promise<Workshop[]> => {
  const { data } = await client.get('/workshops/nearby', { params });
  return data.data || data;
};

export const fetchMyWorkshops = async (params?: Record<string, any>): Promise<Workshop[]> => {
  const { data } = await client.get('/workshops/mine', { params });
  return data.data || data;
};

export const fetchWorkshop = async (id: string): Promise<Workshop> => {
  const { data } = await client.get(`/workshops/${id}`);
  return data.workshop || data;
};

export const createWorkshop = async (payload: CreateWorkshopPayload): Promise<Workshop> => {
  const { data } = await client.post('/workshops', payload);
  return data.workshop || data;
};

export const updateWorkshop = async (id: string, payload: Partial<CreateWorkshopPayload>): Promise<Workshop> => {
  const { data } = await client.put(`/workshops/${id}`, payload);
  return data.workshop || data;
};

export const deactivateWorkshop = async (id: string): Promise<void> => {
  await client.delete(`/workshops/${id}`);
};

export const uploadWorkshopImage = async (workshopId: string, imageUri: string): Promise<{ imageUrl: string }> => {
  const filename = imageUri.split('/').pop() ?? 'workshop.jpg';
  const ext = /\.(\w+)$/.exec(filename)?.[1] ?? 'jpg';
  const formData = new FormData();
  formData.append('image', { uri: imageUri, name: filename, type: `image/${ext}` } as any);
  const { data } = await client.post(`/workshops/${workshopId}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const fetchWorkshopTechnicians = async (workshopId: string): Promise<User[]> => {
  const { data } = await client.get(`/workshops/${workshopId}/technicians`);
  return data.data || data;
};

export const addTechnicianToWorkshop = async (workshopId: string, payload: AddTechnicianPayload): Promise<User> => {
  const { data } = await client.post(`/workshops/${workshopId}/technicians`, payload);
  return data.user || data;
};

export const removeTechnicianFromWorkshop = async (workshopId: string, userId: string): Promise<void> => {
  await client.delete(`/workshops/${workshopId}/technicians/${userId}`);
};
