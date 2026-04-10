export interface Review {
  _id: string;
  workshopId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
}
