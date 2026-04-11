# VSRMS — Vehicle Service & Repair Management System
# Claude Code Master Prompt

## correct the CLAUDE.md and the TASKS.md by scanning the entire codebase and below details.
 
> Paste this entire file into Claude Code at the workspace root that contains
> both `vsrms-backend/` and `vsrms-mobile/`.
> Work through every phase in order. Do not skip phases or merge them.

---

## 1. Project Identity

VSRMS (Vehicle Service & Repair Management System) is a full-stack mobile application
connecting vehicle owners with service workshops in Sri Lanka.
It is a 3-week academic group project for SE2020 (28 Mar – 18 Apr 2026) with six members,
each owning a vertical module that covers both backend endpoints and mobile screens.


---

## 2. Technology Stack

### Backend — `vsrms-backend/`
- Runtime: Node.js with Express.js
- Module system: CommonJS (`require` / `module.exports`) throughout — do NOT introduce ESM
- Database: MongoDB Atlas via Mongoose ODM (free M0 tier)
- Auth: Asgardeo (WSO2) — OIDC Authorization Code + PKCE, JWT validated via JWKS endpoint
- Storage: Cloudflare R2 (S3-compatible) via `@aws-sdk/client-s3`
- File uploads: Multer with memory storage
- Input validation: express-validator
- Security: helmet, express-rate-limit, express-mongo-sanitize, express-async-errors
- Deployment: Render.com free tier

### Mobile — `vsrms-mobile/`
- Framework: React Native with Expo (TypeScript)
- Routing: Expo Router (file-based, in `src/app/`)
- Architecture: Feature-slice pattern (each domain in `src/features/[domain]/`)
- HTTP client: Axios instance in `src/services/http.client.ts`
- Server state: React Query (`@tanstack/react-query`) via `QueryProvider`
- Auth state: `src/providers/AuthProvider.tsx` (token in AsyncStorage, user + role exposed)
- Styling: react-native-unistyles (never StyleSheet.create)
- Location: expo-location
- Image picking: expo-image-picker

---

## 3. Actual File Structure

### Backend
```
vsrms-backend/
  server.js                    Entry point — at the repo root, not inside src/
  src/
    config/
      db.js                    Mongoose connection with retry logic
      r2.js                    Cloudflare R2 S3 client instance
    controllers/
      auth.controller.js
      vehicle.controller.js
      workshop.controller.js
      appointment.controller.js
      record.controller.js
      review.controller.js
    middleware/
      auth.middleware.js        JWT protect middleware (validates via JWKS, attaches req.user and req.decoded)
      roles.js                  requireRole(...roles) guard
      errorHandler.js           AppError class + globalErrorHandler
      validate.js               express-validator result checker
      rateLimiter.js            apiLimiter + authLimiter
    models/
      User.js
      Vehicle.js
      Workshop.js
      Appointment.js
      ServiceRecord.js
      Review.js
    routes/
      auth.route.js
      vehicle.route.js
      workshop.route.js
      appointment.route.js
      record.route.js
      review.route.js
    utils/
      geoHelper.js
      reviewHelper.js           recalculateRating() aggregation helper
  .env.example
```

