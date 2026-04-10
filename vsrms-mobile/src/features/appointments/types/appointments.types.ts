export interface Appointment {
  _id: string;
  workshopId: string;
  vehicleId: string;
  date: string;
  time: string;
  serviceType: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
