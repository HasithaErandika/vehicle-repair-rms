# VSRMS Mobile Frontend Architecture

This document maps out the domain-driven, feature-sliced architectural pattern implemented for the VSRMS mobile application.

## Directory Overview

The project relies on a strictly separated architectural pattern designed for scalability and professional enterprise readiness:

- `src/app/` - **The Routing Layer (Expo Router)**
  - Contains simple layout and routing wrappers.
  - `tabs/` directory uses a flat structure for main navigation: `index.tsx`, `workshops.tsx`, `vehicles.tsx`, `schedule.tsx`.
  
- `src/features/` - **The Domain Layer (Feature-Sliced)**
  - Grouped by domain: `vehicles/`, `workshops/`, `appointments/`, `reviews/`, `records/`, `auth/`.
  - Each domain contains:
    - `api/`: Domain-specific API calls and TanStack Query hooks.
    - `queries/`: Query keys, queries, and mutations definitions.
    - `components/`: Domain-specific UI components.
    - `screens/`: Features screens (imported by the routing layer).
    - `types/`: TypeScript interfaces for the domain.
    - `utils/`: Domain-specific helper functions.

- `src/components/` - **The Global UI/Foundation Layer**
  - `layout/`: `ScreenWrapper.tsx` (handles safe areas/scrolling).
  - `feedback/`: `Skeleton.tsx`, `ErrorScreen.tsx`, `LoadingOverlay.tsx`.
  - `ui/`: Design primitives like `Button.tsx`, `Input.tsx`.

- `src/services/` - **Infrastructure Layer**
  - `http.client.ts`: Centralized Axios instance with interceptors for JWT and 401 refresh.
  - `storage.service.ts`: Wrapper for `expo-secure-store`.
  - `location.service.ts`: Location and permissions wrapper.

- `src/providers/` - **Global Context Layer**
  - Composed stack: `ErrorBoundary` → `GestureHandler` → `SafeArea` → `QueryProvider` → `AuthProvider` → `ToastProvider`.

- `src/theme/` - **Design System (Unistyles v3)**
  - Uses `react-native-unistyles` v3.
  - Pattern: `StyleSheet.create((theme) => ({ ... }))`.
  - No `useStyles` hook; styles are accessed directly from the generated object.

---

## Architectural Patterns

### Pattern 1: Query Synchronization
Query keys are centralized in `{feature}.keys.ts` files to ensure cache invalidation consistency across the app.

### Pattern 2: Screen Logic
Every screen must handle three states:
1. `isLoading` -> Render `Skeleton` component.
2. `isError` -> Render `ErrorScreen` with `refetch` capability.
3. `isSuccess` -> Render `ScreenWrapper` with `FlashList` for lists.

### Pattern 3: Global HTTP Client
All remote data fetching must go through `src/services/http.client.ts`. Direct `axios` imports in features are forbidden.

---

## Technical Stack
- **Framework**: Expo (SDK 54)
- **Routing**: Expo Router
- **State Management**: TanStack Query (React Query)
- **Styling**: React Native Unistyles v3
- **Storage**: Expo Secure Store
- **Lists**: Shopify FlashList (performance-optimized)
