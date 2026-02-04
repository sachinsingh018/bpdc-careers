import Link from "next/link";
import { headers } from "next/headers";
import { requireProfile } from "@/lib/guards";
import { Button } from "@/components/ui/Button";
import { QRCodeDisplay } from "@/components/dashboard/QRCodeDisplay";

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  const headersList = headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host") ?? "localhost:3000";
  const proto = headersList.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export default async function MePage() {
  const profile = await requireProfile();
  const profileUrl = `${getBaseUrl()}/p/${profile.id}`;
  const photoSrc = profile.photoUrl
    ? profile.photoUrl.startsWith("data:")
      ? profile.photoUrl
      : `${profile.photoUrl}${profile.photoUrl.includes("?") ? "&" : "?"}v=${profile.updatedAt?.getTime() ?? Date.now()}`
    : "";

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-3xl border border-neutral-100 bg-white p-10 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)]">
        <div className="flex flex-col items-center">
          {/* Round profile picture 80–120px */}
          <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-neutral-100 bg-neutral-100 ring-4 ring-white shadow-sm">
            {photoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoSrc}
                alt={profile.fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-4xl font-light text-neutral-400">
                {profile.fullName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Name below picture */}
          <h1 className="mt-6 text-xl font-semibold tracking-tight text-neutral-900">
            {profile.fullName}
          </h1>

          {/* QR code below name */}
          <div className="mt-6">
            <QRCodeDisplay url={profileUrl} size={180} compact />
          </div>

          {/* Small help text under QR */}
          <p className="mt-2 text-sm text-neutral-500">Scan to view my profile</p>

          {/* Buttons row */}
          <div className="mt-10 flex w-full flex-col gap-3">
            <Link href={`/p/${profile.id}`} target="_blank" rel="noopener noreferrer">
              <Button fullWidth>Preview Public Profile</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="secondary" fullWidth>
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

