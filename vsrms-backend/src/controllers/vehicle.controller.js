'use strict';

const multer           = require('multer');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const Vehicle          = require('../models/Vehicle');
const { r2Client, R2_BUCKET, R2_PUBLIC_URL } = require('../config/r2');
const { AppError }     = require('../middleware/errorHandler');

// ── Multer setup ─────────────────────────────────────────────────────────────
const storage = multer.memoryStorage();
const upload  = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
      return cb(new AppError('Only JPEG and PNG files are allowed', 400));
    }
    cb(null, true);
  },
});

// ── Pagination helper ─────────────────────────────────────────────────────────
const paginate = (query) => {
  const page  = Math.max(1, parseInt(query.page)  || 1);
  const limit = Math.min(100, parseInt(query.limit) || 20);
  const skip  = (page - 1) * limit;
  return { page, limit, skip };
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/vehicles  — list owner's vehicles (soft-deleted excluded)
// ─────────────────────────────────────────────────────────────────────────────
const getVehicles = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req.query);
    const filter = { ownerId: req.user._id, deletedAt: null };

    const [data, total] = await Promise.all([
      Vehicle.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Vehicle.countDocuments(filter),
    ]);
    res.json({ data, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/vehicles/:id
// ─────────────────────────────────────────────────────────────────────────────
const getVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, deletedAt: null });
    if (!vehicle) throw new AppError('Vehicle not found', 404);
    if (vehicle.ownerId.toString() !== req.user._id.toString()) {
      throw new AppError('Forbidden — you do not own this vehicle', 403);
    }
    res.json({ vehicle });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/vehicles
// ─────────────────────────────────────────────────────────────────────────────
const createVehicle = async (req, res, next) => {
  try {
    const { registrationNo, make, model, year, vehicleType, mileage } = req.body;
    const vehicle = await Vehicle.create({
      ownerId: req.user._id,
      registrationNo,
      make,
      model,
      year,
      vehicleType,
      mileage,
    });
    res.status(201).json({ vehicle });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/v1/vehicles/:id
// ─────────────────────────────────────────────────────────────────────────────
const updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, deletedAt: null });
    if (!vehicle) throw new AppError('Vehicle not found', 404);
    if (vehicle.ownerId.toString() !== req.user._id.toString()) {
      throw new AppError('Forbidden — you do not own this vehicle', 403);
    }

    const allowed = ['make', 'model', 'year', 'vehicleType', 'mileage'];
    allowed.forEach((key) => { if (req.body[key] !== undefined) vehicle[key] = req.body[key]; });

    await vehicle.save();
    res.json({ vehicle });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/v1/vehicles/:id  — soft delete
// ─────────────────────────────────────────────────────────────────────────────
const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, deletedAt: null });
    if (!vehicle) throw new AppError('Vehicle not found', 404);
    if (vehicle.ownerId.toString() !== req.user._id.toString()) {
      throw new AppError('Forbidden — you do not own this vehicle', 403);
    }
    vehicle.deletedAt = new Date();
    await vehicle.save();
    res.json({ message: 'Vehicle deleted' });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/vehicles/:id/image  — Multer + R2
// ─────────────────────────────────────────────────────────────────────────────
const uploadVehicleImage = async (req, res, next) => {
  try {
    if (!req.file) throw new AppError('No image file provided', 400);

    const vehicle = await Vehicle.findOne({ _id: req.params.id, deletedAt: null });
    if (!vehicle) throw new AppError('Vehicle not found', 404);
    if (vehicle.ownerId.toString() !== req.user._id.toString()) {
      throw new AppError('Forbidden — you do not own this vehicle', 403);
    }

    const key = `vehicles/${vehicle._id}/${Date.now()}-${req.file.originalname}`;
    await r2Client.send(new PutObjectCommand({
      Bucket:      R2_BUCKET,
      Key:         key,
      Body:        req.file.buffer,
      ContentType: req.file.mimetype,
    }));

    vehicle.imageUrl = `${R2_PUBLIC_URL}/${key}`;
    await vehicle.save();
    res.json({ imageUrl: vehicle.imageUrl });
  } catch (err) {
    next(err);
  }
};

module.exports = { getVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle, uploadVehicleImage, upload };
