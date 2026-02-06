-- Add password support to students table
-- Run: psql $DATABASE_URL -f scripts/add-password-migration.sql
-- Or run in Neon SQL Editor

ALTER TABLE students ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) DEFAULT NULL;

-- Existing users will have password_hash = NULL.
-- They must use "Set password" or create a new account.
