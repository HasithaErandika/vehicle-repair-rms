# VSRMS — Mobile Application

This is the React Native (Expo) frontend for the Vehicle Service & Repair Management System.

---

## 🏗️ Architecture

The app is built using **Feature-Sliced Design (FSD)** patterns to ensure high maintainability and scalability across the six core modules.

- **Routing Layer (`src/app`)**: Role-based routing for `customer`, `owner`, `technician`, and `admin`.
- **Feature Layer (`src/features`)**: Contains self-contained domains (Auth, Vehicles, etc.) each with its own API, screens, components, and state logic.
- **Service Layer (`src/services`)**: Global infrastructure for HTTP, Storage, and Geo-location.

---

## 🛠️ Technology Stack

- **Navigation**: Expo Router (File-based)
- **Styling**: React Native Unistyles v2
- **Data Fetching**: TanStack Query
- **Icons**: Lucide React Native
- **List Rendering**: Shopify FlashList

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
Ensure `EXPO_PUBLIC_API_URL` points to your running backend (e.g., `http://localhost:5000/api/v1`).

### 3. Execution
```bash
npx expo start
```
Use the Expo Go app on your physical device or an emulator to test.

---

## 📚 Technical Reference

For a deep dive into the frontend architecture, theme tokens, and role-based navigation, see the **[Frontend Architecture Guide](../docs/frontend-architecture.md)**.
