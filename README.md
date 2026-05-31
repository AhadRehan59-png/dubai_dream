# Dream Dubai - Lucky Draw Platform

A modern raffle/lucky draw platform built with Next.js 15, matching the Dream Dubai design. Users can browse prize categories, purchase tokens, participate in draws, and track their entries.

## Features

- **Multiple Categories** - Electronics, Cash, Auto, Gold, Lifestyle, Travel
- **Prize Listings** - Images, descriptions, fixed token prices, countdown timers
- **Token System** - Unique token numbers for each purchase
- **User Auth** - Secure registration and login with JWT sessions
- **Payment Gateway** - Stripe integration (falls back to demo mode without keys)
- **Automated Draws** - Cryptographically secure random winner selection
- **User Dashboard** - Track tickets and wallet/payment history
- **Admin Panel** - Manage categories, draws, users, and run draws manually
- **Notifications** - Email/SMS stubs for winners and participants
- **Winners Page** - Past draw results and history
- **Responsive Design** - Mobile-friendly dark theme UI

## Database Setup (MongoDB)

All data is stored in **MongoDB**. Choose one option:

### MongoDB Compass (view all data)

1. Open **MongoDB Compass**
2. Connect with:
   ```
   mongodb://127.0.0.1:27017/?replicaSet=rs0
   ```
   Or simply: `mongodb://127.0.0.1:27017`
3. Open database: **`dream_dubai`**

You will see these collections:

| Collection | Stores |
|---|---|
| `User` | Login / signup accounts |
| `Category` | Prize categories |
| `CategoryImage` | Category gallery images |
| `Draw` | Raffle campaigns |
| `DrawImage` | Draw gallery images |
| `Token` | Purchased tickets |
| `Payment` | Payment records |
| `Notification` | User notifications |

> When users signup, login, or buy tokens on the site, new documents appear here automatically.

### Option A — Docker (local)

```bash
npm run db:mongo:up
npm run db:push
npm run db:seed
```

### Option B — MongoDB Atlas (cloud, free tier)

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Copy your connection string
3. Set in `.env`:
   ```
   DATABASE_URL="mongodb+srv://USER:PASSWORD@cluster.mongodb.net/dream_dubai?retryWrites=true&w=majority"
   ```
4. Run:
   ```bash
   npm run db:push
   npm run db:seed
   ```

> **Note:** Transactions (payments, draw runs) require a MongoDB replica set. Docker setup and Atlas both support this automatically.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
copy .env.example .env

# Setup database (MongoDB required)
npm run db:mongo:up
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Accounts

| Role  | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | admin@dreamdubai.ae    | admin123  |
| User  | user@example.com       | user123   |

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `DATABASE_URL` - MongoDB connection string (local Docker or MongoDB Atlas)
- `JWT_SECRET` - Session signing secret
- `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe payments
- `SMTP_*` - Email notifications
- `SMS_API_KEY` - SMS notifications
- `CRON_SECRET` - Automated draw cron job auth

## Automated Draws

Draws run automatically when:
1. All tokens are sold, OR
2. The countdown/end date is reached

Trigger via cron:
```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" http://localhost:3000/api/cron/run-draws
```

Or manually from Admin Panel → "Run Draw"

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: Prisma + MongoDB
- **Auth**: JWT with httpOnly cookies
- **Payments**: Stripe Checkout
- **Security**: bcrypt password hashing, SHA-256 draw randomness

## Project Structure

```
src/
├── app/              # Pages and API routes
├── components/       # UI components
└── lib/              # Auth, draw engine, notifications, stripe
prisma/
├── schema.prisma     # MongoDB schema
src/scripts/
└── seed.ts           # Demo data
```

## License

Private - Dream Dubai Platform
