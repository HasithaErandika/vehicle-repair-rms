# VSRMS — Backend API

Node.js REST API for the Vehicle Service & Repair Management System.

---

## 🏗️ Architecture

- **Runtime**: Node.js (CommonJS / `require`)
- **Framework**: Express.js
- **Database**: MongoDB Atlas via Mongoose ODM
- **Security**: Stateles JWT via Asgardeo JWKS validation
- **Storage**: Cloudflare R2 (S3 Client)
- **Deployment**: Render.com

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file from the example:
```bash
cp .env.example .env
```
Fill in your MongoDB URI, Asgardeo Org/Client secrets, and R2 credentials.

### 3. Execution (Development)
```bash
npm run dev
```
The API starts at `http://localhost:5000/api/v1`.

---

## 📡 API Reference (Core Endpoints)

| Domain | Path | Method | Auth | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `/auth/sync-profile` | POST | JWT | Synchronize MongoDB user on first login. |
| **Vehicles** | `/vehicles` | GET/POST | JWT | Manage owner-owned vehicles. |
| **Workshops**| `/workshops/nearby` | GET | Public| Search via GeoJSON [lon, lat]. |
| **Bookings** | `/appointments` | POST | JWT | Book service (with double-booking check). |
| **History** | `/records/:id` | GET | JWT | View service logs. |

---

## 📚 Technical Reference

For the full detailed database schema, Mongoose indexing strategy, and field definitions, see the **[Database Schema Reference](../docs/database_schema.md)**.
