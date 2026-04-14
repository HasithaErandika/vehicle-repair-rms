'use strict';

const express = require('express');
const router  = express.Router();

const { protect }     = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/roles');
const {
  validateCreateAppointment,
  validateUpdateAppointment,
  validateUpdateStatus,
} = require('../middleware/validate');

const {
  getMyAppointments,
  getWorkshopAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} = require('../controllers/appointment.controller');

// All appointment routes require authentication
router.use(protect);

// Specific paths must come before /:id
router.get('/mine',                                                    getMyAppointments);
router.get('/workshop-all', requireRole('workshop_owner', 'admin'),     getWorkshopAppointments); // Global view
router.get('/workshop/:workshopId', requireRole('workshop_staff', 'workshop_owner', 'admin'), getWorkshopAppointments);
router.post('/',                    validateCreateAppointment,         createAppointment);
router.get('/:id',                                                     getAppointment);
router.put('/:id',                  validateUpdateAppointment,         updateAppointment);
router.put('/:id/status',           requireRole('workshop_staff', 'workshop_owner', 'admin'), validateUpdateStatus, updateAppointmentStatus);
router.delete('/:id',                                                  deleteAppointment);

module.exports = router;
