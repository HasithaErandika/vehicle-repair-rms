import client from '@/services/http.client';
import { Appointment, CreateAppointmentPayload } from '../types/appointments.types';

export const fetchMyAppointments = async (params?: Record<string, any>): Promise<Appointment[]> => {
  const { data } = await client.get('/appointments/mine', { params });
  return data.data || data;
};

export const fetchWorkshopAppointments = async (workshopId?: string, params?: Record<string, any>): Promise<Appointment[]> => {
  const url = (workshopId && workshopId !== 'all') ? `/appointments/workshop/${workshopId}` : '/appointments/workshop-all';
  const { data } = await client.get(url, { params });
  return data.data || data;
};

export const fetchAppointment = async (id: string): Promise<Appointment> => {
  const { data } = await client.get(`/appointments/${id}`);
  return data.appointment || data;
};

export const createAppointment = async (payload: CreateAppointmentPayload): Promise<Appointment> => {
  const { data } = await client.post('/appointments', payload);
  return data.appointment || data;
};

export const updateAppointment = async (id: string, payload: Partial<Appointment>): Promise<Appointment> => {
  const { data } = await client.put(`/appointments/${id}`, payload);
  return data.appointment || data;
};

export const updateAppointmentStatus = async (id: string, status: string, technicianId?: string): Promise<Appointment> => {
  const { data } = await client.put(`/appointments/${id}/status`, { status, technicianId });
  return data.appointment || data;
};

export const deleteAppointment = async (id: string): Promise<void> => {
  await client.delete(`/appointments/${id}`);
};
