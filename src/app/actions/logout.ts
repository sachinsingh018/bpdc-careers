"use server";

import { redirect } from "next/navigation";
import { clearStudentSession } from "@/lib/auth/session";

export async function logout() {
  await clearStudentSession();
  redirect("/");
}
