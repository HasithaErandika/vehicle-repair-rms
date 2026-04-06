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
  getAppointment,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} = require('../controllers/appointment.controller');

// All appointment routes require authentication
router.use(protect);

router.get('/mine',   getMyAppointments);
router.post('/',      validateCreateAppointment, createAppointment);
router.get('/:id',    getAppointment);
router.put('/:id',    validateUpdateAppointment, updateAppointment);
router.put('/:id/status', requireRole('staff', 'admin'), validateUpdateStatus, updateAppointmentStatus);
router.delete('/:id', deleteAppointment);

module.exports = router;
