/**
 * Simple session management for MVP
 * Uses cookies - replace with proper auth (e.g. NextAuth) when scaling
 * TODO: Consider JWT or session store for production
 */
import { cookies } from "next/headers";

const SESSION_COOKIE = "bpdc_student_id";

export async function setStudentSession(studentId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, studentId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function getStudentSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  return session?.value ?? null;
}

export async function clearStudentSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
