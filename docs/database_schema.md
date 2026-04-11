# VSRMS Database Schema

VSRMS uses MongoDB for high-performance geospatial queries and flexible data modeling.

---

## 1. Users (`users`)
Managed via Asgardeo OIDC synchronization.

| Field | Type | Required | Notes |
| :--- | :--- | :--- | :--- |
| **asgardeoSub** | String | Yes | Unique ID from Asgardeo. indexed: `{ unique: true }`. |
| **fullName** | String | Yes | Synced display name. |
| **email** | String | Yes | Unique indexed. Lowercased/Trimmed. |
| **phone** | String | No | User-provided contact. |
| **role** | Enum | Yes | `customer`, `workshop_owner`, `workshop_staff`, `admin`. |
| **workshopId** | ObjectId | No | Reference to `Workshop` (for owners/staff). |
| **active** | Boolean | Yes | Default: `true`. |

---

## 2. Vehicles (`vehicles`)

| Field | Type | Required | Notes |
| :--- | :--- | :--- | :--- |
| **ownerId** | ObjectId | Yes | FK to `users`. Indexed. |
| **registrationNo**| String | Yes | Unique index. e.g. "WP CAD-5678". |
| **make / model** | String | Yes | e.g. "Toyota", "Premio". |
| **year** | Number | Yes | Manufacture year. |
| **vehicleType** | Enum | Yes | `car`, `motorcycle`, `tuk`, `van`. |
| **imageUrl** | String | No | R2 public URL. |
| **deletedAt** | Date | No | null = active. Indexed. |

---

## 3. Workshops (`workshops`)

| Field | Type | Required | Notes |
| :--- | :--- | :--- | :--- |
| **name** | String | Yes | Display name. |
| **location** | GeoJSON | Yes | `Point` [longitude, latitude]. indexed: `2dsphere`. |
| **address** | String | Yes | Physical address. |
| **district** | String | Yes | Indexed for fast filtering. |
| **servicesOffered**| [String] | Yes | Array of supported service names. |
| **averageRating** | Number | Yes | Pre-computed. indexed: `-1` (desc). |
| **description** | String | No | Detailed bio of the garage. |

---

## 4. Appointments (`appointments`)

| Field | Type | Required | Notes |
| :--- | :--- | :--- | :--- |
| **userId** | ObjectId | Yes | FK to `users`. Indexed. |
| **workshopId** | ObjectId | Yes | FK to `workshops`. Indexed. |
| **vehicleId** | ObjectId | Yes | FK to `vehicles`. Indexed. |
| **scheduledDate** | Date | Yes | Compound index with workshopId for double-booking. |
| **status** | Enum | Yes | `pending`, `confirmed`, `in_progress`, `completed`, `cancelled`. |

---

## 5. Service Records (`servicerecords`)

| Field | Type | Required | Notes |
| :--- | :--- | :--- | :--- |
| **appointmentId** | ObjectId | Yes | FK to `appointments`. |
| **vehicleId** | ObjectId | Yes | FK to `vehicles`. Indexed for history view. |
| **serviceDate** | Date | Yes | Completion timestamp. |
| **totalCost** | Number | Yes | In LKR. |
| **workDone** | String | Yes | Technical description of service. |

---

## 6. Reviews (`reviews`)

| Field | Type | Required | Notes |
| :--- | :--- | :--- | :--- |
| **workshopId** | ObjectId | Yes | FK to `workshops`. Indexed. |
| **userId** | ObjectId | Yes | FK to `users`. indexed: `unique` (one review per user/workshop). |
| **rating** | Number | Yes | Integer 1-5. |
| **reviewText** | String | No | Written feedback. |
