'use strict';

const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema(
  {
    name:   { type: String, required: true, trim: true },
    location: {
      type:        { type: String, enum: ['Point'], required: true, default: 'Point' },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    address:         { type: String, required: true, trim: true },
    district:        { type: String, required: true, trim: true },
    servicesOffered: [{ type: String }],
    contactNumber:   { type: String, required: true, trim: true },
    imageUrl:        { type: String },
    averageRating:   { type: Number, default: 0, min: 0, max: 5 },
    totalReviews:    { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

workshopSchema.index({ location: '2dsphere' });
workshopSchema.index({ district: 1 });
workshopSchema.index({ averageRating: -1 });

module.exports = mongoose.model('Workshop', workshopSchema);
