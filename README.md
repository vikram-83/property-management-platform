# Property Management Platform

Full-stack property management system — React (Vite) frontend, Node/Express backend, MongoDB (Mongoose) database, JWT auth with 5 roles (admin, manager, tenant, staff, vendor), and Socket.IO wired in for real-time notifications.

This is the **MVP foundation** covering Steps 1–3 of the build roadmap:
- Project setup (client + server + MongoDB)
- Authentication (register/login/JWT, ProtectedRoute, RoleRoute)
- Property → Building → Unit (full CRUD on the backend)

Models for the later steps (Lease, Payment, MaintenanceTicket, Amenity, Booking, Vendor, Notification) are already created in `server/src/models/` so Steps 5–9 slot in without restructuring — you just need controllers + routes + frontend pages for each, following the exact same pattern as `propertyController.js` / `propertyRoutes.js`.

## Prerequisites

- Node.js 18+
- MongoDB running locally, or a free MongoDB Atlas cluster

## 1. Backend setup

```powershell
cd server
Copy-Item .env.example .env
# Edit .env and set MONGO_URI and JWT_SECRET.
npm install
npm run seed     # creates one demo user per role, password: password123
npm run dev      # starts on http://localhost:5000
```

Demo logins after seeding:
| Role | Email | Password |
|---|---|---|
| Admin | admin@demo.com | password123 |
| Manager | manager@demo.com | password123 |
| Tenant | tenant@demo.com | password123 |
| Staff | staff@demo.com | password123 |
| Vendor | vendor@demo.com | password123 |

## 2. Frontend setup

```powershell
cd client
Copy-Item .env.example .env
npm install
npm run dev      # starts on http://localhost:5173
```

## 3. Login flow

Open `http://localhost:5173`. The first screen is the login page. After a successful
login, the frontend reads the role returned by `POST /api/auth/login` and redirects to
the matching protected dashboard:

| Role | Dashboard |
|---|---|
| Admin | `/admin/dashboard` |
| Manager | `/manager/dashboard` |
| Staff | `/staff/dashboard` |
| Tenant | `/tenant/dashboard` |
| Vendor | `/vendor/dashboard` |

`AuthContext` stores the JWT in browser storage, sends it as a Bearer token through the
shared Axios client, and restores the session with `GET /api/auth/me` on reload.

Open http://localhost:5173, log in with any demo account above, and you'll land on the matching role dashboard.

## API endpoints implemented so far

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me            (protected)

GET    /api/properties         (protected)
POST   /api/properties         (admin, manager)
GET    /api/properties/:id
PUT    /api/properties/:id     (admin, manager)
DELETE /api/properties/:id     (admin)

GET    /api/buildings
POST   /api/buildings          (admin, manager)
GET    /api/buildings/:id
PUT    /api/buildings/:id      (admin, manager)
DELETE /api/buildings/:id      (admin, manager)

GET    /api/units
POST   /api/units              (admin, manager)
GET    /api/units/:id
PUT    /api/units/:id          (admin, manager)
DELETE /api/units/:id          (admin, manager)
```

## Next steps (follow this order, one at a time)

4. **Users** — Owner/Tenant/Manager/Staff/Vendor admin management pages
5. **Rental** — Lease, Rent Invoice, Payment (model already stubbed)
6. **Maintenance** — Ticket, Assignment, Work Order, SLA (model already stubbed)
7. **Real-time** — Socket.IO events for live ticket updates + notifications (server scaffold already in `server.js`)
8. **Amenities** — Amenity, Slots, Booking with double-booking protection (model already stubbed with a unique index)
9. **Advanced** — Vendor, Asset, Preventive Maintenance, Reports/Analytics
10. **AI** — Complaint classification, priority prediction, duplicate detection

For each new entity: add a Mongoose model (if not already stubbed) → controller → routes file → register the routes in `server/src/app.js` → add a service file in `client/src/services/` → build the page → wire it into `AppRoutes.jsx` with the right `RoleRoute` roles → add the nav link in `Sidebar.jsx`.

## Project structure

```
property-management-platform/
├── client/     # React + Vite frontend
└── server/     # Node/Express + MongoDB backend
```
