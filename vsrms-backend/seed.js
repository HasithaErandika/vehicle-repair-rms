'use strict';

/**
 * VSRMS MongoDB Seed Script
 * Usage:  node seed.js   OR   npm run seed
 *
 * Wipes ALL collections, then creates:
 *   1 admin
 *   2 workshop owners
 *   6 technicians
 *   10 customers
 *   20 workshops
 *   20 vehicles
 *   10 appointments
 *   5 service records
 *   10 reviews
 */

require('dotenv').config();
const mongoose = require('mongoose');

const User          = require('./src/models/User');
const Workshop      = require('./src/models/Workshop');
const Vehicle       = require('./src/models/Vehicle');
const Appointment   = require('./src/models/Appointment');
const ServiceRecord = require('./src/models/ServiceRecord');
const Review        = require('./src/models/Review');

const pastDays   = (n) => new Date(Date.now() - n * 86_400_000);
const futureDays = (n) => new Date(Date.now() + n * 86_400_000);

const WORKSHOPS = [
  { name: 'AutoFix Pro Colombo', location: { type: 'Point', coordinates: [79.8612, 6.9271] }, address: '12 Galle Road, Colombo', district: 'Colombo', servicesOffered: ['Engine Repair', 'Brake Service'], contactNumber: '+94 11 234 5678' },
  { name: 'Lanka Motors Kandy', location: { type: 'Point', coordinates: [80.6337, 7.2906] }, address: '88 Peradeniya Road, Kandy', district: 'Kandy', servicesOffered: ['Full Service', 'Transmission Repair'], contactNumber: '+94 81 222 3344' },
  { name: 'Precision Garage Galle', location: { type: 'Point', coordinates: [80.2170, 6.0329] }, address: '34 Main Street, Galle', district: 'Galle', servicesOffered: ['Suspension Repair'], contactNumber: '+94 91 333 4455' },
  { name: 'Matara Auto Works', location: { type: 'Point', coordinates: [80.5353, 5.9549] }, address: '22 Beach Road, Matara', district: 'Matara', servicesOffered: ['Oil Change', 'Brake Repair'], contactNumber: '+94 41 222 1133' },
  { name: 'Negombo Speed Garage', location: { type: 'Point', coordinates: [79.8378, 7.2008] }, address: '5 Lewis Place, Negombo', district: 'Gampaha', servicesOffered: ['Full Service'], contactNumber: '+94 31 222 5566' }
];

const ADMIN = [
  { asgardeoSub: 'seed-admin-001', fullName: 'System Admin', email: 'admin@vsrms.local', phone: '+94 77 000 0001', role: 'admin', active: true }
];

const OWNERS = [
  { asgardeoSub: 'seed-owner-001', fullName: 'Roshan Fernando', email: 'owner@vsrms.local', phone: '+94 77 100 0001', role: 'workshop_owner', active: true },
  { asgardeoSub: 'seed-owner-002', fullName: 'Thilak Bandara', email: 'owner2@vsrms.local', phone: '+94 77 100 0002', role: 'workshop_owner', active: true }
];

const TECHNICIANS = [
  { asgardeoSub: 'seed-tech-001', fullName: 'Kamal Silva', email: 'tech1@vsrms.local', phone: '+94 77 200 0001', role: 'workshop_staff', active: true, wsIdx: 0 },
  { asgardeoSub: 'seed-tech-002', fullName: 'Nuwan Perera', email: 'tech2@vsrms.local', phone: '+94 77 200 0002', role: 'workshop_staff', active: true, wsIdx: 0 }
];

const CUSTOMERS = [
  { asgardeoSub: 'seed-cust-001', fullName: 'Amara Jayawardena', email: 'customer@vsrms.local', phone: '+94 77 111 2233', role: 'customer', active: true },
  { asgardeoSub: 'seed-cust-002', fullName: 'Ishara Pathirana', email: 'ishara@vsrms.local', phone: '+94 71 222 3344', role: 'customer', active: true }
];

const VEHICLES = [
  { registrationNo: 'WP-CAR-1001', make: 'Toyota', model: 'Corolla', year: 2019, vehicleType: 'car', mileage: 48500 },
  { registrationNo: 'WP-CAR-1002', make: 'Honda', model: 'Civic', year: 2020, vehicleType: 'car', mileage: 32000 }
];

const APPOINTMENTS = [
  { serviceType: 'Oil Change', status: 'in_progress', scheduledDate: pastDays(1), notes: 'Full synthetic oil 5W-30 requested.', wsIdx: 0, techIdx: 0 },
  { serviceType: 'Brake Service', status: 'confirmed', scheduledDate: futureDays(1), notes: 'Front brake pads heavily worn.', wsIdx: 1, techIdx: 1 }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✓ Connected to MongoDB');

  console.log('── Wiping collections...');
  await Promise.all([User.deleteMany({}), Workshop.deleteMany({}), Vehicle.deleteMany({}), Appointment.deleteMany({}), ServiceRecord.deleteMany({}), Review.deleteMany({})]);

  console.log('── Inserting Workshops...');
  const workshops = await Workshop.insertMany(WORKSHOPS);

  console.log('── Inserting Users...');
  const adminUsers = await User.insertMany(ADMIN);
  const ownerUsers = await User.insertMany(OWNERS.map((o, i) => ({ ...o, workshopId: workshops[i % workshops.length]._id })));
  const techUsers = await User.insertMany(TECHNICIANS.map(t => ({ ...t, workshopId: workshops[t.wsIdx]._id })));
  const customerUsers = await User.insertMany(CUSTOMERS);

  // Link workshops to owners and techs
  await Workshop.findByIdAndUpdate(workshops[0]._id, { ownerId: ownerUsers[0]._id, technicians: [techUsers[0]._id, techUsers[1]._id] });
  await Workshop.findByIdAndUpdate(workshops[1]._id, { ownerId: ownerUsers[1]._id, technicians: [] });

  console.log('── Inserting Vehicles...');
  const primaryVehicles = await Vehicle.insertMany(VEHICLES.map((v, i) => ({ ...v, ownerId: customerUsers[i % customerUsers.length]._id })));

  console.log('── Inserting Appointments...');
  const appointments = await Appointment.insertMany(APPOINTMENTS.map((a, i) => ({
    ...a,
    userId: customerUsers[i % customerUsers.length]._id,
    vehicleId: primaryVehicles[i]._id,
    workshopId: workshops[a.wsIdx]._id,
    technicianId: techUsers[a.techIdx]._id
  })));

  console.log('── Seeding Complete!');
  console.log('════════════════════════════════════════════════');
  console.log('IMPORTANT: DEVELOPMENT LOGIN INSTRUCTIONS');
  console.log('════════════════════════════════════════════════');
  console.log('The mock authentication bypass has been removed for security.');
  console.log('To login as one of these seeded users in development:');
  console.log('1. Open the mobile app and tap "Create a new account"');
  console.log('2. Register using one of the email addresses below (e.g. admin@vsrms.local)');
  console.log('3. The backend will automatically link your new Asgardeo account to the seeded profile.');
  console.log('');
  console.log('Seeded Accounts:');
  console.log('  Admin    : admin@vsrms.local');
  console.log('  Owner    : owner@vsrms.local');
  console.log('  Tech     : tech1@vsrms.local');
  console.log('  Customer : customer@vsrms.local');
  console.log('════════════════════════════════════════════════');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
