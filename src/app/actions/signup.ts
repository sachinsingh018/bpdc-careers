"use server";

import { hash } from "bcryptjs";
import { userRepository } from "@/lib/repositories";

const MIN_PASSWORD_LENGTH = 8;

export async function signup(_prevState: { error: string } | null, formData: FormData) {
  const email = formData.get("email")?.toString()?.trim();
  const password = formData.get("password")?.toString() ?? "";

  if (!email) {
    return { error: "Email is required" };
  }
  if (!password) {
    return { error: "Password is required" };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { error: "Password must be at least 8 characters" };
  }

  const existing = await userRepository.findByEmailForAuth(email);
  if (existing) {
    if (existing.passwordHash) {
      return { error: "An account with this email already exists. Please sign in." };
    }
    // Legacy user without password - set password
    const passwordHash = await hash(password, 12);
    await userRepository.updatePassword(existing.id, passwordHash);
    return null;
  }

  const passwordHash = await hash(password, 12);
  const student = {
    id: crypto.randomUUID(),
    email,
    createdAt: new Date(),
  };
  await userRepository.save(student, passwordHash);
  return null;
}
