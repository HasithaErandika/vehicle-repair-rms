export interface Review {
  id: string;
  _id?: string;
  workshopId: string;
  userId: string | { id: string; _id?: string; fullName?: string; email: string };
  rating: number;
  reviewText?: string;
  appointmentId?: string;
  createdAt?: string;
  updatedAt?: string;
}