### Mobile
```
vsrms-mobile/
  src/
    app/                        Expo Router pages
      _layout.tsx
      index.tsx
      auth/
        _layout.tsx
        login.tsx
        register.tsx
      customer/                 Customer-facing tab screens
        _layout.tsx
        index.tsx
        vehicles/               Sub-routes for vehicles
        workshops/              Sub-routes for workshops
        schedule.tsx
      owner/                    Workshop owner screens
        _layout.tsx
        index.tsx
        bookings.tsx
        jobs.tsx
        create-record.tsx
      technician/               Staff/Technician screens
        _layout.tsx
        index.tsx
        appointments.tsx
        record.tsx
        tracker.tsx
      admin/                    Admin screens
        _layout.tsx
        index.tsx
        garages.tsx
        users.tsx
      explore.tsx

    features/                   Feature-slice architecture
      auth/
        api/auth.api.ts
        hooks/useAuthForm.ts
        queries/auth.keys.ts, mutations.ts, queries.ts
        screens/LoginScreen.tsx, RegisterScreen.tsx
        types/auth.types.ts
        index.ts
      vehicles/
        api/vehicles.api.ts
        components/VehicleCard.tsx
        queries/vehicles.keys.ts, mutations.ts, queries.ts
        screens/AddVehicleScreen.tsx, EditVehicleScreen.tsx,
                VehicleDetailScreen.tsx, VehicleListScreen.tsx
        types/vehicles.types.ts
        index.ts
      workshops/
        api/workshops.api.ts
        components/RatingStars.tsx, WorkshopCard.tsx, WorkshopMap.tsx
        queries/workshops.keys.ts, mutations.ts, queries.ts
        screens/NearbyWorkshopsScreen.tsx, WorkshopDetailScreen.tsx,
                WorkshopListScreen.tsx
        types/workshops.types.ts
        index.ts
      appointments/
        api/appointments.api.ts
        components/AppointmentCard.tsx
        queries/appointments.keys.ts, mutations.ts, queries.ts
        screens/AppointmentListScreen.tsx
        types/appointments.types.ts
        index.ts
      records/
        api/records.api.ts
        components/RecordCard.tsx
        queries/records.keys.ts, mutations.ts, queries.ts
        screens/AddRecordScreen.tsx, RecordDetailScreen.tsx, RecordListScreen.tsx
        types/records.types.ts
        index.ts
      reviews/
        api/reviews.api.ts
        components/ReviewCard.tsx
        queries/reviews.keys.ts, mutations.ts, queries.ts
        screens/ReviewListScreen.tsx
        types/reviews.types.ts
        index.ts

    components/
      feedback/ErrorBoundary.tsx, ErrorScreen.tsx, Skeleton.tsx
      layout/ScreenWrapper.tsx
      navigation/app-tabs.tsx, BackButton.tsx, CustomHeader.tsx, TabBar.tsx
      ui/Badge.tsx, Button.tsx, EmptyState.tsx, Input.tsx, Primitives.tsx

    services/
      http.client.ts            Single Axios instance — all features import from here
      storage.service.ts        AsyncStorage wrapper
      location.service.ts       expo-location wrapper (handles permission + coords)
      upload.service.ts         Multipart upload helper
      error.handler.ts          Error normalisation

    providers/
      AuthProvider.tsx          Token, user, role — source of truth for auth state
      QueryProvider.tsx         React Query client
      ToastProvider.tsx

    theme/
      tokens.ts, typography.ts, breakpoints.ts, unistyles.ts

    types/
      api.types.ts              PaginatedResponse<T> and ApiError interfaces
      auth.types.ts
      navigation.types.ts
      index.ts

    hooks/
      use-theme.ts, index.ts
```

---

## 4. Architecture Rules — Non-Negotiable

### The single most important rule
The backend owns ALL business logic, validation, calculations, and security enforcement.
The mobile app's only job is to call an API endpoint and display the result.

### Backend must own
- All input validation (express-validator) — even if the mobile also validates for UX
- All authentication and authorisation checks (JWT, role guards, ownership)
- All business rules: date validation, status state machine, double booking detection
- All calculations: averageRating recalculation, geo-distance sorting
- All data shaping: pagination, filtering by query params, excluding sensitive fields

### Mobile must NOT do
- Recalculate averageRating — display the value returned by the API
- Filter or sort arrays in JavaScript — pass query params to the backend instead
- Check ownership or role on the client side — trust only what the backend enforces
- Store anything sensitive in AsyncStorage beyond the access token

### Feature-slice rules (mobile)
Each domain folder follows this strict separation:
- `api/` — plain Axios call wrappers only. No logic, no error handling, no transformation.
- `queries/` — React Query hooks (useQuery / useMutation). Cache config only. No business rules.
- `screens/` — consume hooks, display data. No calculations. No direct API calls.
- `components/` — pure UI. Props in, JSX out. No data fetching.
- `types/` — TypeScript interfaces that exactly match API response shapes.

---

## 5. Team Module Ownership

| Member | Module | Backend files | Mobile screens |
|--------|--------|---------------|----------------|
| M1 | Auth & User Management | auth.controller.js, auth.route.js | auth/, admin/users.tsx, profile in customer/index.tsx |
| M2 | Vehicle Management | vehicle.controller.js, vehicle.route.js | customer/vehicles/ + features/vehicles/screens/ |
| M3 | Workshop Management + Location | workshop.controller.js, workshop.route.js | customer/workshops/ + features/workshops/screens/ + admin/garages.tsx |
| M4 | Appointment Booking | appointment.controller.js, appointment.route.js | customer/schedule.tsx + features/appointments/ + technician/appointments.tsx |
| M5 | Service Records & History | record.controller.js, record.route.js | features/records/screens/ + owner/jobs.tsx + owner/create-record.tsx |
| M6 | Ratings, Reviews & Image Upload | review.controller.js, review.route.js + R2 upload pipeline for ALL modules | features/reviews/screens/ |

