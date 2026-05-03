import React from 'react';
import { EditRecordScreen } from '@/features/records/screens/EditRecordScreen';

/**
 * Route: /technician/edit-record?id=<recordId>
 * Accessible to: workshop_staff | workshop_owner | admin
 * The screen enforces server-side role checks via PUT /api/v1/records/:id
 */
export default function TechnicianEditRecordRoute() {
  return <EditRecordScreen />;
}
