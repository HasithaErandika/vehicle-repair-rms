'use strict';

const express = require('express');
const router  = express.Router();

const { protect }     = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/roles');
const {
  validateCreateRecord,
  validateUpdateRecord,
} = require('../middleware/validate');

const {
  getRecordsByVehicle,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
} = require('../controllers/record.controller');

// All record routes require authentication
router.use(protect);

router.get('/vehicle/:vehicleId', getRecordsByVehicle);
router.post('/',     requireRole('staff', 'admin'), validateCreateRecord, createRecord);
router.get('/:id',   getRecord);
router.put('/:id',   requireRole('staff', 'admin'), validateUpdateRecord, updateRecord);
router.delete('/:id', requireRole('admin'), deleteRecord);

module.exports = router;
