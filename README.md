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

## AWS Integration (TODO)

The app uses interfaces for persistence and file storage. Replace mock implementations with:

- **Profiles & Users**: Implement `ProfileRepository` and `UserRepository` with Amazon RDS
- **Photos & Resumes**: Implement `FileStorage` with Amazon S3

## Environment

```bash
# QR codes (production)
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Amazon RDS (optional - falls back to in-memory mock if unset)
DATABASE_HOST=database-1.cluster-xxx.us-east-1.rds.amazonaws.com
DATABASE_PORT=3306
DATABASE_USER=admin
DATABASE_PASSWORD=your_password
DATABASE_NAME=bpdc
DATABASE_SSL_CA=/certs/global-bundle.pem   # or ./certs/global-bundle.pem for local
```

**Schema setup:** Run `scripts/schema.sql` against your RDS instance to create tables.

**Password from Secrets Manager:**
```bash
export DATABASE_PASSWORD=$(aws secretsmanager get-secret-value --secret-id 'arn:aws:secretsmanager:us-east-1:937590957308:secret:rds!cluster-8dbff0be-67d2-436f-9fa5-217fe60649fd-voUV6P' --query SecretString --output text | jq -r '.password')
```

**S3 (optional - falls back to in-memory base64 if unset):**
```bash
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=eu-north-1
AWS_DEFAULT_REGION=eu-north-1
S3_BUCKET_NAME=bits-career-event
```

**SSL:** Download the RDS CA bundle for SSL:
```bash
mkdir -p certs && curl -o certs/global-bundle.pem https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem
```
