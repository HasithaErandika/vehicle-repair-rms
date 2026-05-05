export type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Appointment {
  _id: string;
  id?: string;
  userId: string | { _id: string; fullName?: string; email: string };
  vehicleId: string | { _id: string; registrationNo: string; make: string; model: string };
  workshopId: string | { _id: string; name: string; address: string; servicesOffered?: string[] };
  serviceType: string;
  scheduledDate: string;
  status: AppointmentStatus;
  technicianId?: string | { _id: string; fullName?: string; email: string };
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAppointmentPayload {
  vehicleId: string;
  workshopId: string;
  serviceType: string;
  scheduledDate: string;
  notes?: string;
}
