# Dompetku Development Setup Guide

## Prerequisites
- Node.js 18+ (recommended 20+)
- npm or yarn
- PostgreSQL 14+ (or Supabase project)
- Supabase account with project created

## Environment Setup

### 1. Configure Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings > API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `Publishable key` → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
3. Go to **Authentication > Providers** and enable:
   - **Email** (default, enabled)
   - **Google OAuth** (add your Google OAuth credentials)

### 2. Configure Database
1. Go to **SQL Editor** in Supabase Console
2. Create database connection for Drizzle (use Pooler URL for better performance):
   - Copy **Connection string** → `DATABASE_URL`
   - Use format: `postgresql://user:password@host:port/database`
3. Save for later use in migrations

### 3. Create `.env.local`
Copy from `.env.example` and fill in your values:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-publishable-key-here"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
DATABASE_URL="postgresql://user:password@your-host:5432/dompetku"
```

## Running Locally

### Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Migrations (When Ready)
```bash
npm run db:generate   # Generate migration from schema changes
npm run db:migrate    # Apply migrations to database
npm run db:studio     # Open Drizzle Studio to inspect database
```

Note: Migrations are not needed until Phase 2 when connecting to live database.

## Project Structure
- `src/app/(auth)/` — Login, Register, Onboarding pages (unauthenticated)
- `src/app/(main)/` — Main app pages (catat, riwayat, laporan, pengaturan)
- `src/components/` — Reusable UI components and layouts
- `src/lib/` — Utilities, Supabase clients, formatters
- `src/db/` — Drizzle schema and database client
- `src/app/actions/` — Server actions for auth and data mutations

## Available Scripts
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run ESLint
npm run db:*      # Database commands (when setup)
```

## Next Steps
1. Setup `.env.local` with Supabase credentials
2. Run `npm run dev` to start the app
3. Navigate to [http://localhost:3000/login](http://localhost:3000/login)
4. Register a new account or login with Google
5. Complete onboarding flow
6. Access the main app at `/catat`

## Troubleshooting

### "DATABASE_URL is not set" error
- This is expected during Phase 1 (auth-only setup)
- Database queries will error, but auth and pages work
- Will be resolved in Phase 2 when database is connected

### Supabase OAuth redirect error
- Ensure `NEXT_PUBLIC_SITE_URL` matches your app URL
- Add redirect URL in Supabase Console: **Authentication > URL Configuration**
  - Development: `http://localhost:3000`
  - Production: `https://your-domain.com`

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

## Contact & Support
For issues or questions about Dompetku, refer to the [PRD.md](PRD.md) for detailed feature requirements.
