# API Contracts

Base URL: `http://localhost:5000/api`

## Authentication

### POST `/auth/register`
Body:
```json
{
  "name": "User",
  "email": "user@example.com",
  "password": "secret123",
  "role": "attendee"
}
```

### POST `/auth/login`
Body:
```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

### GET `/auth/me`
Headers: `Authorization: Bearer <token>`

## Events

### GET `/events`
Query:
- `search` (optional)

### POST `/events` (organizer)
Body:
```json
{
  "title": "React Workshop",
  "description": "Event details",
  "datetime": "2026-04-20T12:00:00.000Z",
  "venue": "Hall A",
  "category": "Workshop",
  "price": 499,
  "capacity": 100
}
```

### GET `/events/organizer/my-events` (organizer)

## Bookings

### POST `/bookings` (attendee)
Body:
```json
{
  "eventId": "mongo_object_id",
  "qty": 1
}
```

### GET `/bookings/me` (attendee)

## Admin

### GET `/admin/events/pending`
### PATCH `/admin/events/:id/approval`
Body:
```json
{ "approvalStatus": "approved" }
```

### GET `/admin/users`
### PATCH `/admin/users/:id/status`
Body:
```json
{ "status": "blocked" }
```

### GET `/admin/reports/bookings`
