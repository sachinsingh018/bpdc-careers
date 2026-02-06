# Career Profile (ScanFactor-like MVP)

A web app for college career services events. Students create digital profiles with photos and resumes. Recruiters scan QR codes to view candidate profiles instantly.

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS
- Server Actions
- QR generation (qrcode.react) & scanning (html5-qrcode)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                    # Routes & pages
│   ├── actions/            # Server actions (auth, profile)
│   ├── dashboard/          # Student dashboard with QR
│   ├── profile/            # Create, edit, preview
│   ├── p/[id]/             # Public profile (recruiter view)
│   └── scan/               # QR scanner
├── components/             # UI components
├── lib/
│   ├── domain/             # Student, Profile models
│   ├── persistence/        # Repository interfaces
│   ├── storage/            # File storage interface
│   ├── mock/               # Mock implementations
│   └── auth/               # Session management
```

## Database (Neon PostgreSQL)

The app uses Neon for persistence. Set `DATABASE_URL` to enable; otherwise it falls back to an in-memory mock.

**Setup:**

1. Create the `careers` database in Neon (if not exists):
   ```bash
   psql 'postgresql://user:password@host/neondb?sslmode=require' -f scripts/create-careers-db.sql
   ```

2. Run the schema against `careers`:
   ```bash
   psql 'postgresql://user:password@host/careers?sslmode=require' -f scripts/schema.sql
   ```

3. If you have an existing database, run the password migration:
   ```bash
   psql $DATABASE_URL -f scripts/add-password-migration.sql
   ```

4. Add to `.env.local`:
   ```bash
   DATABASE_URL=postgresql://user:password@host/careers?sslmode=require
   ```

## Environment

See `.env.example`. Key variables:

- `DATABASE_URL` – Neon PostgreSQL connection string (use `careers` database)
- Auth uses email + password (bcrypt). New signups require a password; existing users without one can set it by signing up again with the same email.
- `NEXT_PUBLIC_APP_URL` – For QR codes in production
