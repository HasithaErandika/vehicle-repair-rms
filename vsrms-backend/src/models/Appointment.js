'use strict';

const mongoose = require('mongoose');

// Forward-only state machine transitions
const VALID_TRANSITIONS = {
  pending:     ['confirmed', 'cancelled'],
  confirmed:   ['in_progress', 'completed', 'cancelled'],
  in_progress: ['completed'],
  completed:   [],
  cancelled:   [],
};

const jsonFormatter = require('./plugins/jsonFormatter');

const appointmentSchema = new mongoose.Schema(
  {
    userId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User',     required: true },
    vehicleId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle',  required: true },
    workshopId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Workshop', required: true },
    serviceType:   { type: String, required: true, trim: true },
    scheduledDate: { type: Date,   required: true },
    status:        {
      type:    String,
      enum:    ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    technicianId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String },
  },
  { timestamps: true },
);

appointmentSchema.plugin(jsonFormatter);

// Static helper for controllers — avoids importing VALID_TRANSITIONS separately
appointmentSchema.statics.isValidTransition = (from, to) =>
  !!(VALID_TRANSITIONS[from]?.includes(to));

appointmentSchema.index({ userId: 1 });
appointmentSchema.index({ workshopId: 1 });
appointmentSchema.index({ vehicleId: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ workshopId: 1, scheduledDate: 1 }); // double-booking check

module.exports = mongoose.model('Appointment', appointmentSchema);
