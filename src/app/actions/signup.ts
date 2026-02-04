"use server";

import { userRepository } from "@/lib/repositories";

export async function signup(_prevState: { error: string } | null, formData: FormData) {
  const email = formData.get("email")?.toString()?.trim();
  if (!email) {
    return { error: "Email is required" };
  }
  const existing = await userRepository.findByEmail(email);
  if (existing) {
    return { error: "An account with this email already exists. Please log in." };
  }
  const student = {
    id: crypto.randomUUID(),
    email,
    createdAt: new Date(),
  };
  await userRepository.save(student);
  return null;
}
