# EventIQ — Complete Hackathon MVP

AI-powered event discovery and organizer intelligence platform.

## Stack
- Frontend: Next.js 14, React, Tailwind CSS
- Backend: Node.js, Express, PostgreSQL
- Auth: JWT + bcrypt
- AI layer: explainable rule-based scoring/classification, designed so a real LLM can be plugged in later

## Run with Docker
1. Install Docker Desktop.
2. From this folder run:
   `docker compose up --build`
3. Open http://localhost:3000

Demo accounts:
- Student: `student@eventiq.demo` / `student123`
- Organizer: `organizer@eventiq.demo` / `organizer123`

The backend is at http://localhost:4000.

## Run without Docker
### Backend
`cd backend && npm install && npm run dev`

Create PostgreSQL database `eventiq`, then set:
`DATABASE_URL=postgresql://postgres:postgres@localhost:5432/eventiq`

Run `npm run seed`.

### Frontend
`cd frontend && npm install && npm run dev`

Set `NEXT_PUBLIC_API_URL=http://localhost:4000/api`.
