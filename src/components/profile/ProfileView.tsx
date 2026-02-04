import type { Profile } from "@/lib/domain/profile";

interface ProfileViewProps {
  profile: Profile;
}

function cacheBust(url: string, updatedAt: Date | string | undefined): string {
  if (!url || url.startsWith("data:")) return url;
  const sep = url.includes("?") ? "&" : "?";
  const ts = updatedAt ? new Date(updatedAt).getTime() : Date.now();
  return `${url}${sep}v=${ts}`;
}

export function ProfileView({ profile }: ProfileViewProps) {
  const photoUrl = profile.photoUrl ? cacheBust(profile.photoUrl, profile.updatedAt) : "";
  const resumeUrl = profile.resumeUrl ? cacheBust(profile.resumeUrl, profile.updatedAt) : "";

  return (
    <article className="rounded-xl border border-neutral-200 bg-white shadow-sm">
      {/* Photo - prominent, top */}
      <div className="relative aspect-square w-full overflow-hidden rounded-t-xl bg-neutral-100">
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt={`${profile.fullName} photo`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-6xl font-light text-neutral-300">
            {profile.fullName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="p-6 sm:p-8">
        <h1 className="text-2xl font-semibold text-neutral-900">{profile.fullName}</h1>
        <p className="mt-1 text-neutral-600">{profile.degree}</p>
        {profile.university && (
          <p className="text-neutral-500">{profile.university}</p>
        )}
        {profile.graduationYear && (
          <p className="text-sm text-neutral-500">Class of {profile.graduationYear}</p>
        )}

        {profile.bio && (
          <p className="mt-6 text-base leading-relaxed text-neutral-700">{profile.bio}</p>
        )}

        {profile.skills.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-medium text-neutral-500">Skills</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-6 py-3 text-base font-medium text-neutral-900 hover:bg-neutral-50"
          >
            Email {profile.fullName.split(" ")[0]}
          </a>
          {resumeUrl && (
            <a
              href={resumeUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-6 py-3 text-base font-medium text-white hover:bg-neutral-800"
            >
              Download resume
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
