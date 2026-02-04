/**
 * Server-side route guards
 * Use in page/layout server components
 */
import { redirect } from "next/navigation";
import { getStudentSession } from "@/lib/auth/session";
import { getMyProfile } from "@/app/actions/profile";
import type { Profile } from "@/lib/domain/profile";

export async function requireAuth(): Promise<string> {
  const studentId = await getStudentSession();
  if (!studentId) redirect("/login");
  return studentId;
}

export async function requireProfile(): Promise<Profile> {
  const studentId = await requireAuth();
  const profile = await getMyProfile();
  if (!profile || profile.studentId !== studentId) redirect("/profile/create");
  return profile;
}

export async function requireNoProfile(): Promise<string> {
  const studentId = await requireAuth();
  const profile = await getMyProfile();
  if (profile) redirect("/dashboard");
  return studentId;
}

export async function getAuthContext(): Promise<{
  studentId: string | null;
  profile: Profile | null;
  hasProfile: boolean;
}> {
  const studentId = await getStudentSession();
  if (!studentId) return { studentId: null, profile: null, hasProfile: false };
  const profile = await getMyProfile();
  const hasProfile = !!profile && profile.studentId === studentId;
  return { studentId, profile: hasProfile ? profile : null, hasProfile };
}

