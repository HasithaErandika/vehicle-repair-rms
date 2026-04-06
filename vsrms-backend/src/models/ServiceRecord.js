'use strict';

const mongoose = require('mongoose');

const serviceRecordSchema = new mongoose.Schema(
  {
    appointmentId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    vehicleId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    serviceDate:      { type: Date,   required: true },
    workDone:         { type: String, required: true, trim: true },
    partsReplaced:    [{ type: String }],
    totalCost:        { type: Number, required: true, min: 0 },
    mileageAtService: { type: Number, min: 0 },
    technicianName:   { type: String, trim: true },
  },
  { timestamps: true },
);

serviceRecordSchema.index({ vehicleId: 1 });
serviceRecordSchema.index({ appointmentId: 1 });

module.exports = mongoose.model('ServiceRecord', serviceRecordSchema);
