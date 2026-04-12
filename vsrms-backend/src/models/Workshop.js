'use strict';

const mongoose = require('mongoose');
const jsonFormatter = require('./plugins/jsonFormatter');

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
    description:     { type: String, trim: true },
    contactNumber:   { type: String, required: true, trim: true },
    imageUrl:        { type: String },
    averageRating:   { type: Number, default: 0, min: 0, max: 5 },
    totalReviews:    { type: Number, default: 0, min: 0 },
    // Owner of this workshop (set when a workshop_owner creates it)
    ownerId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    // Technicians assigned to this workshop
    technicians:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // Admin can deactivate a workshop
    active:       { type: Boolean, default: true },
  },
  { timestamps: true },
);

workshopSchema.plugin(jsonFormatter);

workshopSchema.index({ location: '2dsphere' });
workshopSchema.index({ district: 1 });
workshopSchema.index({ averageRating: -1 });
workshopSchema.index({ ownerId: 1 });
workshopSchema.index({ active: 1 });

module.exports = mongoose.model('Workshop', workshopSchema);