---

## 6. API Reference

Base URL: `/api/v1`
All protected routes require `Authorization: Bearer <JWT>` issued by Asgardeo.
All list endpoints support `?page=&limit=` (default page 1, default limit 20, max limit 100).
All list responses return the shape `{ data, page, limit, total, pages }`.

### Auth (M1)
- POST   /auth/sync-profile   — Protected. Upsert user from JWT claims on first login.
- GET    /auth/me             — Protected. Return own profile.
- PUT    /auth/me             — Protected. Update phone and fullName only.
- GET    /auth/users          — Admin only. Paginated list of all users.
- DELETE /auth/users/:id      — Admin only. Soft-deactivate (set active:false). Cannot deactivate self.

### Vehicles (M2)
- POST   /vehicles            — Protected owner. Create vehicle. Set ownerId from JWT.
- GET    /vehicles            — Protected owner. List own non-deleted vehicles.
- GET    /vehicles/:id        — Protected. Enforce ownerId === req.user._id.
- PUT    /vehicles/:id        — Protected. Enforce ownership. Cannot change ownerId.
- DELETE /vehicles/:id        — Protected. Soft delete (set deletedAt). Document stays in DB.
- POST   /vehicles/:id/image  — Protected. Multer + R2 upload. Save imageUrl to vehicle.

### Workshops (M3)
- POST   /workshops           — Admin only.
- GET    /workshops           — Public. Paginated. Optional `?district=` filter (case-insensitive).
- GET    /workshops/nearby    — Public. No auth required. Params: `?lat=&lng=&maxKm=` (default 50km). Returns up to 20 results sorted by distance ascending.
- GET    /workshops/:id       — Public.
- PUT    /workshops/:id       — Admin only.
- DELETE /workshops/:id       — Admin only.
- POST   /workshops/:id/image — Admin only. Multer + R2 upload.

### Appointments (M4)
- POST   /appointments              — Protected. Validate scheduledDate > now. Check double booking.
- GET    /appointments/mine         — Protected. Paginated. Optional `?status=` filter.
- GET    /appointments/:id          — Protected. Enforce userId === req.user._id.
- PUT    /appointments/:id          — Protected. Only if status === 'pending'. Enforce ownership.
- PUT    /appointments/:id/status   — Staff or Admin only. Forward-only state machine.
- DELETE /appointments/:id          — Protected. Only if status === 'pending'. Enforce ownership.

### Service Records (M5)
- POST   /records                    — Staff only.
- GET    /records/vehicle/:vehicleId — Protected. Owners see own vehicles only. Staff/admin see all.
- GET    /records/:id                — Protected. Same ownership rule.
- PUT    /records/:id                — Staff only.
- DELETE /records/:id                — Admin only.

### Reviews (M6)
- POST   /reviews                       — Protected. Rating must be integer 1–5. Recalculate workshop averageRating.
- GET    /reviews/workshop/:workshopId  — Public. Paginated. Sorted newest first.
- GET    /reviews/mine                  — Protected. Paginated.
- GET    /reviews/:id                   — Protected.
- PUT    /reviews/:id                   — Protected. Enforce ownership. Recalculate averageRating.
- DELETE /reviews/:id                   — Protected. Enforce ownership. Recalculate averageRating.

---

## 7. Key Business Logic

### Asgardeo authentication flow
The mobile app uses expo-auth-session to initiate an Authorization Code + PKCE flow.
PKCE is required on mobile because there is no secure place to store a client secret.
Asgardeo issues a JWT access token. Every protected API call sends it as a Bearer token.
The protect middleware in auth.middleware.js validates the token against the Asgardeo JWKS
endpoint — stateless, no session store needed. After validation it attaches req.user (the
MongoDB user document) and req.decoded (the raw JWT claims) to the request object.

### sync-profile
Must use findOneAndUpdate with upsert:true on asgardeoSub. Never use User.create() for
this endpoint — it will fail on the second login with a duplicate key error.
Extract sub, email, and name from req.decoded (set by the protect middleware).
Return 200 whether the user was created or already existed.

