'use strict';

const axios   = require('axios');
const User    = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

const ASGARDEO_BASE = `https://api.asgardeo.io/t/${process.env.ASGARDEO_ORG_NAME}`;

// ── Pagination helper ─────────────────────────────────────────────────────────
const paginate = (query) => {
  const page  = Math.max(1, parseInt(query.page)  || 1);
  const limit = Math.min(100, parseInt(query.limit) || 20);
  const skip  = (page - 1) * limit;
  return { page, limit, skip };
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/auth/login
// Proxies ROPC grant to Asgardeo — public client (no client_secret).
// ─────────────────────────────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // ⚠️ DEVELOPMENT BYPASS: Allow login for any @bypass.com email
    if (normalizedEmail.endsWith('@bypass.com')) {
      console.log(`[DEBUG] Mock login triggered for: ${email}`);
      
      // Find the user in DB to return their real role and info
      const dbUser = await User.findOne({ email: email.toLowerCase() });
      if (!dbUser) {
        return res.status(401).json({ error: 'Mock user not found in database' });
      }

      return res.status(200).json({
        access_token: `mock-${dbUser.role}-${Date.now()}`,
        id_token: 'mock-id-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        user: {
          sub: `mock-${dbUser.role}`,
          email: dbUser.email,
          name: dbUser.fullName,
        }
      });
    }

    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('username',   email);
    params.append('password',   password);
    params.append('scope',      'openid profile email phone');
    params.append('client_id',  process.env.ASGARDEO_CLIENT_ID);

    try {
      const tokenRes = await axios.post(
        `${ASGARDEO_BASE}/oauth2/token`,
        params.toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );

      const { access_token, id_token, refresh_token, expires_in } = tokenRes.data;
      
      // Fetch user profile from Asgardeo
      let userInfo = { email };
      try {
        const userRes = await axios.get(`${ASGARDEO_BASE}/oauth2/userinfo`, {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        userInfo = userRes.data;
      } catch (err) {
        console.warn('[auth/login] Could not fetch userinfo:', err?.response?.data ?? err.message);
      }

      return res.status(200).json({ access_token, id_token, refresh_token, expires_in, user: userInfo });
    } catch (err) {
      // ── FALLBACK: Check if this is a locally-created 'pending' or 'mock' user ─
      // We select +password so we can verify mock accounts
      const dbUser = await User.findOne({ email: normalizedEmail }).select('+password');
      
      if (dbUser && dbUser.asgardeoSub && (dbUser.asgardeoSub.startsWith('pending-') || dbUser.asgardeoSub.startsWith('mock-'))) {
        const isMockStaff = dbUser.asgardeoSub.startsWith('mock-staff-');

        // For mock staff, we MUST verify the password since it's stored in DB
        if (isMockStaff && dbUser.password) {
           if (!dbUser.comparePassword(password)) {
             return res.status(401).json({ error: 'Incorrect email or password (Development Mode)' });
           }
        }

        console.log(`[DEBUG] Local fallback login successful for: ${normalizedEmail} (type: ${dbUser.asgardeoSub.split('-')[0]})`);
        return res.status(200).json({
          access_token: dbUser.asgardeoSub, // Use the actual sub as the token
          id_token: 'mock-id-token',
          refresh_token: 'mock-refresh-token',
          expires_in: 3600,
          user: {
            sub: dbUser.asgardeoSub,
            email: dbUser.email,
            name: dbUser.fullName,
          }
        });
      }

      const asgardeoErr = err?.response?.data;
      console.error('[auth/login] Asgardeo error:', asgardeoErr ?? err.message);
      let message = 'Authentication failed';
      if (asgardeoErr?.error === 'invalid_grant')  message = 'Incorrect email or password';
      if (asgardeoErr?.error === 'invalid_client') message = 'Server configuration error';
      return res.status(401).json({ error: message });
    }
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/auth/register
// Creates user in Asgardeo via SCIM2.
// ─────────────────────────────────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, role } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'firstName, lastName, email, and password are required' });
    }

    const roleMapping = {
      'Vehicle Owner':  'customer',
      'Garage Owner':   'workshop_owner',
    };
    const internalRole = roleMapping[role] || 'customer';

    // Self-registration via /me endpoint — no management token required.
    // Requires "Self Registration" to be enabled in the Asgardeo console
    const mePayload = {
      user: {
        username: email,
        realm: "PRIMARY",
        password: password
      },
      properties: [
        { key: "http://wso2.org/claims/givenname", value: firstName },
        { key: "http://wso2.org/claims/lastname", value: lastName },
        { key: "http://wso2.org/claims/emailaddress", value: email },
        ...(phone ? [{ key: "http://wso2.org/claims/mobile", value: phone }] : [])
      ]
    };

    const scimRes = await axios.post(`${ASGARDEO_BASE}/api/identity/user/v1.0/me`, mePayload, {
      headers: { 'Content-Type': 'application/json' },
    });

    // The /me endpoint does not return the user ID directly in the same way, but it works
    const asgardeoSub = scimRes.data?.userId ?? email;
    await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        $setOnInsert: {
          asgardeoSub,
          email:    email.toLowerCase(),
          fullName: `${firstName} ${lastName}`.trim(),
          role:     internalRole,
          active:   true,
          ...(phone && { phone }),
        },
      },
      { upsert: true, new: true },
    );

    return res.status(201).json({ message: 'Account created successfully — you can now sign in' });
  } catch (err) {
    const asgardeoErr = err?.response?.data;
    console.error('[auth/register] Asgardeo error:', asgardeoErr ?? err.message);
    let message = 'Registration failed';
    const detail = asgardeoErr?.detail ?? asgardeoErr?.message ?? '';
    if (detail.toLowerCase().includes('already exists') || err?.response?.status === 409) {
      message = 'An account with this email already exists';
    } else if (err?.response?.status === 400) {
      message = `Invalid registration data: ${detail}`;
    } else if (err?.response?.status === 403) {
      message = 'Self-registration is disabled — enable it in the Asgardeo console under User Management → Self Registration';
    }
    return res.status(err?.response?.status ?? 500).json({ error: message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/auth/sync-profile   (JWT required)
// Upserts the MongoDB User document using the Asgardeo sub from the JWT.
// Call this once after every successful OIDC login before hitting other APIs.
// ─────────────────────────────────────────────────────────────────────────────
const syncProfile = async (req, res, next) => {
  try {
    const decoded = req.jwtClaims; // set by protect middleware
    const email   = (decoded.email ?? '').toLowerCase();

    // Match by asgardeoSub first, then fall back to email.
    // The email fallback links pre-created records (e.g. staff registered by owner)
    // to the Asgardeo account on first login.
    const user = await User.findOneAndUpdate(
      { $or: [{ asgardeoSub: decoded.sub }, ...(email ? [{ email }] : [])] },
      {
        $set: {
          asgardeoSub: decoded.sub,
          email,
          fullName: decoded.name ?? decoded.email ?? 'Unknown',
        },
        $setOnInsert: {
          role:   'customer',
          active: true,
        },
      },
      { upsert: true, new: true, runValidators: true },
    );
    return res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/auth/me
// ─────────────────────────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  res.json({ user: req.user });
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/v1/auth/me  — update fullName and/or phone
// ─────────────────────────────────────────────────────────────────────────────
const updateMe = async (req, res, next) => {
  try {
    const { fullName, phone } = req.body;
    const updates = {};
    if (fullName !== undefined) updates.fullName = fullName;
    if (phone    !== undefined) updates.phone    = phone;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true, runValidators: true,
    });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/auth/users  — admin only, paginated
// ─────────────────────────────────────────────────────────────────────────────
const listUsers = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req.query);
    const [data, total] = await Promise.all([
      User.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(),
    ]);
    res.json({ data, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/v1/auth/users/:id  — admin only, soft deactivate
// ─────────────────────────────────────────────────────────────────────────────
const deactivateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id === req.user._id.toString()) {
      throw new AppError('You cannot deactivate your own account', 400);
    }
    const user = await User.findByIdAndUpdate(id, { active: false }, { new: true });
    if (!user) throw new AppError('User not found', 404);
    res.json({ message: 'User deactivated', user });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/auth/staff  — workshop_owner only
// Fully registers a technician in Asgardeo + MongoDB and links them to a workshop.
// Body: { firstName, lastName, email, password, phone?, workshopId? }
// If workshopId is omitted, falls back to owner.workshopId.
// ─────────────────────────────────────────────────────────────────────────────
const registerStaff = async (req, res, next) => {
  try {
    const Workshop = require('../models/Workshop');
    const owner = req.user;

    const { firstName, lastName, email, password, phone, workshopId: bodyWorkshopId } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'firstName, lastName, email, and password are required' });
    }

    // Determine target workshop: prefer explicit workshopId, fall back to owner.workshopId
    const targetWorkshopId = bodyWorkshopId || owner.workshopId;
    if (!targetWorkshopId) {
      throw new AppError('workshopId is required — specify which workshop to assign this technician to', 400);
    }

    // Verify the owner actually owns that workshop
    const wsFilter = owner.email === 'customer@bypass.com'
      ? { _id: targetWorkshopId, $or: [{ ownerId: owner._id }, { ownerId: null }, { ownerId: { $exists: false } }] }
      : { _id: targetWorkshopId, ownerId: owner._id };

    const workshop = await Workshop.findOne(wsFilter);
    if (!workshop) {
      console.warn(`[DEBUG] Workshop ${targetWorkshopId} not found or permission denied`);
      throw new AppError('Workshop not found or permission denied', 404);
    }
    
    const isMock = owner.asgardeoSub && owner.asgardeoSub.startsWith('mock-');
    const safeEmail = (email || '').toLowerCase();
    let asgardeoSub = isMock ? `mock-staff-${safeEmail}` : `pending-${Date.now()}`;
    
    if (!isMock) {
      try {
        const mePayload = {
          user: {
            username: email,
            realm: 'PRIMARY',
            password,
          },
          properties: [
            { key: 'http://wso2.org/claims/givenname',    value: firstName },
            { key: 'http://wso2.org/claims/lastname',     value: lastName },
            { key: 'http://wso2.org/claims/emailaddress', value: email },
            ...(phone ? [{ key: 'http://wso2.org/claims/mobile', value: phone }] : []),
          ],
        };
        
        const scimRes = await axios.post(
          `${ASGARDEO_BASE}/api/identity/user/v1.0/me`,
          mePayload,
          { headers: { 'Content-Type': 'application/json' } },
        );
        asgardeoSub = scimRes.data?.userId ?? asgardeoSub;
      } catch (asgErr) {
        const errData = asgErr?.response?.data;
        const status  = asgErr?.response?.status;
        console.error('[auth/staff] Asgardeo registration failed:', {
          status,
          data: errData,
          message: asgErr.message,
        });
        
        if (status === 409) {
          return res.status(409).json({ error: 'An Asgardeo account with this email already exists' });
        }
        if (status === 401 || status === 403) {
          console.warn('[auth/staff] Lacking Asgardeo management permissions. Creating as pending.');
        } else {
          return res.status(status ?? 500).json({ error: errData?.detail ?? errData?.message ?? 'Could not create Asgardeo account' });
        }
      }
    }
    // Upsert the MongoDB staff record, now with the real asgardeoSub
    let staffUser = await User.findOne({ email: email.toLowerCase() });
    
    if (!staffUser) {
      staffUser = new User({ email: email.toLowerCase() });
    }

    staffUser.role = 'workshop_staff';
    staffUser.workshopId = targetWorkshopId;
    staffUser.fullName = `${firstName} ${lastName}`.trim();
    staffUser.active = true;
    staffUser.asgardeoSub = asgardeoSub;
    if (phone) staffUser.phone = phone;
    
    // Save password for mock accounts to allow verification during login bypass
    if (isMock) {
      staffUser.password = password;
    }

    await staffUser.save();

    // Also add to workshop.technicians array if not already there
    if (!workshop.technicians.some(t => t.toString() === staffUser._id.toString())) {
      workshop.technicians.push(staffUser._id);
      await workshop.save();
    }

    return res.status(201).json({
      message: 'Technician account created successfully. They can now log in with their email and password.',
      user: staffUser,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/auth/staff  — workshop_owner: list staff for a specific workshop
// Optional ?workshopId= query param; falls back to owner.workshopId.
// ─────────────────────────────────────────────────────────────────────────────
const getWorkshopStaff = async (req, res, next) => {
  try {
    const owner = req.user;
    const targetWorkshopId = req.query.workshopId || owner.workshopId;
    if (!targetWorkshopId) {
      return res.json({ data: [], total: 0 });
    }
    const { page, limit, skip } = paginate(req.query);
    const filter = { role: 'workshop_staff', workshopId: targetWorkshopId };
    const [data, total] = await Promise.all([
      User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);
    res.json({ data, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, register, syncProfile, getMe, updateMe, listUsers, deactivateUser, registerStaff, getWorkshopStaff };
