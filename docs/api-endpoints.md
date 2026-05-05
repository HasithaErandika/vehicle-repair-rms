# VSRMS — API Endpoint Reference

**Base URL:** `https://your-api-url.onrender.com/api/v1`  
**Authentication:** Bearer token in `Authorization` header — `Authorization: Bearer <access_token>`  
**Content-Type:** `application/json` (except image upload endpoints which use `multipart/form-data`)

---

## Legend

| Symbol | Meaning |
| :--- | :--- |
| `[PUB]` | Public — no authentication required |
| `[AUTH]` | Requires valid JWT (any authenticated user) |
| `[CUST]` | Customer only |
| `[OWN]` | Workshop Owner only |
| `[STF]` | Workshop Staff only |
| `[STF\|OWN]` | Workshop Staff or Workshop Owner |
| `[STF\|OWN\|ADM]` | Workshop Staff, Workshop Owner, or Admin |
| `[OWN\|ADM]` | Workshop Owner or Admin |
| `[ADM]` | Admin only |

---

## M1 — Authentication & User Management

| # | Method | Endpoint | Auth | Description | Request Body | Success Response |
| :- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `POST` | `/auth/register` | `[PUB]` | Register a new customer or workshop owner via Asgardeo SCIM2 | `{ firstName, lastName, email, password, phone?, role }` | `201 { message }` |
| 2 | `POST` | `/auth/login` | `[PUB]` | Proxy ROPC login to Asgardeo; returns JWT access token | `{ email, password }` | `200 { access_token, id_token, refresh_token, expires_in, user }` |
| 3 | `POST` | `/auth/sync-profile` | `[AUTH]` | Upsert MongoDB user document after OIDC login. Call once after every login. | _(none — reads JWT claims)_ | `200 { user }` |
| 4 | `GET` | `/auth/me` | `[AUTH]` | Get the authenticated user's own profile | _(none)_ | `200 { user }` |
| 5 | `PUT` | `/auth/me` | `[AUTH]` | Update own profile (name and/or phone) | `{ fullName?, phone? }` | `200 { user }` |
| 6 | `GET` | `/auth/users` | `[ADM]` | List all users — paginated (`?page=&limit=`) | _(none)_ | `200 { data[], page, limit, total, pages }` |
| 7 | `DELETE` | `/auth/users/:id` | `[ADM]` | Soft-deactivate a user (sets `active: false`). Cannot deactivate self. | _(none)_ | `200 { message, user }` |
| 8 | `GET` | `/auth/staff` | `[OWN]` | List all workshop_staff linked to owner's workshop (`?workshopId=&page=&limit=`) | _(none)_ | `200 { data[], page, limit, total, pages }` |
| 9 | `POST` | `/auth/staff` | `[OWN]` | Register a new technician in Asgardeo and link them to a workshop | `{ firstName, lastName, email, password, phone?, workshopId? }` | `201 { message, user }` |

---

## M2 — Vehicle Management

> All vehicle endpoints require authentication. Customers can only access their own vehicles.

| # | Method | Endpoint | Auth | Description | Request Body | Success Response |
| :- | :--- | :--- | :--- | :--- | :--- | :--- |
| 10 | `GET` | `/vehicles` | `[AUTH]` | List all active (non-deleted) vehicles owned by the authenticated user | _(none)_ | `200 { data[], page, limit, total, pages }` |
| 11 | `POST` | `/vehicles` | `[AUTH]` | Add a new vehicle for the authenticated user | `{ registrationNo, make, model, year, vehicleType }` | `201 { vehicle }` |
| 12 | `GET` | `/vehicles/:id` | `[AUTH]` | Get a single vehicle by ID. Ownership enforced (403 if not yours). | _(none)_ | `200 { vehicle }` |
| 13 | `PUT` | `/vehicles/:id` | `[AUTH]` | Update vehicle details. Ownership enforced. | `{ make?, model?, year?, vehicleType? }` | `200 { vehicle }` |
| 14 | `DELETE` | `/vehicles/:id` | `[AUTH]` | Soft-delete a vehicle (sets `deletedAt`). Ownership enforced. | _(none)_ | `200 { message }` |
| 15 | `POST` | `/vehicles/:id/image` | `[AUTH]` | Upload a vehicle photo to Cloudflare R2. Use `multipart/form-data`, field name `image`. | `form-data: image (file)` | `200 { imageUrl }` |

**vehicleType enum:** `car` \| `motorcycle` \| `tuk` \| `van`

---

## M3 — Workshop Management & Location