### Soft delete (vehicles only)
DELETE on a vehicle sets deletedAt to the current timestamp. The document is never removed.
Every query that lists or fetches vehicles must include deletedAt:null in the filter.

### GeoJSON coordinate order
MongoDB GeoJSON always uses [longitude, latitude] — NOT [latitude, longitude].
This is the opposite of what most people expect. Never swap this order.
The $near query uses $maxDistance in metres, so multiply kilometres by 1000.

### Double booking
When creating an appointment, calculate the start and end of the requested calendar day.
Query for any existing appointment with the same workshopId, a scheduledDate within that day,
and a status of pending, confirmed, or in_progress. If one exists, return 409.

### Appointment status state machine
Valid transitions only:
  pending → confirmed or cancelled
  confirmed → in_progress or cancelled
  in_progress → completed
  completed → no transitions allowed
  cancelled → no transitions allowed
Any other transition attempt must return 400 with a clear message showing the from/to states.
The Appointment model must expose an isValidTransition(from, to) static method.
Only staff and admin can advance status. Owners can only cancel (via DELETE while pending).

### averageRating recalculation
After every review POST, PUT, or DELETE, run a MongoDB aggregation pipeline grouped by
workshopId to calculate the new average rating and count. Update the workshop document
atomically with findByIdAndUpdate. Round the average to one decimal place.
Never run this aggregation on GET requests — read the pre-computed value from the workshop.
The recalculateRating function lives in src/utils/reviewHelper.js.

### Multer + R2 upload pipeline
M6 owns this pipeline and it is reused by both vehicle and workshop image routes.
Multer uses memory storage. Validate file type (jpeg/png only) and size (max 5MB) in the
fileFilter. On validation failure return 400 — do not attempt the R2 upload.
Use a unique key per upload that includes the document _id and a timestamp.
Save the returned public URL to the imageUrl field on the relevant document.

### Service record ownership
Owners can only access records for vehicles they own — check vehicle.ownerId === req.user._id.
Staff and admin can access records for any vehicle.
This check applies to both the list endpoint and the single record endpoint.

---

## 8. Mongoose Schema Requirements

### All schemas
Every schema must include `{ timestamps: true }`.
Never declare unique:true on both the field definition and a .index() call — use .index() only.
Exclude __v from all API responses using .select('-__v') on queries.

### Required indexes
Users: unique index on asgardeoSub, unique index on email.
Vehicles: index on ownerId, unique index on registrationNo, index on deletedAt.
Workshops: 2dsphere index on location, index on district, descending index on averageRating.
Appointments: index on userId, index on workshopId, index on vehicleId, index on status,
              compound index on (workshopId + scheduledDate) for the double booking check.
ServiceRecords: index on vehicleId, index on appointmentId.
Reviews: index on workshopId, index on userId,
         unique compound index on (workshopId + userId) — enforces one review per user per workshop.
         The unique index handles duplicate review enforcement automatically. The globalErrorHandler
         converts the resulting 11000 error to a 409 response. No manual check needed in the controller.

### Workshop location field
The GeoJSON location field must have a nested type sub-field (always the string 'Point')
and a coordinates sub-field (array of two Numbers: [longitude, latitude]).
The 2dsphere index must be declared via workshopSchema.index({ location: '2dsphere' }).

### Appointment model
The status enum must be: pending, confirmed, in_progress, completed, cancelled.
The isValidTransition static method must be declared on the schema so controllers can call
Appointment.isValidTransition(currentStatus, newStatus) without duplicating the transition map.

---

## 9. Middleware Requirements

### errorHandler.js
Must export both AppError (a custom Error subclass with a statusCode and isOperational flag)
and globalErrorHandler (the Express four-argument error middleware).
The handler must recognise and convert:
  Mongoose ValidationError → 400 with field-level messages
  Duplicate key error (code 11000) → 409 with the offending field name
  CastError (bad ObjectId) → 400
  JsonWebTokenError → 401
  TokenExpiredError → 401
For 5xx errors that are not operational, never expose the error message to the client —
return 'Internal server error' only.
In development (NODE_ENV !== 'production') log the full stack. In production log message only.

