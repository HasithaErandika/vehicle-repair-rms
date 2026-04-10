export interface ServiceRecord {
  _id: string;
  vehicleId: string;
  workshopId: string;
  serviceDate: string;
  description: string;
  cost?: number;
  partsReplaced?: string[];
  documents?: string[];
  createdAt?: string;
  updatedAt?: string;
}
