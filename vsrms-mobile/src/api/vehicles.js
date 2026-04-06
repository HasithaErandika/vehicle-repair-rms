import api from './axios';

export const getMyVehicles      = (params)       => api.get('/vehicles', { params });
export const getVehicle         = (id)           => api.get(`/vehicles/${id}`);
export const createVehicle      = (data)         => api.post('/vehicles', data);
export const updateVehicle      = (id, data)     => api.put(`/vehicles/${id}`, data);
export const deleteVehicle      = (id)           => api.delete(`/vehicles/${id}`);
export const uploadVehicleImage = (id, formData) =>
  api.post(`/vehicles/${id}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
