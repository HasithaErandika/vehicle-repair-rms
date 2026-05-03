'use strict';

/**
 * VSRMS Full Seed Script
 * ──────────────────────
 * 1. Wipes ALL MongoDB collections
 * 2. Deletes & re-creates 4 Asgardeo users via SCIM
 * 3. Seeds MongoDB with realistic, cross-linked data
 *
 * Test accounts (password: Login@123456):
 *   admin@vsrms.local   – System Admin
 *   owner@vsrms.local   – Roshan Fernando  (workshop_owner)
 *   customer@vsrms.local – Amara Jayawardena (customer)
 *   tech1@vsrms.local   – Kamal Silva       (workshop_staff)
 *
 * Usage:  node seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const axios    = require('axios');

const User          = require('./src/models/User');
const Workshop      = require('./src/models/Workshop');
const Vehicle       = require('./src/models/Vehicle');
const Appointment   = require('./src/models/Appointment');
const ServiceRecord = require('./src/models/ServiceRecord');
const Review        = require('./src/models/Review');

// ── Helpers ──────────────────────────────────────────────────────────────────
const days   = (n) => 86_400_000 * n;
const past   = (n) => new Date(Date.now() - days(n));
const future = (n) => new Date(Date.now() + days(n));

const ASGARDEO_BASE = `https://api.asgardeo.io/t/${process.env.ASGARDEO_ORG_NAME}`;
const PASSWORD      = 'Login@123456';

// ── Asgardeo SCIM helpers ────────────────────────────────────────────────────
async function getManagementToken() {
  const params = new URLSearchParams({
    grant_type:    'client_credentials',
    client_id:     process.env.ASGARDEO_CLIENT_ID,
    client_secret: process.env.ASGARDEO_CLIENT_SECRET,
    scope:         'internal_user_mgt_create internal_user_mgt_list internal_user_mgt_delete internal_user_mgt_view',
  });
  const { data } = await axios.post(`${ASGARDEO_BASE}/oauth2/token`, params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return data.access_token;
}

async function deleteAsgardeoUserByEmail(token, email) {
  try {
    const filter = encodeURIComponent(`userName eq DEFAULT/${email}`);
    const { data } = await axios.get(`${ASGARDEO_BASE}/scim2/Users?filter=${filter}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    for (const u of data?.Resources ?? []) {
      console.log(`   ✕ Deleting Asgardeo user ${u.userName} (${u.id})`);
      await axios.delete(`${ASGARDEO_BASE}/scim2/Users/${u.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  } catch (err) {
    console.warn(`   ⚠ Could not delete ${email}:`, err?.response?.data?.detail ?? err.message);
  }
}

async function createAsgardeoUser(token, { firstName, lastName, email, phone }) {
  const scimUser = {
    schemas: ['urn:ietf:params:scim:schemas:core:2.0:User'],
    userName: `DEFAULT/${email}`,
    password: PASSWORD,
    name: { givenName: firstName, familyName: lastName },
    emails: [{ primary: true, value: email }],
    ...(phone && { phoneNumbers: [{ type: 'mobile', value: phone }] }),
  };
  const { data } = await axios.post(`${ASGARDEO_BASE}/scim2/Users`, scimUser, {
    headers: { 'Content-Type': 'application/scim+json', Authorization: `Bearer ${token}` },
  });
  console.log(`   ✓ Created Asgardeo user: ${email} → ${data.id}`);
  return data.id; // asgardeoSub
}

// ── Seed account definitions ─────────────────────────────────────────────────
const ACCOUNTS = [
  { firstName: 'System',  lastName: 'Admin',        email: 'admin@vsrms.local',    phone: '+94770000001', role: 'admin' },
  { firstName: 'Roshan',  lastName: 'Fernando',     email: 'owner@vsrms.local',    phone: '+94771000001', role: 'workshop_owner' },
  { firstName: 'Amara',   lastName: 'Jayawardena',  email: 'customer@vsrms.local', phone: '+94771112233', role: 'customer' },
  { firstName: 'Kamal',   lastName: 'Silva',        email: 'tech1@vsrms.local',    phone: '+94772000001', role: 'workshop_staff' },
];

// ── Workshop data (5 workshops, all owned by owner@vsrms.local) ──────────────
const WORKSHOPS_DATA = [
  { name: 'AutoFix Pro Colombo',    coordinates: [79.8612, 6.9271], address: '12 Galle Road, Colombo 03',       district: 'Colombo',  services: ['Engine Repair', 'Brake Service', 'Oil Change'],         contact: '+94 11 234 5678', desc: 'Premier auto repair center in the heart of Colombo. Specializing in Japanese and European vehicles.' },
  { name: 'Lanka Motors Kandy',     coordinates: [80.6337, 7.2906], address: '88 Peradeniya Road, Kandy',        district: 'Kandy',    services: ['Full Service', 'Transmission Repair', 'AC Repair'],     contact: '+94 81 222 3344', desc: 'Trusted workshop in Kandy for complete vehicle maintenance and transmission overhauls.' },
  { name: 'Precision Garage Galle', coordinates: [80.2170, 6.0329], address: '34 Main Street, Galle Fort',       district: 'Galle',    services: ['Suspension Repair', 'Wheel Alignment', 'Body Work'],    contact: '+94 91 333 4455', desc: 'Precision engineering for your vehicle\'s suspension and steering systems.' },
  { name: 'SpeedZone Negombo',      coordinates: [79.8378, 7.2008], address: '5 Lewis Place, Negombo',           district: 'Gampaha',  services: ['Full Service', 'Turbo Repair', 'Performance Tuning'],   contact: '+94 31 222 5566', desc: 'Performance tuning and turbo specialists for sports cars and modified vehicles.' },
  { name: 'GreenTech EV Service',   coordinates: [79.8900, 6.9150], address: '101 Duplication Road, Colombo 04', district: 'Colombo',  services: ['EV Battery Service', 'Hybrid Repair', 'Diagnostics'],  contact: '+94 11 555 6677', desc: 'Sri Lanka\'s first dedicated electric and hybrid vehicle service center.' },
];

// ── Vehicle data (5 vehicles, all owned by customer@vsrms.local) ─────────────
const VEHICLES_DATA = [
  { registrationNo: 'WP-CAR-1001', make: 'Toyota',  model: 'Corolla',    year: 2019, vehicleType: 'car',        mileage: 48500 },
  { registrationNo: 'WP-KA-2234',  make: 'Honda',   model: 'Civic',      year: 2021, vehicleType: 'car',        mileage: 22000 },
  { registrationNo: 'SP-SUV-3300', make: 'Nissan',  model: 'X-Trail',    year: 2020, vehicleType: 'suv',        mileage: 35200 },
  { registrationNo: 'WP-BK-4400',  make: 'Yamaha',  model: 'FZ-S V3',    year: 2022, vehicleType: 'motorcycle', mileage: 12800 },
  { registrationNo: 'CP-VAN-5500', make: 'Toyota',  model: 'KDH',        year: 2018, vehicleType: 'van',        mileage: 87000 },
];

// ═══════════════════════════════════════════════════════════════════════════════
async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✓ Connected to MongoDB\n');

  // ── 1. Wipe MongoDB ────────────────────────────────────────────────────────
  console.log('══ Step 1: Wiping all MongoDB collections...');
  const collections = [User, Workshop, Vehicle, Appointment, ServiceRecord, Review];
  await Promise.all(collections.map(M => M.deleteMany({})));
  console.log('   ✓ All collections cleared\n');

  // ── 2. Asgardeo: delete old + create new users ────────────────────────────
  console.log('══ Step 2: Syncing Asgardeo users...');
  let mgmToken;
  try {
    mgmToken = await getManagementToken();
    console.log('   ✓ Got management token');
  } catch (err) {
    console.error('   ✕ Failed to get management token:', err?.response?.data ?? err.message);
    console.error('   Ensure ASGARDEO_CLIENT_ID, ASGARDEO_CLIENT_SECRET, and scopes are correct.');
    process.exit(1);
  }

  // Delete existing users first
  for (const acc of ACCOUNTS) {
    await deleteAsgardeoUserByEmail(mgmToken, acc.email);
  }

  // Create fresh users and collect their asgardeoSub IDs
  const subs = {};
  for (const acc of ACCOUNTS) {
    try {
      subs[acc.email] = await createAsgardeoUser(mgmToken, acc);
    } catch (err) {
      const detail = err?.response?.data?.detail ?? err.message;
      console.error(`   ✕ Failed to create ${acc.email}: ${detail}`);
      // If user already exists, try to fetch their ID
      if (err?.response?.status === 409) {
        const filter = encodeURIComponent(`userName eq DEFAULT/${acc.email}`);
        const { data } = await axios.get(`${ASGARDEO_BASE}/scim2/Users?filter=${filter}`, {
          headers: { Authorization: `Bearer ${mgmToken}` },
        });
        if (data?.Resources?.[0]?.id) {
          subs[acc.email] = data.Resources[0].id;
          console.log(`   ↻ Using existing Asgardeo ID for ${acc.email}: ${subs[acc.email]}`);
        } else {
          console.error(`   ✕ Cannot resolve sub for ${acc.email}. Aborting.`);
          process.exit(1);
        }
      } else {
        process.exit(1);
      }
    }
  }
  console.log('');

  // ── 3. Insert MongoDB Users ────────────────────────────────────────────────
  console.log('══ Step 3: Seeding MongoDB users...');
  const userDocs = ACCOUNTS.map(acc => ({
    asgardeoSub: subs[acc.email],
    fullName:    `${acc.firstName} ${acc.lastName}`.trim(),
    email:       acc.email,
    phone:       acc.phone,
    role:        acc.role,
    active:      true,
  }));
  const users = await User.insertMany(userDocs);
  const admin    = users[0];
  const owner    = users[1];
  const customer = users[2];
  const tech     = users[3];
  console.log(`   ✓ ${users.length} users created\n`);

  // ── 4. Insert Workshops (owned by owner) ───────────────────────────────────
  console.log('══ Step 4: Seeding 5 workshops...');
  const workshopDocs = WORKSHOPS_DATA.map(w => ({
    name:            w.name,
    location:        { type: 'Point', coordinates: w.coordinates },
    address:         w.address,
    district:        w.district,
    servicesOffered: w.services,
    description:     w.desc,
    contactNumber:   w.contact,
    ownerId:         owner._id,
    technicians:     [tech._id],
    active:          true,
    averageRating:   0,
    totalReviews:    0,
  }));
  const workshops = await Workshop.insertMany(workshopDocs);

  // Link owner and tech to the first workshop
  await User.findByIdAndUpdate(owner._id, { workshopId: workshops[0]._id });
  await User.findByIdAndUpdate(tech._id,  { workshopId: workshops[0]._id });
  console.log(`   ✓ ${workshops.length} workshops created\n`);

  // ── 5. Insert Vehicles (owned by customer) ─────────────────────────────────
  console.log('══ Step 5: Seeding 5 vehicles...');
  const vehicleDocs = VEHICLES_DATA.map(v => ({ ...v, ownerId: customer._id }));
  const vehicles = await Vehicle.insertMany(vehicleDocs);
  console.log(`   ✓ ${vehicles.length} vehicles created\n`);

  // ── 6. Insert Appointments ─────────────────────────────────────────────────
  console.log('══ Step 6: Seeding appointments...');
  const apptData = [
    // Completed (old)
    { serviceType: 'Oil Change',        status: 'completed',   date: past(60),  ws: 0, veh: 0, notes: 'Full synthetic 5W-30 oil change with filter replacement.' },
    { serviceType: 'Brake Pad Replace',  status: 'completed',   date: past(45),  ws: 0, veh: 0, notes: 'Front brake pads replaced with ceramic pads.' },
    { serviceType: 'Full Service',       status: 'completed',   date: past(30),  ws: 1, veh: 1, notes: 'Complete 40,000 km service with timing belt check.' },
    { serviceType: 'AC Repair',          status: 'completed',   date: past(20),  ws: 1, veh: 2, notes: 'AC compressor repair and gas refill.' },
    { serviceType: 'Suspension Check',   status: 'completed',   date: past(15),  ws: 2, veh: 2, notes: 'Front shock absorbers replaced.' },
    // In progress (current work)
    { serviceType: 'Engine Diagnostics', status: 'in_progress', date: past(1),   ws: 0, veh: 0, notes: 'Check engine light on. Full OBD-II scan requested.' },
    { serviceType: 'Chain Replacement',  status: 'in_progress', date: past(0),   ws: 3, veh: 3, notes: 'Drive chain and sprocket set replacement.' },
    // Confirmed (upcoming)
    { serviceType: 'Wheel Alignment',    status: 'confirmed',   date: future(3), ws: 2, veh: 2, notes: 'Four-wheel alignment after new tyres fitted.' },
    { serviceType: 'Full Service',       status: 'confirmed',   date: future(5), ws: 0, veh: 4, notes: '100,000 km major service for the van.' },
    // Pending
    { serviceType: 'Body Work',          status: 'pending',     date: future(7), ws: 2, veh: 1, notes: 'Minor dent repair on rear bumper.' },
    { serviceType: 'Battery Service',    status: 'pending',     date: future(10),ws: 4, veh: 1, notes: 'Hybrid battery health check.' },
    // Cancelled
    { serviceType: 'Turbo Repair',       status: 'cancelled',   date: past(5),   ws: 3, veh: 0, notes: 'Customer cancelled — found alternate workshop.' },
  ];

  const appointments = await Appointment.insertMany(apptData.map(a => ({
    userId:        customer._id,
    vehicleId:     vehicles[a.veh]._id,
    workshopId:    workshops[a.ws]._id,
    serviceType:   a.serviceType,
    scheduledDate: a.date,
    status:        a.status,
    notes:         a.notes,
  })));
  console.log(`   ✓ ${appointments.length} appointments created\n`);

  // ── 7. Insert Service Records (for completed + in_progress appointments) ──
  console.log('══ Step 7: Seeding service records...');
  const completedAppts = appointments.filter(a => a.status === 'completed' || a.status === 'in_progress');
  const srData = [
    // Completed records (past)
    { apptIdx: 0, workDone: 'Full synthetic oil change (5W-30). Oil filter replaced. Air filter cleaned.', parts: ['Oil Filter', 'Engine Oil 5W-30 4L'], cost: 8500,  mileage: 46000 },
    { apptIdx: 1, workDone: 'Front brake pads replaced with Brembo ceramic pads. Brake fluid topped up. Disc rotor condition: good.', parts: ['Brake Pads (Front)', 'Brake Fluid DOT4'], cost: 12500, mileage: 47200 },
    { apptIdx: 2, workDone: 'Complete 40K service: oil change, all filters replaced, spark plugs replaced, timing belt inspected (OK).', parts: ['Oil Filter', 'Air Filter', 'Spark Plugs x4', 'Engine Oil 5W-30 4L'], cost: 18500, mileage: 21000 },
    { apptIdx: 3, workDone: 'AC compressor clutch replaced. System evacuated and recharged with R134a gas (600g).', parts: ['AC Compressor Clutch', 'R134a Gas 600g'], cost: 22000, mileage: 33500 },
    { apptIdx: 4, workDone: 'Both front shock absorbers replaced with KYB units. Test drive completed — ride quality restored.', parts: ['KYB Front Shock Absorber x2', 'Mounting Nuts'], cost: 28000, mileage: 34800 },
    // In-progress records (current)
    { apptIdx: 5, workDone: 'OBD-II scan completed — P0301 misfire cylinder 1 detected. Ignition coil testing in progress.', parts: [], cost: 3500, mileage: 48500 },
    { apptIdx: 6, workDone: 'Old chain and sprocket removed. New DID chain being fitted.', parts: ['DID Drive Chain', 'Front Sprocket', 'Rear Sprocket'], cost: 9500, mileage: 12800 },
  ];

  const serviceRecords = await ServiceRecord.insertMany(srData.map(sr => ({
    appointmentId:    completedAppts[sr.apptIdx]._id,
    vehicleId:        completedAppts[sr.apptIdx].vehicleId,
    serviceDate:      completedAppts[sr.apptIdx].scheduledDate,
    workDone:         sr.workDone,
    partsReplaced:    sr.parts,
    totalCost:        sr.cost,
    mileageAtService: sr.mileage,
    technicianName:   tech.fullName,
  })));
  console.log(`   ✓ ${serviceRecords.length} service records created\n`);

  // ── 8. Insert Reviews (customer reviews completed workshops) ───────────────
  console.log('══ Step 8: Seeding reviews...');
  const reviewData = [
    { ws: 0, rating: 5, text: 'Excellent service! The team at AutoFix Pro is very professional. Oil change was done quickly and they even spotted a potential brake issue early.' },
    { ws: 1, rating: 4, text: 'Good service overall. The full service was thorough but took a bit longer than expected. Fair pricing.' },
    { ws: 2, rating: 5, text: 'Amazing work on my suspension. The car rides like new! Highly recommend Precision Garage for any suspension work.' },
    { ws: 3, rating: 3, text: 'Decent work on the chain replacement but communication could be better. Had to call multiple times for updates.' },
  ];

  const reviews = await Review.insertMany(reviewData.map((r, i) => ({
    workshopId:    workshops[r.ws]._id,
    userId:        customer._id,
    rating:        r.rating,
    reviewText:    r.text,
    appointmentId: appointments[i]._id,
  })));

  // Update workshop ratings
  for (const r of reviewData) {
    const ws = workshops[r.ws];
    const allReviews = reviewData.filter(rv => rv.ws === r.ws);
    const avg = allReviews.reduce((s, rv) => s + rv.rating, 0) / allReviews.length;
    await Workshop.findByIdAndUpdate(ws._id, {
      averageRating: Math.round(avg * 10) / 10,
      totalReviews:  allReviews.length,
    });
  }
  console.log(`   ✓ ${reviews.length} reviews created\n`);

  // ── Done ───────────────────────────────────────────────────────────────────
  console.log('════════════════════════════════════════════════════════════════');
  console.log('  ✅  SEED COMPLETE');
  console.log('════════════════════════════════════════════════════════════════');
  console.log('');
  console.log('  Test accounts (password: Login@123456):');
  console.log('  ┌──────────────────┬────────────────────────┬─────────────────┐');
  console.log('  │ Role             │ Email                  │ Name            │');
  console.log('  ├──────────────────┼────────────────────────┼─────────────────┤');
  console.log('  │ Admin            │ admin@vsrms.local      │ System Admin    │');
  console.log('  │ Workshop Owner   │ owner@vsrms.local      │ Roshan Fernando │');
  console.log('  │ Customer         │ customer@vsrms.local   │ Amara Jayawardena│');
  console.log('  │ Technician       │ tech1@vsrms.local      │ Kamal Silva     │');
  console.log('  └──────────────────┴────────────────────────┴─────────────────┘');
  console.log('');
  console.log(`  Workshops: ${workshops.length}  |  Vehicles: ${vehicles.length}  |  Appointments: ${appointments.length}`);
  console.log(`  Service Records: ${serviceRecords.length}  |  Reviews: ${reviews.length}`);
  console.log('');
  console.log('════════════════════════════════════════════════════════════════');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
