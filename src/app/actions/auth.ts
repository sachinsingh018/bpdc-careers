"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { userRepository } from "@/lib/repositories";
import { profileRepository } from "@/lib/repositories";
import { setStudentSession } from "@/lib/auth/session";

export async function login(_prevState: { error: string } | null, formData: FormData) {
  const email = formData.get("email")?.toString()?.trim();
  if (!email) {
    return { error: "Email is required" };
  }
  const student = await userRepository.findByEmail(email);
  if (!student) {
    return { error: "No account found with this email. Please sign up first." };
  }
  await setStudentSession(student.id);
  revalidatePath("/", "layout");
  const profile = await profileRepository.findByStudentId(student.id);
  redirect(profile ? "/dashboard" : "/profile/create");
}
