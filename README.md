<<<<<<< HEAD
# TicketSpot - Event Booking System

TicketSpot is a MERN-based event booking platform with role-based access for attendees, organizers, and admins.

## Features
- Secure JWT authentication with role-based authorization
- Event creation and lifecycle management (`pending`, `approved`, `rejected`)
- Public approved event listing and attendee booking flow
- Organizer dashboard for event management
- Admin dashboard for approval, user control, and booking metrics
- Atomic booking logic to reduce overbooking risk

## Tech Stack
- Frontend: React, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose
- Security/Validation: Helmet, JWT, bcrypt, express-validator

## Local Setup
1. Install dependencies:
   - `npm install`
   - `npm install --prefix backend`
   - `npm install --prefix frontend`
2. Configure env files:
   - Copy `backend/.env.example` -> `backend/.env`
   - Copy `frontend/.env.example` -> `frontend/.env`
3. Start development:
   - `npm run dev`
4. Seed demo users/events:
   - `npm run seed`

## Demo Credentials (after seed)
- Admin: `admin@ticketspot.dev` / `Admin@123`
- Organizer: `organizer@ticketspot.dev` / `Organizer@123`
- Attendee: `attendee@ticketspot.dev` / `Attendee@123`

## Scripts
- `npm run dev` - run frontend and backend
- `npm run test` - run backend tests
- `npm run build` - build frontend
- `npm run seed` - seed database

## API Summary
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/events`
- `POST /api/events` (organizer)
- `GET /api/events/organizer/my-events` (organizer)
- `PATCH /api/admin/events/:id/approval` (admin)
- `POST /api/bookings` (attendee)
- `GET /api/bookings/me` (attendee)

Detailed docs are in `docs/`.
=======
# TicketSpot
Event Management System
>>>>>>> 56e80ec516b779255eafcb716010761182cb0780
