import api from './axios';

export const getWorkshops        = (params) => api.get('/workshops', { params });
export const getNearbyWorkshops  = (params) => api.get('/workshops/nearby', { params });
export const getWorkshop         = (id)     => api.get(`/workshops/${id}`);
export const createWorkshop      = (data)   => api.post('/workshops', data);
export const updateWorkshop      = (id, data) => api.put(`/workshops/${id}`, data);
export const deleteWorkshop      = (id)     => api.delete(`/workshops/${id}`);
export const uploadWorkshopImage = (id, formData) =>
  api.post(`/workshops/${id}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
