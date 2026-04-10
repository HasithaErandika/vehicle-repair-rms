'use strict';

const mongoose = require('mongoose');
const jsonFormatter = require('./plugins/jsonFormatter');

const userSchema = new mongoose.Schema(
  {
    asgardeoSub: { type: String, required: true },
    fullName:    { type: String, required: true },
    email:       { type: String, required: true, lowercase: true, trim: true },
    phone:       { type: String, trim: true },
    role:        {
      type:    String,
      enum:    ['customer', 'workshop_owner', 'workshop_staff', 'admin'],
      default: 'customer',
    },
    workshopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workshop' }, // For owners/staff
    active:     { type: Boolean, default: true },
  },
  { timestamps: true },
);

userSchema.plugin(jsonFormatter);

userSchema.index({ asgardeoSub: 1 }, { unique: true });
userSchema.index({ email: 1 },       { unique: true });

module.exports = mongoose.model('User', userSchema);
