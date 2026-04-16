import client from '@/services/http.client';
import { Review } from '../types/reviews.types';

export const fetchWorkshopReviews = async (workshopId: string, params?: Record<string, any>): Promise<Review[]> => {
  const { data } = await client.get(`/reviews/workshop/${workshopId}`, { params });
  return data.data || data;
};

export const fetchMyReviews = async (params?: Record<string, any>): Promise<Review[]> => {
  const { data } = await client.get('/reviews/mine', { params });
  return data.data || data;
};

export const createReview = async (payload: Partial<Review>): Promise<Review> => {
  const { data } = await client.post('/reviews', payload);
  return data.review || data;
};

export const updateReview = async (id: string, payload: Partial<Review>): Promise<Review> => {
  const { data } = await client.put(`/reviews/${id}`, payload);
  return data.review || data;
};

export const deleteReview = async (id: string): Promise<void> => {
  await client.delete(`/reviews/${id}`);
};
