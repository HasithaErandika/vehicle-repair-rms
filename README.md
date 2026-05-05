# VSRMS — Vehicle Service & Repair Management System

[![Status](https://img.shields.io/badge/Status-v1.0--Stable-success)](#)
[![Stack](https://img.shields.io/badge/Stack-MERN-blue)](#)
[![Deployment](https://img.shields.io/badge/Deployment-Render-FF3300)](#)

VSRMS is a high-performance, full-stack mobile application designed to bridge the gap between vehicle owners and repair workshops. Built with a focus on geospatial discovery, real-time status tracking, and secure asset management.

---

## Architecture Overview

The system follows a three-tier, enterprise-grade architecture:

- **Mobile**: React Native (Expo) featuring a **Feature-Sliced Context** and Token-driven UI.
- **Backend**: Node.js + Express with stateless JWT authentication and role-based guards.
- **Data**: MongoDB Atlas (Primary) + Cloudflare R2 (Object Storage).

---

## Core Modules (M1 - M6)

| Module | Scope | Ownership |
| :--- | :--- | :--- |
| **M1: Auth & User** | OIDC Identity (Asgardeo), Profile Sync, Admin User Management. | Member 1 |
| **M2: Vehicles** | Vehicle Asset CRUD, Soft Deletion, R2 Image Pipeline. | Member 2 |
| **M3: Workshops** | GeoJSON Nearby Search, Workshop Profiles, District Filtering. | Member 3 |
| **M4: Bookings** | Appointment State Machine, Booking Prevention, Real-time status. | Member 4 |
| **M5: Logs** | Historical Service Records, Tech Access Control, Cost Tracking. | Member 5 |
| **M6: Reviews** | Rating Aggregation, User Feedback, Service Validation. | Member 6 |

---

## Key Features

- **Geospatial Discovery**: Find the nearest workshops based on your current GPS location.
- **Stateless Security**: Secure OIDC authentication via Asgardeo (WSO2) with JWT validation.
- **Media Pipeline**: Direct-to-cloud image uploads for vehicles and garages via Cloudflare R2.
- **Premium UI**: Dark-mode-ready, card-elevated interface optimized for visibility.

---

## Documentation Hub

For detailed technical guides, please refer to:

1.  **[Quick Setup Guide](docs/setup.md)** — Get up and running in 5 minutes.
2.  **[Database Schema](docs/database_schema.md)** — Mongoose models and indexing strategy.
3.  **[Frontend Architecture](docs/frontend-architecture.md)** — Routing, state, and theme layers.
4.  **[API Collection](vsrms-backend/README.md#api-endpoints)** — Comprehensive endpoint reference.

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/HasithaErandika/vehicle-repair-rms.git

# Set up the API
cd vsrms-backend && npm install

# Set up the Mobile App
cd vsrms-mobile && npm install
```

*For individual environment configuration, see the [Setup Guide](docs/setup.md).*

---

