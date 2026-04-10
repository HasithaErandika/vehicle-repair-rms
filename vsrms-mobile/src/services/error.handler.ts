import { AxiosError } from 'axios';
import { ApiError } from '../types/api.types';

export const handleApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiError | undefined;
    return data?.message || error.message || 'An unexpected error occurred';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unknown error occurred';
};
