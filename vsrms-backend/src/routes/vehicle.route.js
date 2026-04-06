'use strict';

const express = require('express');
const router  = express.Router();

const { protect }    = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/roles');
const {
  validateCreateVehicle,
  validateUpdateVehicle,
} = require('../middleware/validate');

const {
  getVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  uploadVehicleImage,
  upload,
} = require('../controllers/vehicle.controller');

// All vehicle routes require authentication
router.use(protect);

router.get('/',    getVehicles);
router.post('/',   validateCreateVehicle, createVehicle);
router.get('/:id',    getVehicle);
router.put('/:id',    validateUpdateVehicle, updateVehicle);
router.delete('/:id', deleteVehicle);
router.post('/:id/image', upload.single('image'), uploadVehicleImage);

module.exports = router;
