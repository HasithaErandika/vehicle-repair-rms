export interface Vehicle {
  _id: string;
  id?: string;
  make: string;
  model: string;
  year: number;
  engineCapacity?: number;
  transmission?: string;
  fuelType?: string;
  color?: string;
  plateNumber: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
