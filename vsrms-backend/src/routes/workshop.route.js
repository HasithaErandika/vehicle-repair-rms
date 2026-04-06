'use strict';

const express = require('express');
const router  = express.Router();

const { protect }     = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/roles');
const {
  validateCreateWorkshop,
  validateUpdateWorkshop,
} = require('../middleware/validate');

const {
  getWorkshops,
  getNearbyWorkshops,
  getWorkshopById,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  uploadWorkshopImage,
  upload,
} = require('../controllers/workshop.controller');

// Public routes
router.get('/',        getWorkshops);
router.get('/nearby',  getNearbyWorkshops);   // MUST be before /:id
router.get('/:id',     getWorkshopById);

// Admin only
router.post('/',   protect, requireRole('admin'), validateCreateWorkshop, createWorkshop);
router.put('/:id', protect, requireRole('admin'), validateUpdateWorkshop, updateWorkshop);
router.delete('/:id', protect, requireRole('admin'), deleteWorkshop);
router.post('/:id/image', protect, requireRole('admin'), upload.single('image'), uploadWorkshopImage);

module.exports = router;
