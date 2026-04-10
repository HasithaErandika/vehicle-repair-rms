import client from '@/services/http.client';
import { Appointment } from '../types/appointments.types';

export const fetchMyAppointments = async (params?: Record<string, any>): Promise<Appointment[]> => {
  const { data } = await client.get('/appointments/mine', { params });
  return data.data || data;
};

export const fetchAppointment = async (id: string): Promise<Appointment> => {
  const { data } = await client.get(`/appointments/${id}`);
  return data.data || data;
};

export const createAppointment = async (payload: Partial<Appointment>): Promise<Appointment> => {
  const { data } = await client.post('/appointments', payload);
  return data.data || data;
};

export const updateAppointment = async (id: string, payload: Partial<Appointment>): Promise<Appointment> => {
  const { data } = await client.put(`/appointments/${id}`, payload);
  return data.data || data;
};

export const updateAppointmentStatus = async (id: string, status: string): Promise<Appointment> => {
  const { data } = await client.put(`/appointments/${id}/status`, { status });
  return data.data || data;
};
