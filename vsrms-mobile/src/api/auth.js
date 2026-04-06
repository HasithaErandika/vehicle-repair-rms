import api from './axios';

export const syncProfile    = ()         => api.post('/auth/sync-profile');
export const getMe          = ()         => api.get('/auth/me');
export const updateMe       = (data)     => api.put('/auth/me', data);
export const getUsers       = (params)   => api.get('/auth/users', { params });
export const deactivateUser = (id)       => api.delete(`/auth/users/${id}`);
