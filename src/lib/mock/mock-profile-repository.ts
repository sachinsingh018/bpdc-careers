/**
 * Mock Profile Repository
 * File-backed storage so data survives dev server restarts
 * TODO: Replace with Amazon RDS implementation - use ProfileRepository interface
 */
import type { Profile } from "@/lib/domain/profile";
import type { ProfileRepository } from "@/lib/persistence/profile-repository";
import { loadProfiles, saveProfiles } from "./mock-store";

let { byId: profiles, byStudentId: profilesByStudentId } = loadProfiles();

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
    saveProfiles(profiles, profilesByStudentId);
    return profile;
  },
  async update(profile: Profile): Promise<Profile> {
    profiles.set(profile.id, profile);
    saveProfiles(profiles, profilesByStudentId);
    return profile;
  },
};
