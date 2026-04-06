import api from './axios';

export const getWorkshopReviews = (workshopId, params) =>
  api.get(`/reviews/workshop/${workshopId}`, { params });
export const getMyReviews  = (params)       => api.get('/reviews/mine', { params });
export const getReview     = (id)           => api.get(`/reviews/${id}`);
export const createReview  = (data)         => api.post('/reviews', data);
export const updateReview  = (id, data)     => api.put(`/reviews/${id}`, data);
export const deleteReview  = (id)           => api.delete(`/reviews/${id}`);
