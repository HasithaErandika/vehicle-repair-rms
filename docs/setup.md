# VSRMS Setup Guide

Follow these steps to set up the Vehicle Service & Repair Management System for local development.

---

## 1. Prerequisites

- **Node.js**: v18 or later (LTS recommended)
- **Git**: For version control
- **MongoDB**: Local installation or a MongoDB Atlas account
- **Expo Go App**: (Optional) For testing on physical mobile devices

---

## 2. Infrastructure Setup

### MongoDB
Ensure your MongoDB instance is running.
- **Local (Ubuntu):** `sudo systemctl start mongod`
- **Local (Windows):** Start "MongoDB Server" in Services.
- **Cloud:** Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### Asgardeo (WSO2)
VSRMS uses Asgardeo for OIDC authentication.
1. Create a **Standard-Based Application** (OIDC) in your Asgardeo Console.
2. Note your **Organization Name**, **Client ID**, and **Client Secret**.
3. Add Redirect URIs for local development:
   - `exp://127.0.0.1:8081` (for Expo Go)
   - `http://localhost:8081` (for Web/Simulators)

---

## 3. Backend Setup (`/vsrms-backend`)

1. **Install Dependencies:**
   ```bash
   cd vsrms-backend
   npm install
   ```

2. **Environment Variables:**
   ```bash
   cp .env.example .env
   ```
   Fill in your `MONGODB_URI`, `ASGARDEO_*` credentials, and `R2_*` (Cloudflare) keys.

3. **Start the Server:**
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:5000/api/v1`.

---

## 4. Mobile Setup (`/vsrms-mobile`)

1. **Install Dependencies:**
   ```bash
   cd vsrms-mobile
   npm install
   ```

2. **Environment Variables:**
   ```bash
   cp .env.example .env
   ```
   Set `EXPO_PUBLIC_API_URL` to your backend URL (path: `/api/v1`).
   *Note: Use your computer's local IP (e.g., `192.168.1.x`) if testing on a physical device via Expo Go.*

3. **Start the App:**
   ```bash
   npx expo start
   ```

---

## 5. Deployment (Production)

### Backend
- Deploy to **Render.com** as a "Web Service".
- Set all environment variables in the Render Dashboard.
- Ensure `ALLOWED_ORIGINS` includes your production mobile app identifier.

### Mobile
- Update `EXPO_PUBLIC_API_URL` to the live Render URL.
- Build for Android/iOS using **EAS Build**: `eas build --platform all`.
