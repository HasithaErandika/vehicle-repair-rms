'use strict';

const express = require('express');
const router  = express.Router();

const { protect }     = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/roles');
const { upload }      = require('../middleware/upload.middleware');
const {
  validateCreateWorkshop,
  validateUpdateWorkshop,
} = require('../middleware/validate');

const {
  getWorkshops,
  getNearbyWorkshops,
  getMyWorkshops,
  getWorkshopById,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  uploadWorkshopImage,
  getWorkshopTechnicians,
  addTechnician,
  removeTechnician,
} = require('../controllers/workshop.controller');

// ── Public routes ─────────────────────────────────────────────────────────────
router.get('/',       getWorkshops);
router.get('/nearby', getNearbyWorkshops); // MUST be before /:id

// ── Owner: their own workshops (MUST be before /:id) ─────────────────────────
router.get('/mine', protect, requireRole('workshop_owner', 'admin'), getMyWorkshops);

// ── Public workshop detail ────────────────────────────────────────────────────
router.get('/:id', getWorkshopById);

// ── Create — workshop_owner or admin ─────────────────────────────────────────
router.post('/', protect, requireRole('workshop_owner', 'admin'), validateCreateWorkshop, createWorkshop);

// ── Update — owner of that workshop or admin ──────────────────────────────────
router.put('/:id', protect, requireRole('workshop_owner', 'admin'), validateUpdateWorkshop, updateWorkshop);

// ── Deactivate — admin only (soft-delete) ────────────────────────────────────
router.delete('/:id', protect, requireRole('admin'), deleteWorkshop);

// ── Image upload — owner or admin ─────────────────────────────────────────────
router.post('/:id/image', protect, requireRole('workshop_owner', 'admin'), upload.single('image'), uploadWorkshopImage);

// ── Technician management — owner only (admin can view) ──────────────────────
router.get('/:id/technicians',             protect, requireRole('workshop_owner', 'admin'), getWorkshopTechnicians);
router.post('/:id/technicians',            protect, requireRole('workshop_owner'), addTechnician);
router.delete('/:id/technicians/:userId',  protect, requireRole('workshop_owner'), removeTechnician);

module.exports = router;
