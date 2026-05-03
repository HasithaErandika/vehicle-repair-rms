import React from 'react';
import { EditRecordScreen } from '@/features/records/screens/EditRecordScreen';

/**
 * Route: /owner/edit-record?id=<recordId>
 * Accessible to: workshop_owner | admin
 * The screen enforces server-side role checks via PUT /api/v1/records/:id
 */
export default function OwnerEditRecordRoute() {
  return <EditRecordScreen />;
}
