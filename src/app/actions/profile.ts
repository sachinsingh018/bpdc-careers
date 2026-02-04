"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getStudentSession } from "@/lib/auth/session";
import { profileRepository } from "@/lib/repositories";
import { fileStorage } from "@/lib/file-storage";
import type { Profile } from "@/lib/domain/profile";

interface ProfileFormState {
  error: string | null;
}

export async function createOrUpdateProfile(
  _prevState: ProfileFormState | null,
  formData: FormData
) {
  const studentId = await getStudentSession();
  if (!studentId) {
    redirect("/login");
  }

  const fullName = formData.get("fullName")?.toString()?.trim() ?? "";
  const email = formData.get("email")?.toString()?.trim() ?? "";
  const university = formData.get("university")?.toString()?.trim() ?? "";
  const degree = formData.get("degree")?.toString()?.trim() ?? "";
  const graduationYear = formData.get("graduationYear")?.toString()?.trim() ?? "";
  const bio = formData.get("bio")?.toString()?.trim() ?? "";
  const skillsInput = formData.get("skills")?.toString()?.trim() ?? "";
  const skills = skillsInput
    ? skillsInput.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  if (!fullName || !email) {
    return { error: "Full name and email are required" };
  }

  const photoFile = formData.get("photo") as File | null;
  const resumeFile = formData.get("resume") as File | null;

  const existingProfile = await profileRepository.findByStudentId(studentId);
  const profileId = existingProfile?.id ?? crypto.randomUUID();
  const now = new Date();

  let photoUrl = existingProfile?.photoUrl ?? "";
  let resumeUrl = existingProfile?.resumeUrl ?? "";

  if (photoFile && photoFile.size > 0) {
    photoUrl = await fileStorage.uploadPhoto(photoFile, `${profileId}-photo`);
  }
  if (resumeFile && resumeFile.size > 0) {
    resumeUrl = await fileStorage.uploadResume(resumeFile, `${profileId}-resume`);
  }

  const profile: Profile = {
    id: profileId,
    studentId,
    fullName,
    email,
    university,
    degree,
    graduationYear,
    skills,
    bio,
    photoUrl,
    resumeUrl,
    createdAt: existingProfile?.createdAt ?? now,
    updatedAt: now,
  };

  if (existingProfile) {
    await profileRepository.update(profile);
  } else {
    await profileRepository.save(profile);
  }

  revalidatePath("/", "layout");
  const nextUrl = existingProfile ? "/dashboard?updated=1" : "/dashboard?welcome=1";
  redirect(nextUrl);
}

export async function getMyProfile() {
  const studentId = await getStudentSession();
  if (!studentId) return null;
  return profileRepository.findByStudentId(studentId);
}

export async function getProfileById(profileId: string) {
  return profileRepository.findById(profileId);
}
