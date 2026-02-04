import { requireNoProfile } from "@/lib/guards";
import { ProfileForm } from "@/components/profile/ProfileForm";

export default async function CreateProfilePage() {
  await requireNoProfile();

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Create your profile</h1>
      <p className="mt-2 text-neutral-600">
        Fill in your details once. You&apos;ll get a QR code to share with recruiters at events.
      </p>
      <div className="mt-10">
        <ProfileForm />
      </div>
    </div>
  );
}

