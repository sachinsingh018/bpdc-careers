import { notFound } from "next/navigation";
import { getProfileById } from "@/app/actions/profile";
import { ProfileView } from "@/components/profile/ProfileView";

export default async function PublicProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const profile = await getProfileById(id);
  if (!profile) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6 sm:py-10">
      <ProfileView profile={profile} />
    </div>
  );
}
