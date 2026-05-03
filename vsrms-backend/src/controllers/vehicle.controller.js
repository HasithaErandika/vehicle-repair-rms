'use strict';



const Vehicle = require('../models/Vehicle');
const { AppError } = require('../middleware/errorHandler');
const { uploadToR2 } = require('../utils/r2.util');


const paginate = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, parseInt(query.limit) || 20);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};


// GET /api/v1/vehicles  — list owner's vehicles 

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

// GET /api/v1/vehicles/:id

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


// POST /api/v1/vehicles/:id/image

const uploadVehicleImage = async (req, res, next) => {
  try {
    //  Make sure Multer actually received a file 

    if (!req.file) {
      throw new AppError('No image file provided. Send the file in a "image" form field.', 400);
    }

    //  Look up the vehicle and verify ownership 

    const vehicle = await Vehicle.findOne({ _id: req.params.id, deletedAt: null });
    if (!vehicle) throw new AppError('Vehicle not found', 404);

    // Security check: only the owner can upload a photo for their vehicle.
    if (vehicle.ownerId.toString() !== req.user._id.toString()) {
      throw new AppError('Forbidden — you do not own this vehicle', 403);
    }

    // Build a unique file path (key) inside the R2 bucket

    const key = `vehicles/${vehicle._id}/${Date.now()}-${req.file.originalname}`;

    //  Upload the raw bytes (Buffer) to Cloudflare R2 

    const imageUrl = await uploadToR2({
      buffer: req.file.buffer,
      mimeType: req.file.mimetype,
      key,
    });

    // Persist the public URL in MongoDB

    vehicle.imageUrl = imageUrl;
    await vehicle.save();

    // Send the URL back to the mobile app 
    res.json({ imageUrl: vehicle.imageUrl });
  } catch (err) {

    next(err);
  }
};


module.exports = { getVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle, uploadVehicleImage };
