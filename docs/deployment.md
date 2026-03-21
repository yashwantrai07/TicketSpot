# Deployment Guide

## Backend (Render/Railway)
1. Create a new service from `backend/`.
2. Build command: `npm install`
3. Start command: `npm start`
4. Add environment variables:
   - `MONGO_URI`
   - `PORT` (platform-managed if required)
   - `JWT_SECRET`
   - `CORS_ORIGIN` (frontend URL)

## Frontend (Vercel/Netlify)
1. Deploy from `frontend/`.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Env variable:
   - `VITE_API_URL=https://<your-backend-domain>/api`

## MongoDB Atlas
1. Create cluster and database `ticketspot`.
2. Add DB user and IP access rule.
3. Copy connection string into backend `MONGO_URI`.

## Post-Deploy Checks
- Health check: `GET /api/health`
- Login, organizer event creation, admin approval, attendee booking
- CORS behavior between frontend and backend
