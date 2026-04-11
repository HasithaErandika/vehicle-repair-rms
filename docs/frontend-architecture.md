# VSRMS Mobile Frontend Architecture

This document describes the **Feature-Sliced Design (FSD)** pattern implemented in the VSRMS mobile app.

---

## 1. Directory Overview

### `src/app/` — Routing (Expo Router)
The routing layer is organized by authenticated roles:
- **`customer/`**: Search, Appointments, Vehicles, and Profile for vehicle owners.
- **`owner/`**: Workshop management, job tracking, and appointment approvals for garage owners.
- **`technician/`**: Task tracking, service record creation, and workflow management for mechanics.
- **`admin/`**: Global garage and user management.
- **`auth/`**: Login and Registration flows.

### `src/features/` — Domain Layer
Business logic is grouped into self-contained vertical features:
- `auth/`: OIDC integration and profile synchronization.
- `vehicles/`: Asset management and soft-deletion logic.
- `workshops/`: Geospatial searching and detail views.
- `appointments/`: Status state machines and double-booking prevention.
- `records/`: Service history logging and historical data visualization.
- `reviews/`: Rating aggregation and feedback systems.

### `src/services/` — Infrastructure
- **`http.client.ts`**: Centralized Axios instance with Bearer token interceptors.
- **`location.service.ts`**: Permissions and Geo-location wrapper.
- **`storage.service.ts`**: Persistent state via `AsyncStorage`.

---

## 2. Technical Stack

- **Framework**: React Native + Expo (SDK 51)
- **Routing**: Expo Router (File-based navigation)
- **Styling**: React Native Unistyles v2 (Token-driven design system)
- **Data Fetching**: TanStack Query (React Query)
- **Lists**: Shopify FlashList (Engineered for performance)
- **Icons**: Lucide React Native (SVG-based)

---

## 3. Communication Patterns

### Server State (React Query)
The app uses a strict "Push-to-Refresh" model. When a mutation (like booking an appointment) completes, the associated query key is invalidated to trigger a background refetch across all screens.

### Design Tokens
UI components never use hardcoded colors or spacing. Everything is driven by `src/theme/tokens.ts`, allowing for global changes and maintaining the "Dark Header / Elevated Card" aesthetic.

### Error Normalization
All API errors are intercepted and converted into user-friendly strings via `src/services/error.handler.ts` before reaching the UI layer.
