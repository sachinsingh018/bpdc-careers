import Link from "next/link";
import { headers } from "next/headers";
import { requireProfile } from "@/lib/guards";
import { Button } from "@/components/ui/Button";
import { QRCodeDisplay } from "@/components/dashboard/QRCodeDisplay";
import { ProfileForm } from "@/components/profile/ProfileForm";

function getBaseUrl() {
    if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
    const headersList = headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host") ?? "localhost:3000";
    const proto = headersList.get("x-forwarded-proto") ?? "http";
    return `${proto}://${host}`;
}

export default async function DashboardPage({
    searchParams,
}: {
    searchParams?: Record<string, string | string[] | undefined>;
}) {
    const profile = await requireProfile();
    const profileUrl = `${getBaseUrl()}/p/${profile.id}`;
    const showSuccess = searchParams?.welcome === "1" || searchParams?.updated === "1";
    const resumeUrl = profile.resumeUrl
        ? profile.resumeUrl.startsWith("data:")
            ? profile.resumeUrl
            : `${profile.resumeUrl}${profile.resumeUrl.includes("?") ? "&" : "?"}v=${profile.updatedAt?.getTime() ?? Date.now()}`
        : null;
    const photoSrc = profile.photoUrl
        ? profile.photoUrl.startsWith("data:")
            ? profile.photoUrl
            : `${profile.photoUrl}${profile.photoUrl.includes("?") ? "&" : "?"}v=${profile.updatedAt?.getTime() ?? Date.now()}`
        : null;

    return (
        <div className="mx-auto max-w-2xl px-4 py-10">
            {showSuccess && (
                <p className="mb-8 rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-800">
                    Your profile is ready. Share your QR code with recruiters at events.
                </p>
            )}

            {/* Profile card - picture at top, name, resume link */}
            <div className="rounded-2xl border border-neutral-100 bg-white p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)]">
                <div className="flex flex-col items-center text-center">
                    <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-neutral-100 bg-neutral-100 ring-2 ring-white shadow-md">
                        {photoSrc ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={photoSrc}
                                alt={profile.fullName}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span className="flex h-full w-full items-center justify-center text-3xl font-medium text-neutral-400">
                                {profile.fullName.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <h1 className="mt-4 text-xl font-semibold text-neutral-900">{profile.fullName}</h1>
                    {profile.degree && (
                        <p className="mt-1 text-sm text-neutral-500">{profile.degree}</p>
                    )}
                    {resumeUrl && (
                        <a
                            href={resumeUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download my resume
                        </a>
                    )}
                </div>

                {/* Quick actions */}
                <div className="mt-10 flex flex-wrap justify-center gap-3">
                    <Link href="/me">
                        <Button variant="secondary">My Card</Button>
                    </Link>
                    <Link href="/scan">
                        <Button variant="secondary">Scan Others</Button>
                    </Link>
                </div>
            </div>

            {/* QR preview */}
            <div className="mt-8 rounded-2xl border border-neutral-100 bg-neutral-50/50 p-6">
                <p className="text-center text-sm font-medium text-neutral-600">Your QR code</p>
                <div className="mt-4 flex justify-center">
                    <QRCodeDisplay url={profileUrl} name={profile.fullName} size={140} />
                </div>
                <p className="mt-3 text-center text-xs text-neutral-500">
                    Recruiters scan this to view your full profile
                </p>
            </div>

            {/* Edit profile form */}
            <div className="mt-10 rounded-2xl border border-neutral-100 bg-white p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)]">
                <h2 className="text-lg font-semibold text-neutral-900">Edit your profile</h2>
                <p className="mt-1 text-sm text-neutral-600">
                    Update your details below. Changes will appear when recruiters scan your QR code.
                </p>
                <ProfileForm profile={profile} />
            </div>
        </div>
    );
}
