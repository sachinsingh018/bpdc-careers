/**
 * Profile Repository Interface
 * Abstract persistence - swap implementation for Amazon RDS later
 */
import type { Profile } from "@/lib/domain/profile";

export interface ProfileRepository {
  findById(id: string): Promise<Profile | null>;
  findByStudentId(studentId: string): Promise<Profile | null>;
  save(profile: Profile): Promise<Profile>;
  update(profile: Profile): Promise<Profile>;
}
