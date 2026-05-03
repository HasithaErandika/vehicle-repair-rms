export interface Vehicle {
  _id: string;
  id?: string;
  ownerId: string;
  registrationNo: string;
  make: string;
  model: string;
  year: number;
  vehicleType: 'car' | 'motorcycle' | 'tuk' | 'van' | 'suv' | 'truck' | 'bus' | 'other';
  mileage?: number;
  imageUrl?: string;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVehiclePayload {
  registrationNo: string;
  make: string;
  model: string;
  year: number;
  vehicleType: 'car' | 'motorcycle' | 'tuk' | 'van' | 'suv' | 'truck' | 'bus' | 'other';
  mileage?: number;
}
