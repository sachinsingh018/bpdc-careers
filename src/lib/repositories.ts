/**
 * Repository factory - uses RDS when configured, else mock
 * Set DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD to enable RDS
 */
import { getPool } from "@/lib/db/connection";
import { mockUserRepository } from "@/lib/mock/mock-user-repository";
import { mockProfileRepository } from "@/lib/mock/mock-profile-repository";
import { rdsUserRepository } from "@/lib/rds/rds-user-repository";
import { rdsProfileRepository } from "@/lib/rds/rds-profile-repository";
import type { UserRepository } from "@/lib/persistence/user-repository";
import type { ProfileRepository } from "@/lib/persistence/profile-repository";

function useRds(): boolean {
  return getPool() !== null;
}

export const userRepository: UserRepository = useRds() ? rdsUserRepository : mockUserRepository;
export const profileRepository: ProfileRepository = useRds() ? rdsProfileRepository : mockProfileRepository;
