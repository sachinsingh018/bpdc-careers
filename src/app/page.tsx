import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthContext } from "@/lib/guards";
import { Button } from "@/components/ui/Button";

export default async function HomePage() {
  const { hasProfile } = await getAuthContext();
  if (hasProfile) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <p className="text-4xl font-bold text-neutral-900 sm:text-5xl">BPDC Career Profile</p>
      <h1 className="mt-8 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
        Your Career Profile in One Scan
      </h1>
      <p className="mt-6 text-lg text-neutral-600">
        Create a digital profile with your photo and resume. Recruiters at career events scan your
        QR code to view your profile instantly—no business cards needed.
      </p>
      <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Link href="/signup">
          <Button fullWidth className="min-w-[180px]">
            Create Profile
          </Button>
        </Link>
        <Link href="/scan">
          <Button variant="secondary" fullWidth className="min-w-[180px]">
            Scan Others
          </Button>
        </Link>
      </div>
    </div>
  );
}
