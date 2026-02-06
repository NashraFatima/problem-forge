# DevThon 2026 - Problem Statement Portal

> A production-grade hackathon problem statement management platform by **DevUp Society**

## 🚀 Overview

DevThon 2026 is a comprehensive platform for managing hackathon problem statements. It enables organizations to submit real-world challenges, and provides a seamless experience for hackathon participants to browse and select problems.

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TanStack Query** - Data fetching & caching
- **React Router DOM** - Client-side routing
- **Radix UI** - Accessible components
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **Sonner** - Toast notifications

### Backend

- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Zod** - Validation
- **Winston** - Logging

## 📁 Project Structure

```
problem-forge/
├── src/                    # Frontend source
│   ├── components/         # Reusable components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom hooks
│   ├── layouts/            # Page layouts
│   ├── lib/                # Utilities & API client
│   ├── pages/              # Page components
│   └── types/              # TypeScript types
├── server/                 # Backend source
│   ├── src/
│   │   ├── config/         # Configuration
│   │   ├── controllers/    # Route handlers
│   │   ├── database/       # DB connection
│   │   ├── middlewares/    # Express middlewares
│   │   ├── models/         # Mongoose models
│   │   ├── repositories/   # Data access layer
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utilities
│   └── package.json
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.0.0
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd problem-forge
   ```

2. **Install frontend dependencies**

   ```bash
   npm install
   ```

3. **Install backend dependencies**

   ```bash
   cd server
   npm install
   ```

4. **Configure environment variables**

   Frontend (`.env.local`):

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

   Backend (`server/.env`):

   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key_min_32_chars
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:8080,http://localhost:5173
   ```

5. **Seed the database**

   ```bash
   cd server
   npm run seed
   ```

6. **Start the development servers**

   Backend (from `/server`):

   ```bash
   npm run dev
   ```

   Frontend (from root):

   ```bash
   npm run dev
   ```

## 🔐 Default Credentials

After seeding, use these credentials:

| Role         | Email            | Password     |
| ------------ | ---------------- | ------------ |
| Admin        | admin@devup.org  | Admin@123456 |
| Organization | org1@example.com | Password@123 |

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - Register organization
- `POST /api/auth/login/organization` - Organization login
- `POST /api/auth/login/admin` - Admin login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Problems

- `GET /api/problems` - List all approved problems
- `GET /api/problems/:id` - Get problem details
- `POST /api/problems` - Submit new problem (org only)

### Organization

- `GET /api/org/problems` - Get organization's problems
- `GET /api/org/profile` - Get organization profile
- `PUT /api/org/profile` - Update profile

### Admin

- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/problems` - All problems
- `GET /api/admin/problems/pending` - Pending problems
- `PATCH /api/admin/problems/:id/status` - Approve/reject
- `GET /api/admin/organizations` - All organizations
- `PATCH /api/admin/organizations/:id/verify` - Verify org
- `GET /api/admin/audit-logs` - Audit logs

## 🏗️ Production Build

### Frontend

```bash
npm run build
```

### Backend

```bash
cd server
npm run build
npm start
```

## 📝 Scripts

### Frontend

- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

### Backend

- `npm run dev` - Start dev server with hot reload
- `npm run build` - Compile TypeScript
- `npm start` - Start production server
- `npm run seed` - Seed database

## 🔒 Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting
- Helmet security headers
- CORS configuration
- Input validation with Zod
- Audit logging

## 👥 Roles & Permissions

| Feature                 | Public | Organization | Admin |
| ----------------------- | ------ | ------------ | ----- |
| Browse problems         | ✅     | ✅           | ✅    |
| View problem details    | ✅     | ✅           | ✅    |
| Submit problems         | ❌     | ✅           | ❌    |
| Manage own problems     | ❌     | ✅           | ❌    |
| Approve/reject problems | ❌     | ❌           | ✅    |
| Manage organizations    | ❌     | ❌           | ✅    |
| View audit logs         | ❌     | ❌           | ✅    |

## 📄 License

This project is developed for DevThon 2026 by DevUp Society.

---

Made with ❤️ by **DevUp Society**
