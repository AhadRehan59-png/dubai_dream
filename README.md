# Dream Dubai - Lucky Draw Platform

A modern raffle/lucky draw platform built with Next.js 15 and Express. Users can browse prize categories, purchase tokens, participate in draws, and track their entries.

## Project Structure

```
frontend/          # Next.js UI (pages, components)
backend/           # Express API, Prisma, MongoDB
  prisma/          # Database schema
  src/
    routes/        # API endpoints
    lib/           # Auth, draw engine, notifications
    scripts/       # Seed script
.env               # Shared environment (root)
```

## Features

- **Multiple Categories** - Electronics, Cash, Auto, Gold, Lifestyle, Travel
- **Token System** - Unique token numbers for each purchase
- **User Auth** - JWT sessions with httpOnly cookies
- **Pakistan Payments** - EasyPaisa, JazzCash, bank transfer, Raast
- **Automated Draws** - Cryptographically secure random winner selection
- **Admin Panel** - Manage draws and run draws manually
- **Responsive Design** - Mobile-friendly dark theme UI

## Quick Start

```bash
# Install dependencies (root + frontend + backend)
npm install

# Copy environment file
copy .env.example .env

# Setup database
npm run db:push
npm run db:seed

# Start both servers
npm run dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:4000](http://localhost:4000)

Or run separately:

```bash
npm run dev:backend   # port 4000
npm run dev:frontend  # port 3000
```

## Demo Accounts

| Role  | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | admin@dreamdubai.ae    | admin123  |
| User  | user@example.com       | user123   |

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `DATABASE_URL` - MongoDB connection string
- `JWT_SECRET` - Session signing secret
- `FRONTEND_URL` - Frontend URL (default: http://localhost:3000)
- `BACKEND_URL` - Backend URL (default: http://localhost:4000)
- `INTERNAL_API_URL` - Used by Next.js server components to call backend
- `CRON_SECRET` - Automated draw cron job auth

## Automated Draws

Trigger via cron:

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" http://localhost:4000/api/cron/run-draws
```

Or manually from Admin Panel → "Run Draw"

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **Backend**: Express 5, Prisma, MongoDB
- **Auth**: JWT with httpOnly cookies

## License

Private - Dream Dubai Platform
