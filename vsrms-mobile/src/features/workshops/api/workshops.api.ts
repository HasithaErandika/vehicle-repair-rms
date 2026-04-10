import client from '@/services/http.client';
import { Workshop } from '../types/workshops.types';

export const fetchWorkshops = async (params?: Record<string, any>): Promise<Workshop[]> => {
  const { data } = await client.get('/workshops', { params });
  return data.data || data;
};

export const fetchNearbyWorkshops = async (params?: Record<string, any>): Promise<Workshop[]> => {
  const { data } = await client.get('/workshops/nearby', { params });
  return data.data || data;
};

export const fetchWorkshop = async (id: string): Promise<Workshop> => {
  const { data } = await client.get(`/workshops/${id}`);
  return data.data || data;
};
