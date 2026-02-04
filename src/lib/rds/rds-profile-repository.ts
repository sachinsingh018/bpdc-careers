/**
 * RDS Profile Repository
 * Implements ProfileRepository using Amazon RDS (MySQL/Aurora)
 */
import { query } from "@/lib/db/connection";
import type { Profile } from "@/lib/domain/profile";
import type { ProfileRepository } from "@/lib/persistence/profile-repository";

interface ProfileRow {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  university: string;
  degree: string;
  graduation_year: string;
  skills: string;
  bio: string;
  photo_url: string;
  resume_url: string;
  created_at: Date;
  updated_at: Date;
}

function rowToProfile(row: ProfileRow): Profile {
  const skills = typeof row.skills === "string" ? JSON.parse(row.skills || "[]") : row.skills ?? [];
  return {
    id: row.id,
    studentId: row.student_id,
    fullName: row.full_name,
    email: row.email,
    university: row.university ?? "",
    degree: row.degree ?? "",
    graduationYear: row.graduation_year ?? "",
    skills: Array.isArray(skills) ? skills : [],
    bio: row.bio ?? "",
    photoUrl: row.photo_url ?? "",
    resumeUrl: row.resume_url ?? "",
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export const rdsProfileRepository: ProfileRepository = {
  async findById(id: string): Promise<Profile | null> {
    const rows = await query<ProfileRow[]>("SELECT * FROM profiles WHERE id = ?", [id]);
    return rows[0] ? rowToProfile(rows[0]) : null;
  },

  async findByStudentId(studentId: string): Promise<Profile | null> {
    const rows = await query<ProfileRow[]>("SELECT * FROM profiles WHERE student_id = ?", [studentId]);
    return rows[0] ? rowToProfile(rows[0]) : null;
  },

  async save(profile: Profile): Promise<Profile> {
    await query(
      `INSERT INTO profiles (id, student_id, full_name, email, university, degree, graduation_year, skills, bio, photo_url, resume_url, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        profile.id,
        profile.studentId,
        profile.fullName,
        profile.email,
        profile.university,
        profile.degree,
        profile.graduationYear,
        JSON.stringify(profile.skills),
        profile.bio,
        profile.photoUrl,
        profile.resumeUrl,
        profile.createdAt,
        profile.updatedAt,
      ]
    );
    return profile;
  },

  async update(profile: Profile): Promise<Profile> {
    await query(
      `UPDATE profiles SET full_name=?, email=?, university=?, degree=?, graduation_year=?, skills=?, bio=?, photo_url=?, resume_url=?, updated_at=? WHERE id=?`,
      [
        profile.fullName,
        profile.email,
        profile.university,
        profile.degree,
        profile.graduationYear,
        JSON.stringify(profile.skills),
        profile.bio,
        profile.photoUrl,
        profile.resumeUrl,
        profile.updatedAt,
        profile.id,
      ]
    );
    return profile;
  },
};
