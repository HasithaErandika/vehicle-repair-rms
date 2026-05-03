'use strict';

const Review = require('../models/Review');
const { AppError } = require('../middleware/errorHandler');
const { recalculateRating } = require('../utils/reviewHelper');
const { paginate } = require('../utils/paginate');

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/reviews/workshop/:workshopId  — public, newest first
// ─────────────────────────────────────────────────────────────────────────────
const getWorkshopReviews = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req.query);
    const { sort } = req.query;
    const filter = { workshopId: req.params.workshopId };

    // Build sort object
    let sortObj = { createdAt: -1 }; // Default: newest
    if (sort === 'oldest') sortObj = { createdAt: 1 };
    if (sort === 'highest') sortObj = { rating: -1, createdAt: -1 };
    if (sort === 'lowest') sortObj = { rating: 1, createdAt: -1 };

    const [data, total] = await Promise.all([
      Review.find(filter).populate('userId', 'fullName').skip(skip).limit(limit).sort(sortObj),
      Review.countDocuments(filter),
    ]);
    res.json({ data, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/reviews/mine  — JWT, paginated
// ─────────────────────────────────────────────────────────────────────────────
const getMyReviews = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req.query);
    const { sort } = req.query;
    const filter = { userId: req.user._id };

    // Build sort object
    let sortObj = { createdAt: -1 }; // Default: newest
    if (sort === 'oldest') sortObj = { createdAt: 1 };
    if (sort === 'highest') sortObj = { rating: -1, createdAt: -1 };
    if (sort === 'lowest') sortObj = { rating: 1, createdAt: -1 };

    const [data, total] = await Promise.all([
      Review.find(filter).skip(skip).limit(limit).sort(sortObj),
      Review.countDocuments(filter),
    ]);
    res.json({ data, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/reviews/:id  — JWT
// ─────────────────────────────────────────────────────────────────────────────
const getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) throw new AppError('Review not found', 404);
    res.json({ review });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/reviews  — JWT, rating 1-5, recalculate averageRating
// ─────────────────────────────────────────────────────────────────────────────
const createReview = async (req, res, next) => {
  try {
    const { workshopId, rating, reviewText, appointmentId } = req.body;

    const review = await Review.create({
      workshopId,
      userId: req.user._id,
      rating,
      reviewText,
      appointmentId,
    });

    // Recalculate denormalized averageRating on the workshop
    await recalculateRating(workshopId);

    res.status(201).json({ review });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/v1/reviews/:id  — JWT, ownership enforced
// ─────────────────────────────────────────────────────────────────────────────
const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) throw new AppError('Review not found', 404);
    if (review.userId.toString() !== req.user._id.toString()) {
      throw new AppError('Forbidden — you do not own this review', 403);
    }

    if (req.body.rating !== undefined) review.rating = req.body.rating;
    if (req.body.reviewText !== undefined) review.reviewText = req.body.reviewText;

    await review.save();
    await recalculateRating(review.workshopId);

    res.json({ review });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/v1/reviews/:id  — JWT, ownership enforced
// ─────────────────────────────────────────────────────────────────────────────
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) throw new AppError('Review not found', 404);
    if (review.userId.toString() !== req.user._id.toString()) {
      throw new AppError('Forbidden — you do not own this review', 403);
    }

    const { workshopId } = review;
    await review.deleteOne();
    await recalculateRating(workshopId);

    res.json({ message: 'Review deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getWorkshopReviews, getMyReviews, getReview, createReview, updateReview, deleteReview };
