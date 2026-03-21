# Viva Demo Script (5-8 Minutes)

## 1) Problem and Goal
- TicketSpot solves event data handling, booking record management, and role-based control issues.
- Core focus: event listing, booking, and administration in a MERN architecture.

## 2) Architecture
- React + Tailwind frontend (presentation layer)
- Node/Express API layer with JWT + RBAC
- MongoDB collections: `users`, `events`, `bookings`

## 3) Role Walkthrough
1. Register/login as organizer and create event.
2. Login as admin, approve event, show report metrics.
3. Login as attendee, browse approved events and book ticket.
4. Show attendee booking history and organizer/admin views.

## 4) Reliability and Security
- Input validation using `express-validator`
- Password hashing with `bcryptjs`
- JWT authentication and per-route role checks
- Atomic ticket decrement to minimize overbooking risk

## 5) Limitations and Future Scope
- No payment integration in v1
- No seat-map selection
- No SMS/email notifications
- Future: payment gateway, notifications, recommendation engine, mobile app
