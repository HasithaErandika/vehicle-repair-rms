'use strict';

const express = require('express');
const router  = express.Router();

const { protect }     = require('../middleware/auth.middleware');
const {
  validateCreateReview,
  validateUpdateReview,
} = require('../middleware/validate');

const {
  getWorkshopReviews,
  getMyReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/review.controller');

// Public
router.get('/workshop/:workshopId', getWorkshopReviews);

// Protected
router.get('/mine',   protect, getMyReviews);
router.post('/',      protect, validateCreateReview, createReview);
router.get('/:id',    protect, getReview);
router.put('/:id',    protect, validateUpdateReview, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
