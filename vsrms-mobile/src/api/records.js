import api from './axios';

export const getRecordsByVehicle = (vehicleId, params) =>
  api.get(`/records/vehicle/${vehicleId}`, { params });
export const getRecord    = (id)         => api.get(`/records/${id}`);
export const createRecord = (data)       => api.post('/records', data);
export const updateRecord = (id, data)   => api.put(`/records/${id}`, data);
export const deleteRecord = (id)         => api.delete(`/records/${id}`);