| # | Method | Endpoint | Auth | Description | Request Body / Query Params | Success Response |
| :- | :--- | :--- | :--- | :--- | :--- | :--- |
| 16 | `GET` | `/workshops` | `[PUB]` | List all active workshops, sorted by rating. Supports `?district=&name=&page=&limit=` | _(none)_ | `200 { data[], page, limit, total, pages }` |
| 17 | `GET` | `/workshops/nearby` | `[PUB]` | Find workshops within a radius using GeoJSON `$geoNear`. Requires `?lat=&lng=`. Optional `?maxKm=&name=` | _(none)_ | `200 { data[] }` — includes `distance` field in km |
| 18 | `GET` | `/workshops/mine` | `[OWN\|ADM]` | List workshops owned by the authenticated owner (`?page=&limit=`) | _(none)_ | `200 { data[], page, limit, total, pages }` |
| 19 | `GET` | `/workshops/:id` | `[PUB]` | Get a single workshop's full profile by ID | _(none)_ | `200 { workshop }` |
| 20 | `POST` | `/workshops` | `[OWN\|ADM]` | Create a new workshop. Owner's `ownerId` is set automatically from JWT. | `{ name, location: {coordinates:[lng,lat]}, address, district, servicesOffered[], contactNumber, description? }` | `201 { workshop }` |
| 21 | `PUT` | `/workshops/:id` | `[OWN\|ADM]` | Update workshop details. Owner must own the workshop; admin can edit any. | `{ name?, address?, district?, contactNumber?, servicesOffered[]?, location?, description? }` | `200 { workshop }` |
| 22 | `DELETE` | `/workshops/:id` | `[ADM]` | Soft-deactivate a workshop (sets `active: false`) | _(none)_ | `200 { message, workshop }` |
| 23 | `POST` | `/workshops/:id/image` | `[OWN\|ADM]` | Upload a workshop cover photo to Cloudflare R2. Use `multipart/form-data`, field name `image`. | `form-data: image (file)` | `200 { imageUrl }` |
| 24 | `GET` | `/workshops/:id/technicians` | `[OWN\|ADM]` | List all technicians (staff users) assigned to a workshop | _(none)_ | `200 { data[] }` |
| 25 | `POST` | `/workshops/:id/technicians` | `[OWN]` | Pre-register and assign a technician to this workshop | `{ firstName, lastName, email, phone? }` | `201 { message, user }` |
| 26 | `DELETE` | `/workshops/:id/technicians/:userId` | `[OWN]` | Remove a technician from the workshop's staff list | _(none)_ | `200 { message }` |

**district values:** Any of the 25 Sri Lanka administrative districts (e.g. `Colombo`, `Gampaha`, `Kandy`, etc.)

---

## M4 — Appointment Booking

| # | Method | Endpoint | Auth | Description | Request Body / Query Params | Success Response |
| :- | :--- | :--- | :--- | :--- | :--- | :--- |
| 27 | `GET` | `/appointments/mine` | `[AUTH]` | Get the authenticated customer's own appointments. Supports `?status=pending,confirmed&page=&limit=` | _(none)_ | `200 { data[], page, limit, total, pages }` |
| 28 | `GET` | `/appointments/workshop-all` | `[OWN\|ADM]` | Get all appointments across all workshops owned by the authenticated owner | _(none)_ | `200 { data[], page, limit, total, pages }` |
| 29 | `GET` | `/appointments/workshop/:workshopId` | `[STF\|OWN\|ADM]` | Get appointments for a specific workshop. Supports `?status=&page=&limit=` | _(none)_ | `200 { data[], page, limit, total, pages }` |
| 30 | `POST` | `/appointments` | `[AUTH]` | Book a new appointment. Validates: no past dates, vehicle ownership, max 20 bookings per workshop per day. | `{ vehicleId, workshopId, serviceType, scheduledDate, notes? }` | `201 { appointment }` |
| 31 | `GET` | `/appointments/:id` | `[AUTH]` | Get a single appointment. Ownership/role enforced. | _(none)_ | `200 { appointment }` |
| 32 | `PUT` | `/appointments/:id` | `[AUTH]` | Reschedule or update an appointment. Only allowed when `status === 'pending'`. | `{ serviceType?, scheduledDate?, notes? }` | `200 { appointment }` |
| 33 | `PUT` | `/appointments/:id/status` | `[STF\|OWN\|ADM]` | Advance appointment status via the state machine. Invalid transitions return 400. | `{ status }` | `200 { appointment }` |
| 34 | `DELETE` | `/appointments/:id` | `[AUTH]` | Cancel an appointment. Only allowed when `status === 'pending'`. | _(none)_ | `200 { message }` |

