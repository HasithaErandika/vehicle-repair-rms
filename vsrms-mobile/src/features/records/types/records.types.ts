export interface ServiceRecord {
  _id: string;
  id?: string;
  vehicleId: string;
  appointmentId?: string;
  serviceDate: string;
  workDone: string;
  partsReplaced?: string[];
  totalCost: number;
  mileageAtService?: number;
  technicianName?: string;
  documents?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRecordPayload {
  vehicleId: string;
  appointmentId?: string;
  serviceDate: string;
  workDone: string;
  partsReplaced?: string[];
  totalCost: number;
  mileageAtService?: number;
  technicianName?: string;
  documents?: string[];
}

/**
 * Allowed fields for PUT /api/v1/records/:id
 * Matches backend's `allowed` array in updateRecord controller.
 */
export interface UpdateRecordPayload {
  serviceDate?: string;
  workDone?: string;
  partsReplaced?: string[];
  totalCost?: number;
  mileageAtService?: number;
  technicianName?: string;
}
