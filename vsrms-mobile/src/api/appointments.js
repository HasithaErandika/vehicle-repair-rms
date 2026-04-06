import api from './axios';

export const getMyAppointments        = (params)       => api.get('/appointments/mine', { params });
export const getAppointment           = (id)           => api.get(`/appointments/${id}`);
export const createAppointment        = (data)         => api.post('/appointments', data);
export const updateAppointment        = (id, data)     => api.put(`/appointments/${id}`, data);
export const updateAppointmentStatus  = (id, status)   => api.put(`/appointments/${id}/status`, { status });
export const deleteAppointment        = (id)           => api.delete(`/appointments/${id}`);
