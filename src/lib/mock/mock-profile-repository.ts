/**
 * Mock Profile Repository - in-memory only (used when DATABASE_URL is not set)
 */
import type { Profile } from "@/lib/domain/profile";
import type { ProfileRepository } from "@/lib/persistence/profile-repository";

const profiles = new Map<string, Profile>();
const profilesByStudentId = new Map<string, string>();

export const mockProfileRepository: ProfileRepository = {
  async findById(id: string): Promise<Profile | null> {
    return profiles.get(id) ?? null;
  },
  async findByStudentId(studentId: string): Promise<Profile | null> {
    const profileId = profilesByStudentId.get(studentId);
    return profileId ? profiles.get(profileId) ?? null : null;
  },
  async save(profile: Profile): Promise<Profile> {
    profiles.set(profile.id, profile);
    profilesByStudentId.set(profile.studentId, profile.id);
    return profile;
  },
  async update(profile: Profile): Promise<Profile> {
    profiles.set(profile.id, profile);
    return profile;
  },
};
