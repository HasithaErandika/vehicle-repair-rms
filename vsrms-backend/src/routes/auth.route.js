'use strict';

const express  = require('express');
const router   = express.Router();

const { protect }       = require('../middleware/auth.middleware');
const { requireRole }   = require('../middleware/roles');
const { authLimiter }   = require('../middleware/rateLimiter');
const { validateUpdateProfile } = require('../middleware/validate');

const {
  login,
  register,
  syncProfile,
  getMe,
  updateMe,
  listUsers,
  deactivateUser,
} = require('../controllers/auth.controller');

// Public — rate-limited to prevent brute force
router.post('/login',    authLimiter, login);
router.post('/register', authLimiter, register);

// Upsert user record post-OIDC login (must be called once after getting token)
router.post('/sync-profile', protect, syncProfile);

// Own profile
router.get('/me',  protect, getMe);
router.put('/me',  protect, validateUpdateProfile, updateMe);

// Admin only
router.get('/users',        protect, requireRole('admin'), listUsers);
router.delete('/users/:id', protect, requireRole('admin'), deactivateUser);

module.exports = router;
