# Store Rating System

A full-stack store rating application with role-based access control (RBAC). Built as an internship assignment with production-quality architecture.

## Features

### Authentication
- Login / Signup / Logout
- JWT-based authentication
- Change password

### System Administrator
- Dashboard with total users, stores, and ratings
- Add users and stores
- View user and store details
- Search, filter, and sort users/stores

### Normal User
- Signup and login
- Browse and search stores
- Submit and update ratings (1-5 stars)
- Change password

### Store Owner
- Dashboard with average ratings
- View list of users who rated their stores
- Change password

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React (Vite), Tailwind CSS, React Router, Axios, React Hook Form, Zod |
| Backend | Express.js, Prisma ORM, PostgreSQL, JWT, bcrypt, Zod |
| DevOps | Docker Compose (optional) |

## Project Structure

```
store-rating-system/
├── backend/
│   ├── prisma/          # Schema, migrations, seed
│   └── src/
│       ├── config/      # DB & env config
│       ├── controllers/ # Route handlers
│       ├── middleware/  # Auth, validation, errors
│       ├── routes/      # API routes
│       ├── services/    # Business logic
│       ├── utils/       # JWT, password helpers
│       └── validators/  # Zod schemas
├── frontend/
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── contexts/  # Auth context
│       ├── hooks/     # Custom hooks
│       ├── pages/     # Role-based pages
│       ├── services/  # API client
│       └── utils/     # Validation & error helpers
└── docker-compose.yml # PostgreSQL container
```

## Database Schema

```
User (id, name, email, password, address, role)
  ├── owns → Store[]
  └── rates → Rating[]

Store (id, name, email, address, ownerId)
  └── has → Rating[]

Rating (id, rating, userId, storeId)
  └── UNIQUE(userId, storeId) — one rating per user per store
```

## Prerequisites

- Node.js 18+
- PostgreSQL 15+ (or Docker)
- npm

## Setup Guide

### 1. Clone the repository

```bash
git clone https://github.com/adarsh06261/store-rating-system.git
cd store-rating-system
```

### 2. Install dependencies

```bash
npm run install:all
```

### 3. Start PostgreSQL

**Option A — Docker (recommended):**

```bash
docker compose up -d
```

**Option B — Local PostgreSQL:**

```bash
createdb store_rating_db
```

### 4. Configure environment

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your database URL:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/store_rating_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=5001
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

> **Note:** Port 5001 is used because macOS AirPlay Receiver occupies port 5000.

### 5. Run database migrations and seed

```bash
cd backend
npm run db:migrate
npm run db:seed
```

### 6. Start the application

From the project root:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5001/api/health

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@store.com | Admin@123 |
| Store Owner | owner1@store.com | Owner@1234 |
| Normal User | user1@example.com | User@12345 |

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register as normal user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| PUT | `/api/auth/change-password` | Change password |
| GET | `/api/auth/profile` | Get current user |

### Admin (requires ADMIN role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard/stats` | Dashboard statistics |
| GET | `/api/admin/users` | List users (search, filter, sort) |
| POST | `/api/admin/users` | Create user |
| GET | `/api/admin/users/:id` | User details |
| GET | `/api/admin/stores` | List stores (search, filter, sort) |
| POST | `/api/admin/stores` | Create store |
| GET | `/api/admin/stores/:id` | Store details |
| GET | `/api/admin/store-owners` | List store owners |

### User (requires USER role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stores` | Browse stores |
| GET | `/api/stores/:id` | Store details |
| POST | `/api/ratings/stores/:storeId` | Submit rating |
| PUT | `/api/ratings/stores/:storeId` | Update rating |

### Store Owner (requires STORE_OWNER role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/owner/dashboard` | Owner dashboard |

## Validations

| Field | Rules |
|-------|-------|
| Name | 20-60 characters |
| Password | 8-16 chars, 1 uppercase, 1 special character |
| Email | Standard email validation |
| Address | Max 400 characters |
| Rating | 1-5 (integer) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm run dev:frontend` | Start frontend only |
| `npm run dev:backend` | Start backend only |
| `npm run build` | Build frontend for production |
| `npm run db:migrate` | Run Prisma migrations (in backend/) |
| `npm run db:seed` | Seed demo data (in backend/) |
| `npm run db:studio` | Open Prisma Studio (in backend/) |

## License

MIT
