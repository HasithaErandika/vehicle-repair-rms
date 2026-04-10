'use strict';

const mongoose = require('mongoose');

const jsonFormatter = require('./plugins/jsonFormatter');

const reviewSchema = new mongoose.Schema(
  {
    workshopId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Workshop',    required: true },
    userId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User',        required: true },
    rating:        {
      type:     Number,
      required: true,
      min:      1,
      max:      5,
      validate: { validator: Number.isInteger, message: 'Rating must be a whole number' },
    },
    reviewText:    { type: String, trim: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  },
  { timestamps: true },
);

reviewSchema.plugin(jsonFormatter);

reviewSchema.index({ workshopId: 1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ workshopId: 1, userId: 1 }, { unique: true }); // one review per user per workshop

module.exports = mongoose.model('Review', reviewSchema);