### auth.middleware.js
The JWKS client must be created once at module load time — not per request.
Enable caching on the JWKS client with a minimum cacheMaxAge of 10 minutes to avoid
rate-limiting the Asgardeo JWKS endpoint under load.
After JWT verification, look up the user in MongoDB by asgardeoSub and check active:true.
Attach the full MongoDB user document as req.user and the decoded JWT payload as req.decoded.
If the user is not found in MongoDB, return 401 directing the client to call sync-profile first.

### rateLimiter.js
apiLimiter applies to all /api/v1 routes — 100 requests per 15 minutes by default,
configurable via RATE_LIMIT_WINDOW_MS and RATE_LIMIT_MAX environment variables.
authLimiter applies to auth routes only — 20 requests per 15 minutes, not configurable.

### validate.js
A single middleware function that reads validationResult(req) and passes a 400 AppError
to next() if there are validation errors. Used as a step in every POST and PUT route chain,
always placed after the validation rule array and before the controller function.

### Middleware order in server.js
The correct order is: dotenv config → require express-async-errors → cors → helmet →
express.json with 10kb limit → express-mongo-sanitize → rate limiter → routes →
globalErrorHandler. The globalErrorHandler must be the very last middleware registered.

---

## 10. Route Registration Order

Express matches routes in the order they are registered. Parameterised routes like /:id
will match any string including literal path segments. Always register specific routes first.

In workshop.route.js — /nearby must be registered before /:id.
In appointment.route.js — /mine must be registered before /:id.
In record.route.js — /vehicle/:vehicleId must be registered before /:id.
In review.route.js — /workshop/:workshopId and /mine must both be registered before /:id.

---

## 11. Mobile Conventions

