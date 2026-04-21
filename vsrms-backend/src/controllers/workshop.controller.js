'use strict';

const multer               = require('multer');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const mongoose             = require('mongoose');
const Workshop             = require('../models/Workshop');
const User                 = require('../models/User');
const { r2Client, R2_BUCKET, R2_PUBLIC_URL } = require('../config/r2');
const { AppError }         = require('../middleware/errorHandler');

// ── Multer setup ─────────────────────────────────────────────────────────────
const storage = multer.memoryStorage();
const upload  = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
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

// ── Ownership helper — checks caller owns the workshop ────────────────────────
const assertWorkshopOwner = async (workshopId, userId) => {
  const workshop = await Workshop.findById(workshopId);
  if (!workshop) throw new AppError('Workshop not found', 404);
  if (!workshop.ownerId || workshop.ownerId.toString() !== userId.toString()) {
    throw new AppError('Forbidden — you do not own this workshop', 403);
  }
  return workshop;
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/workshops  — public, paginated, optional ?district=
// Only returns active workshops.
// ─────────────────────────────────────────────────────────────────────────────
const getWorkshops = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req.query);
    const filter = { active: true };
    if (req.query.district) filter.district = req.query.district.trim();
    // Escape user input to prevent regex injection / ReDoS
    if (req.query.name) {
      const escaped = req.query.name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.name = { $regex: escaped, $options: 'i' };
    }

    const [data, total] = await Promise.all([
      Workshop.find(filter).skip(skip).limit(limit).sort({ averageRating: -1 }),
      Workshop.countDocuments(filter),
    ]);
    res.json({ data, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/workshops/nearby  — public, ?lat=&lng=&maxKm=
// ─────────────────────────────────────────────────────────────────────────────
const getNearbyWorkshops = async (req, res, next) => {
  try {
    const lat   = parseFloat(req.query.lat);
    const lng   = parseFloat(req.query.lng);
    const maxKm = parseFloat(req.query.maxKm) || 50;

    if (isNaN(lat) || isNaN(lng)) {
      throw new AppError('lat and lng query params are required', 400);
    }

    const geoQuery = { active: true };
    // Escape user input to prevent regex injection / ReDoS
    if (req.query.name) {
      const escaped = req.query.name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      geoQuery.name = { $regex: escaped, $options: 'i' };
    }

    const workshops = await Workshop.aggregate([
      {
        $geoNear: {
          near:          { type: 'Point', coordinates: [lng, lat] },
          distanceField: 'distance',
          maxDistance:   maxKm * 1000,
          spherical:     true,
          query:         geoQuery,
        },
      },
      {
        $addFields: {
          distance: { $divide: [{ $round: [{ $multiply: ['$distance', 0.01] }, 0] }, 10] },
        },
      },
      { $limit: 20 },
    ]);

    res.json({ data: workshops });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/workshops/mine  — workshop_owner: their own workshops
// MUST be registered before /:id in the route file.
// ─────────────────────────────────────────────────────────────────────────────
const getMyWorkshops = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req.query);
    
    // Bypass account can see "orphaned" workshops created during early testing
    // We check for ownerId being null, missing, or matching the current user.
    const filter = req.user.email === 'customer@bypass.com'
      ? { $or: [{ ownerId: req.user._id }, { ownerId: null }, { ownerId: { $exists: false } }] }
      : { ownerId: req.user._id };

    const [data, total] = await Promise.all([
      Workshop.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Workshop.countDocuments(filter),
    ]);
    res.json({ data, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/workshops/:id  — public
// ─────────────────────────────────────────────────────────────────────────────
const getWorkshopById = async (req, res, next) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) throw new AppError('Workshop not found', 404);
    res.json({ workshop });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/workshops  — workshop_owner or admin
// Owner: ownerId is set from JWT. Admin: ownerId omitted.
// ─────────────────────────────────────────────────────────────────────────────
const createWorkshop = async (req, res, next) => {
  try {
    const { name, location, address, district, servicesOffered, contactNumber, description } = req.body;

    const workshop = await Workshop.create({
      name,
      location: { type: 'Point', coordinates: location.coordinates },
      address,
      district,
      servicesOffered: servicesOffered || [],
      contactNumber,
      ...(description && { description }),
      // Set ownerId when created by a workshop_owner; admin leaves it null
      ownerId: req.user.role === 'workshop_owner' ? req.user._id : null,
    });

    // If the creating user is a workshop_owner and has no workshopId yet,
    // set their primary workshopId to this new workshop.
    if (req.user.role === 'workshop_owner' && !req.user.workshopId) {
      await User.findByIdAndUpdate(req.user._id, { workshopId: workshop._id });
    }

    res.status(201).json({ workshop });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/v1/workshops/:id  — owner of that workshop OR admin
// ─────────────────────────────────────────────────────────────────────────────
const updateWorkshop = async (req, res, next) => {
  try {
    let workshop;
    if (req.user.role === 'admin') {
      workshop = await Workshop.findById(req.params.id);
      if (!workshop) throw new AppError('Workshop not found', 404);
    } else {
      workshop = await assertWorkshopOwner(req.params.id, req.user._id);
    }

    const allowed = ['name', 'address', 'district', 'contactNumber', 'servicesOffered', 'location', 'description'];
    allowed.forEach((key) => { if (req.body[key] !== undefined) workshop[key] = req.body[key]; });

    await workshop.save();
    res.json({ workshop });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/v1/workshops/:id  — admin only (soft-deactivate)
// ─────────────────────────────────────────────────────────────────────────────
const deleteWorkshop = async (req, res, next) => {
  try {
    const workshop = await Workshop.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true },
    );
    if (!workshop) throw new AppError('Workshop not found', 404);
    res.json({ message: 'Workshop deactivated', workshop });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/workshops/:id/image  — owner of that workshop OR admin
// ─────────────────────────────────────────────────────────────────────────────
const uploadWorkshopImage = async (req, res, next) => {
  try {
    if (!req.file) throw new AppError('No image file provided', 400);

    let workshop;
    if (req.user.role === 'admin') {
      workshop = await Workshop.findById(req.params.id);
      if (!workshop) throw new AppError('Workshop not found', 404);
    } else {
      workshop = await assertWorkshopOwner(req.params.id, req.user._id);
    }

    const key = `workshops/${workshop._id}/${Date.now()}-${req.file.originalname}`;
    await r2Client.send(new PutObjectCommand({
      Bucket:      R2_BUCKET,
      Key:         key,
      Body:        req.file.buffer,
      ContentType: req.file.mimetype,
    }));

    workshop.imageUrl = `${R2_PUBLIC_URL}/${key}`;
    await workshop.save();
    res.json({ imageUrl: workshop.imageUrl });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/workshops/:id/technicians  — owner of that workshop OR admin
// ─────────────────────────────────────────────────────────────────────────────
const getWorkshopTechnicians = async (req, res, next) => {
  try {
    let workshop;
    if (req.user.role === 'admin') {
      workshop = await Workshop.findById(req.params.id).populate('technicians', '-__v');
      if (!workshop) throw new AppError('Workshop not found', 404);
    } else {
      workshop = await assertWorkshopOwner(req.params.id, req.user._id);
      await workshop.populate('technicians', '-__v');
    }

    res.json({ data: workshop.technicians });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/workshops/:id/technicians
// Owner pre-registers a technician (or links existing user) to this workshop.
// Body: { firstName, lastName, email, phone? }
// ─────────────────────────────────────────────────────────────────────────────
const addTechnician = async (req, res, next) => {
  try {
    const workshop = await assertWorkshopOwner(req.params.id, req.user._id);

    const { firstName, lastName, email, phone } = req.body;
    if (!firstName || !lastName || !email) {
      throw new AppError('firstName, lastName, and email are required', 400);
    }

    // Upsert a staff user record linked to this workshop.
    // If they don't have an Asgardeo account yet, they register via the normal
    // register screen — sync-profile will match by email.
    const staffUser = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        $set: {
          role:       'workshop_staff',
          workshopId: workshop._id,
          fullName:   `${firstName} ${lastName}`.trim(),
          active:     true,
          ...(phone && { phone }),
        },
        $setOnInsert: {
          email:       email.toLowerCase(),
          asgardeoSub: `pending-${Date.now()}`,
        },
      },
      { upsert: true, new: true },
    );

    // Add to workshop's technicians array (avoid duplicates)
    // Use .some() with string comparison — ObjectId objects fail reference equality checks
    if (!workshop.technicians.some(t => t.toString() === staffUser._id.toString())) {
      workshop.technicians.push(staffUser._id);
      await workshop.save();
    }

    res.status(201).json({
      message: 'Technician added. Ask them to register with this email to activate their account.',
      user: staffUser,
    });
  } catch (err) {
    if (err.code === 11000) {
      return next(new AppError('An account with this email already exists', 409));
    }
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/v1/workshops/:id/technicians/:userId  — owner of that workshop
// ─────────────────────────────────────────────────────────────────────────────
const removeTechnician = async (req, res, next) => {
  try {
    const workshop = await assertWorkshopOwner(req.params.id, req.user._id);
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError('Invalid user ID', 400);
    }

    // Remove from workshop's technicians array
    workshop.technicians = workshop.technicians.filter(t => t.toString() !== userId);
    await workshop.save();

    // Clear the technician's workshopId if it points to this workshop
    await User.updateOne(
      { _id: userId, workshopId: workshop._id },
      { $unset: { workshopId: '' } },
    );

    res.json({ message: 'Technician removed from workshop' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getWorkshops, getNearbyWorkshops, getMyWorkshops,
  getWorkshopById,
  createWorkshop, updateWorkshop, deleteWorkshop,
  uploadWorkshopImage,
  getWorkshopTechnicians, addTechnician, removeTechnician,
  upload,
};
