-- Career Profile DB schema for Amazon RDS (MySQL/Aurora)
-- Run: mysql -h <host> -u admin -p < scripts/schema.sql

CREATE DATABASE IF NOT EXISTS bpdc;
USE bpdc;

CREATE TABLE IF NOT EXISTS students (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);

CREATE TABLE IF NOT EXISTS profiles (
  id VARCHAR(36) PRIMARY KEY,
  student_id VARCHAR(36) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  university VARCHAR(255) DEFAULT '',
  degree VARCHAR(255) DEFAULT '',
  graduation_year VARCHAR(20) DEFAULT '',
  skills JSON DEFAULT ('[]'),
  bio TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  resume_url TEXT DEFAULT '',
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY uk_student_id (student_id),
  CONSTRAINT fk_profile_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE INDEX idx_profiles_student_id ON profiles(student_id);