### http.client.ts
Single Axios instance with baseURL from the EXPO_PUBLIC_API_URL environment variable.
Request interceptor reads the access token from AsyncStorage and adds the Authorization header.
Response interceptor normalises errors: extracts error.response.data.error as the message,
falls back to error.message, then falls back to a generic network error string.
All features/*/api/*.api.ts files import from this service — never create a second Axios instance.

### Feature API files
Each [domain].api.ts exports a named object (e.g. vehiclesApi) with one method per endpoint.
Methods return the raw Axios promise — no .then(), no try/catch, no data transformation.
TypeScript return types must use the interfaces from types/api.types.ts.

### React Query hooks
queries.ts in each feature exports useQuery hooks.
mutations.ts in each feature exports useMutation hooks.
On successful mutations, invalidate the relevant query keys so lists refresh automatically.
Set staleTime to 5 minutes for infrequently changing data (workshops, vehicles).
Set staleTime to 0 for frequently changing data (appointments, reviews).

### Screen files
Screens must use hooks from queries/ — never call API functions directly in a screen.
Use Skeleton from components/feedback/Skeleton.tsx for loading states.
Use ErrorScreen from components/feedback/ErrorScreen.tsx for error states with a retry button.
Use EmptyState from components/ui/EmptyState.tsx when a list has no results.

### AuthProvider
Stores the access token in AsyncStorage on login.
Immediately calls POST /auth/sync-profile after storing the token.
Exposes user, role, isLoading, and signOut to the rest of the app via context.
signOut must clear AsyncStorage, clear the React Query cache, and navigate to auth/login.
Navigation routing (which tabs/stacks to show) is driven by the role from this provider.

### location.service.ts
Handles the full permission request flow and throws a descriptive error if permission is denied.
NearbyWorkshopsScreen reads coordinates from this service — never calls expo-location directly.

### Styling
Always use react-native-unistyles for all component styles.
Never use StyleSheet.create().
Theme tokens are in src/theme/tokens.ts and registered in src/theme/unistyles.ts.

---

## 12. Environment Variables

### Backend — vsrms-backend/.env.example
PORT — API port (default 5000)
NODE_ENV — development or production
ALLOWED_ORIGINS — comma-separated list of allowed CORS origins, no wildcard in production
RATE_LIMIT_WINDOW_MS — rate limit window in milliseconds (default 900000)
RATE_LIMIT_MAX — max requests per window (default 100)
MONGODB_URI — full MongoDB Atlas connection string
ASGARDEO_ISSUER — Asgardeo tenant issuer URL (used for JWT issuer validation)
ASGARDEO_JWKS_URL — Asgardeo JWKS endpoint URL (used to fetch signing keys)
R2_ACCOUNT_ID — Cloudflare account ID
R2_ACCESS_KEY_ID — R2 access key
R2_SECRET_ACCESS_KEY — R2 secret key
R2_BUCKET_NAME — R2 bucket name
R2_PUBLIC_URL — public base URL for objects (e.g. https://pub-xxx.r2.dev)

### Mobile — EXPO_PUBLIC_ prefix required for Expo to expose variables to the client bundle
EXPO_PUBLIC_API_URL — full backend URL including /api/v1 path

---

## 13. Hard Constraints — Never Violate

- Do NOT add "type": "module" to the backend package.json
- Do NOT convert backend require() calls to import/export
- Do NOT add paid services such as Stripe, Twilio, SendGrid, or Firebase
- Do NOT add Docker, Redis, Kafka, or any message queue
- Do NOT add GraphQL — REST only
- Do NOT change the auth provider from Asgardeo
- Do NOT add a web admin dashboard — mobile only
- Do NOT add push notifications (out of scope for this project)
- Do NOT exceed MongoDB M0 limits (512MB storage, 100 max connections)
- Do NOT use StyleSheet.create() in the mobile app
- Do NOT create a second Axios instance — always import from services/http.client.ts
- Do NOT filter, sort, or recalculate on the mobile side what the backend already returns

---

## 14. Step 0 — Create Project Documents Before Writing Any Code

Before touching any source file, create the following two documents.

### CLAUDE.md at the workspace root
This file is a concise developer reference for future Claude Code sessions on this project.
It must contain: project identity, stack summary, directory structure, module ownership table,
complete API endpoint list, architecture rules, key business logic summaries, environment
variable list, and hard constraints. Write it as a guide that would let a new developer
(or a fresh Claude Code session) understand the entire project without reading source code.

### TASK.md at the workspace root
This file is the sprint board for the three-week project timeline.
Organise it into three weeks matching the dates 28 Mar – 18 Apr 2026.
List every backend endpoint as a checkable task under the responsible member (M1 through M6).
List every mobile screen as a checkable task under the responsible member.
Include shared infrastructure tasks at the top of each week.
Include an Index Requirements section listing the exact index declarations for all six schemas.
Include a Known Issues Log table with columns: Date, Module, Issue, Status, Fixed By.
Mark tasks complete with [x] as work progresses.

---

## 15. Phase 1 — Backend Setup

Audit vsrms-backend/ against the structure in section 3. Check each file before creating it —
patch existing files rather than overwriting correct implementations.

Install all required packages: express, mongoose, dotenv, cors, helmet, express-rate-limit,
express-validator, multer, @aws-sdk/client-s3, jwks-rsa, jsonwebtoken, express-async-errors,
express-mongo-sanitize. Dev dependency: nodemon.

Configure package.json scripts so that dev runs nodemon on server.js and start runs node server.js.
Do not add "type": "module" under any circumstances.

Implement server.js following the middleware order defined in section 9.
Mount all six route files at their /api/v1 base paths.
Add a GET /health route.

Implement all files in src/middleware/ following the exact requirements in section 9.
Implement both files in src/config/ — db.js with retry logic, r2.js with the S3 client.
Create .env.example documenting every variable from section 12.

---

## 16. Phase 2 — Mongoose Models

Implement all six model files in src/models/ following section 8.
Every schema must have timestamps:true.
Place all index declarations at the bottom of each schema file using .index() calls.
Do not also set unique:true on the field definitions — use .index() only to avoid duplicate index warnings.
The Workshop schema's location field must use the nested GeoJSON structure with type and coordinates sub-fields.
The Appointment schema must include the isValidTransition static method and the VALID_TRANSITIONS map.

---

## 17. Phase 3 — Routes and Controllers

Implement all six route files and all six controller files.

Every route file must follow the registration order rules in section 10.

Every controller must follow these patterns:
- async/await throughout with errors thrown as AppError instances
- Pagination applied to every list endpoint
- Ownership enforcement on all protected resources
- __v excluded from all responses via .select('-__v')

Implement the Multer upload middleware following the requirements in section 7.
Wire it into both the vehicle image route and the workshop image route.

Implement reviewHelper.js with the recalculateRating function that runs an aggregation pipeline.
Implement geoHelper.js with any utilities needed by the nearby workshops query.

Add express-validator rule arrays to every POST and PUT route, followed by the validate middleware.

Follow every business logic rule in section 7 precisely — especially:
sync-profile must use upsert, GeoJSON coordinates must be [longitude, latitude],
double booking must query by calendar day with active status filter,
status transitions must be validated by Appointment.isValidTransition(),
and recalculateRating must be called after every review write, never on reads.

---

## 18. Phase 4 — Mobile App

Audit vsrms-mobile/ against the structure in section 3. Do not rename or move existing files.

Install all required packages as listed in section 2.

Implement src/services/http.client.ts as the single Axios instance following section 11.
Implement src/types/api.types.ts with PaginatedResponse and ApiError interfaces.
Implement src/providers/AuthProvider.tsx following the requirements in section 11.
Implement src/providers/QueryProvider.tsx wrapping the React Query client.
Implement src/services/location.service.ts to handle permission and coordinate retrieval.

For each of the six feature domains, implement in this order:
1. TypeScript types in types/ matching the API response shapes exactly
2. API wrapper in api/[domain].api.ts importing from http.client.ts
3. Query keys in queries/[domain].keys.ts
4. Query hooks in queries/queries.ts and mutation hooks in queries/mutations.ts
5. UI components in components/
6. Screens in screens/ consuming the hooks — never calling API functions directly

Wire the screens into the Expo Router pages in src/app/ following the role-based routing in section 5.
Owners see tabs/, staff see garage/ and staff/, admins see admin/.

---

## 19. Phase 5 — Security Hardening

Verify every item below is correctly implemented before marking phase complete.

express-mongo-sanitize is applied in server.js immediately after express.json().
express-validator chains are present on every POST and PUT route, followed by validate middleware.
The JWKS client in auth.middleware.js has caching enabled with at least a 10-minute cache age.
helmet() is applied before all routes in server.js.
CORS is configured with an explicit ALLOWED_ORIGINS list read from environment — no wildcard.
No secrets appear in any .js or .ts source file — all read from environment variables.
The .env file is listed in .gitignore and has never been committed to the repository.

---

## 20. Phase 6 — Final Integration Checklist

After all phases, verify each item and report PASS or FAIL. List all failures with details.

### Security
- CORS uses explicit origin list — no wildcard in production
- helmet() adds security headers on every response
- Rate limiter active on all /api/v1 routes
- express-mongo-sanitize strips operator injection from all inputs
- express-validator chains on all POST and PUT routes
- No secrets in any source file — all in environment variables
- JWT validated via JWKS — no shared secret used anywhere
- Role guards return 403 for insufficient permissions
- Stack traces never reach the client — server logs only

### Logic correctness
- sync-profile uses findOneAndUpdate with upsert:true — never User.create()
- Vehicle list always filters deletedAt:null
- Vehicle DELETE sets deletedAt and does not remove the document
- GET /workshops/nearby registered before GET /workshops/:id in workshop.route.js
- GET /records/vehicle/:vehicleId registered before GET /records/:id in record.route.js
- GET /appointments/mine registered before GET /appointments/:id in appointment.route.js
- GET /reviews/workshop/:workshopId and /mine registered before GET /reviews/:id
- $near query uses [longitude, latitude] order — not [latitude, longitude]
- $maxDistance uses metres — kilometres multiplied by 1000
- Double booking returns 409 for same workshop + same calendar day + active status
- Invalid status transition returns 400 with the from and to states in the message
- Duplicate review returns 409 via unique compound index — no manual check in controller
- recalculateRating called after every review write — never on read
- Staff and admin can access any vehicle's service records; owners see only their own

### Performance
- All list endpoints return the shape { data, page, limit, total, pages }
- All Mongoose indexes declared as listed in section 8
- 2dsphere index confirmed on workshops.location
- maxPoolSize set to 10 in the Mongoose connection options
- JWKS signing keys are cached — not fetched on every request
- averageRating read from the workshop document — no aggregation on GET requests

### Developer experience
- CLAUDE.md exists at workspace root with complete project reference
- TASK.md exists at workspace root with all tasks and index requirements
- vsrms-backend/.env.example documents every required variable
- GET /health returns status ok with a timestamp
- npm run dev starts without errors or deprecation warnings
- npx expo start launches without immediate errors
- EXPO_PUBLIC_API_URL points to the live Render URL before the final demo
- Postman collection covers all 28 endpoints with example requests and expected responses

---

*VSRMS Claude Code Master Prompt — v3.0 (instructions only, no inline code)*