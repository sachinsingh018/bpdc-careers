-- Create the careers database in Neon
-- Run against neondb first: psql 'postgresql://.../neondb?sslmode=require' -f scripts/create-careers-db.sql
-- (Use your Neon connection string; replace /neondb with the db you're connected to)
-- If careers already exists, this will error - that's fine.

CREATE DATABASE careers;