**status state machine:** `pending` → `confirmed` → `in_progress` → `completed` \| `cancelled` (from `pending` or `confirmed`)

---

## M5 — Service Records & History

| # | Method | Endpoint | Auth | Description | Request Body | Success Response |
| :- | :--- | :--- | :--- | :--- | :--- | :--- |
| 35 | `GET` | `/records/vehicle/:vehicleId` | `[AUTH]` | Get all service records for a specific vehicle. Customer must own the vehicle. | _(none)_ | `200 { data[], page, limit, total, pages }` |
| 36 | `GET` | `/records/workshop/:workshopId` | `[STF\|OWN\|ADM]` | Get all service records created by a specific workshop. Staff/Owner/Admin only. | _(none)_ | `200 { data[], page, limit, total, pages }` |
| 37 | `POST` | `/records` | `[STF\|OWN\|ADM]` | Create a service record upon completing an appointment. Links to both appointment and vehicle. | `{ appointmentId, vehicleId, serviceDate, totalCost, workDone }` | `201 { record }` |
| 38 | `GET` | `/records/:id` | `[AUTH]` | Get a single service record. Ownership enforced. | _(none)_ | `200 { record }` |
| 39 | `PUT` | `/records/:id` | `[STF\|OWN\|ADM]` | Update a service record (e.g. correct cost or work description). Staff/Owner/Admin only. | `{ serviceDate?, totalCost?, workDone? }` | `200 { record }` |
| 40 | `DELETE` | `/records/:id` | `[OWN\|ADM]` | Permanently delete a service record. Owner/Admin only. | _(none)_ | `200 { message }` |

---

## M6 — Ratings & Reviews

| # | Method | Endpoint | Auth | Description | Request Body | Success Response |
| :- | :--- | :--- | :--- | :--- | :--- | :--- |
| 41 | `GET` | `/reviews/workshop/:workshopId` | `[PUB]` | Get all reviews for a specific workshop, paginated. Newest first. | _(none)_ | `200 { data[], page, limit, total, pages }` |
| 42 | `GET` | `/reviews/mine` | `[AUTH]` | Get all reviews written by the authenticated user | _(none)_ | `200 { data[], page, limit, total, pages }` |
| 43 | `POST` | `/reviews` | `[AUTH]` | Submit a review for a workshop. Automatically recalculates `averageRating` on the Workshop document. One review per user per workshop enforced. | `{ workshopId, rating (1-5), reviewText? }` | `201 { review }` |
| 44 | `GET` | `/reviews/:id` | `[AUTH]` | Get a single review by ID | _(none)_ | `200 { review }` |
| 45 | `PUT` | `/reviews/:id` | `[AUTH]` | Update your own review. Ownership enforced. Recalculates workshop `averageRating`. | `{ rating?, reviewText? }` | `200 { review }` |
| 46 | `DELETE` | `/reviews/:id` | `[AUTH]` | Delete your own review. Ownership enforced. Recalculates workshop `averageRating`. | _(none)_ | `200 { message }` |

---

## System / Health

| # | Method | Endpoint | Auth | Description | Success Response |
| :- | :--- | :--- | :--- | :--- | :--- |
| 47 | `GET` | `/health` | `[PUB]` | Health check — verify the API is online | `200 { status: "ok", service: "VSRMS API" }` |

---

## Standard Error Responses

All endpoints return consistent error shapes:

```json
{ "error": "Human-readable error message" }
```

| HTTP Status | Meaning |
| :--- | :--- |
| `400 Bad Request` | Missing required fields, invalid data, or state machine violation |
| `401 Unauthorized` | Missing or invalid Bearer token |
| `403 Forbidden` | Authenticated but insufficient role or ownership |
| `404 Not Found` | Resource does not exist |
| `409 Conflict` | Duplicate record (e.g. same workshop, same date over capacity; duplicate review) |
| `429 Too Many Requests` | Rate limiter triggered (auth endpoints: 10 req/15 min; general: 100 req/15 min) |
| `500 Internal Server Error` | Unexpected server-side failure |

---

## Pagination

All list endpoints support the following query parameters:

| Param | Default | Max | Description |
| :--- | :--- | :--- | :--- |
| `page` | `1` | — | Page number (1-indexed) |
| `limit` | `20` | `100` | Items per page |

Response shape for all paginated endpoints:

```json
{
  "data": [...],
  "page": 1,
  "limit": 20,
  "total": 42,
  "pages": 3
}
```

