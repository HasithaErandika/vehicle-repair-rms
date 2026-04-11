# SE2020 – Web and Mobile Technologies: Group Assignment

**Faculty of Computing**  
**BSc (Hons) in Software Engineering**  
**Year 2 Semester 2 (2026)**  

| Detail | Information |
| :--- | :--- |
| **Weight** | 20% (Marked out of 100 and scaled) |
| **Group Size** | 6 Students |
| **Duration** | 8 Weeks |

---

## 1. Assignment Overview

Students must design and develop a **Full Stack Mobile Application** utilizing:
- **Frontend**: React Native
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Deployment**: Any cloud hosting platform (AWS, Render, Railway, etc.)

---

## 2. Core System Requirements (Mandatory)

Every group project must include the following minimum functional and technical standards:

### 2.1 User Authentication
- User Registration & Login
- Password Hashing & JWT-based authentication
- Protected Routes (role-based access)

### 2.2 Hosting & Deployment
- Backend must be hosted online (Localhost demos are not allowed).
- Mobile app must connect to the live hosted API.

---

## 3. Workload Distribution

Each of the 6 members must handle a clearly defined module covering both the Backend logic and the Mobile UI.

### 3.1 Group Responsibility: Authentication
- Registration & Login APIs
- Password Security & Token Management

### 3.2 Individual Responsibility: Core Entity CRUD
Each member is responsible for:
- Full CRUD backend for a main entity
- File upload integration
- Mobile UI frontend
- API Controllers & Routes
- Comprehensive Testing

---

## 4. Technical Specifications

### Backend Requirements
- RESTful API design with proper folder structure.
- Implementation of middleware (Auth, Rate Limiting, Error Handling).
- Standardized HTTP status codes and response shapes.

### Mobile Requirements
- Proper navigation (Stack/Tab routing).
- Functional components & custom hooks.
- Form validation & API integration.
- **Zero hardcoded data** (all content from backend).

---

## 5. Marking Criteria

### A. Technical Implementation (40 Marks)
Assessed via Git history, system testing, and module ownership verification.

### B. Individual Viva (60 Marks)
Each student will be questioned individually on the following:

| Criteria | Description | Marks |
| :--- | :--- | :--- |
| **Module Explanation** | Logic, functions, and data flow of your own module. | 20 |
| **Integration** | Understanding how your module connects to the system. | 10 |
| **Backend & DB** | Understanding of schema, routes, and controllers. | 10 |
| **Mobile & API** | Understanding request flow and UI behavior. | 10 |
| **Problem Solving** | Ability to handle "what if" scenarios and debug. | 10 |
| **Total** | | **60** |

---

# VSRMS — Vehicle Service & Repair Management System
**Official Project Plan & Member Mapping**

## Project Goal
To develop a high-end Vehicle Service & Repair Management System (VSRMS) connecting owners with regional workshops, optimized for Sri Lanka.

## Module Distribution (M1 - M6)

| ID | Module Name | Primary Responsibilities |
| :--- | :--- | :--- |
| **M1** | **Auth & Admin** | Asgardeo OIDC flow, role guards, admin user management, and profile center. |
| **M2** | **Vehicles** | Full vehicle CRUD, soft delete, and Cloudflare R2 image pipeline for vehicles. |
| **M3** | **Workshops** | Workshop management, GeoJSON nearby search, and R2 image pipeline for garages. |
| **M4** | **Appointments** | Booking CRUD, status state machine, and double-booking prevention. |
| **M5** | **Service Logs** | Record management, workshop history list, and technician access control. |
| **M6** | **Reviews** | Ratings CRUD, average rating aggregation, and review enforcement. |

## Shared Infrastructure
- **R2 Pipeline**: Shared utility for image uploads located in `src/middleware/upload.js`. M2 and M3 implement specific wiring for their respective entities.
- **UI System**: Unified Dark Header / Elevated White Card design system applied across all modules.