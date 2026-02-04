import { redirect } from "next/navigation";
import { getStudentSession } from "@/lib/auth/session";

export default async function NewProfilePage() {
  const studentId = await getStudentSession();
  if (!studentId) {
    redirect("/login");
  }

  redirect("/profile/create");
}
