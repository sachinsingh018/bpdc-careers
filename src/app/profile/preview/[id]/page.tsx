import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/guards";
import { ProfileView } from "@/components/profile/ProfileView";

export default async function ProfilePreviewPage({
  params,
}: {
  params: { id: string };
}) {
  const profile = await requireProfile();
  if (profile.id !== params.id) {
    redirect("/me");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <p className="mb-6 text-center text-sm text-neutral-500">
        This is how recruiters will see your profile
      </p>
      <ProfileView profile={profile} />
    </div>
  );
}
