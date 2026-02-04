/**
 * Domain model: Profile
 * Represents a student's public career profile (visible to recruiters via QR)
 */
export interface Profile {
  id: string; // UUID - non-guessable, used in profile URL
  studentId: string;
  fullName: string;
  email: string;
  university: string;
  degree: string;
  graduationYear: string;
  skills: string[];
  bio: string;
  photoUrl: string; // TODO: S3 URL when AWS integration added
  resumeUrl: string; // TODO: S3 URL when AWS integration added
  createdAt: Date;
  updatedAt: Date;
}
