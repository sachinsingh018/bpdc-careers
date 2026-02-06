-- Career Profile DB schema for Neon (PostgreSQL)
-- Run after creating the careers database:
--   psql $DATABASE_URL -f scripts/schema.sql
-- Or in Neon SQL Editor, select the careers database and run this.

CREATE TABLE IF NOT EXISTS students (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  id VARCHAR(36) PRIMARY KEY,
  student_id VARCHAR(36) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  university VARCHAR(255) DEFAULT '',
  degree VARCHAR(255) DEFAULT '',
  graduation_year VARCHAR(20) DEFAULT '',
  skills JSONB DEFAULT '[]',
  bio TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  resume_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_id)
);

CREATE INDEX IF NOT EXISTS idx_profiles_student_id ON profiles(student_id);
