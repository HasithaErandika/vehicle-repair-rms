export interface Review {
  _id: string;
  workshopId: string;
  userId: string | { _id: string; fullName?: string; email: string };
  rating: number;
  reviewText?: string;
  appointmentId?: string;
  createdAt?: string;
  updatedAt?: string;
}
