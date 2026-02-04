"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createOrUpdateProfile } from "@/app/actions/profile";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { Profile } from "@/lib/domain/profile";

interface ProfileFormProps {
    profile?: Profile | null;
}

const initialState = { error: null as string | null };

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            fullWidth
            isLoading={pending}
            loadingText={isEditing ? "Saving…" : "Creating profile…"}
        >
            {isEditing ? "Save profile" : "Create profile"}
        </Button>
    );
}

function UploadStatus({ show, label }: { show: boolean; label: string }) {
    const { pending } = useFormStatus();
    if (!pending || !show) return null;
    return <p className="mt-2 text-sm text-neutral-900">Uploading {label.toLowerCase()}…</p>;
}

export function ProfileForm({ profile }: ProfileFormProps) {
    const [state, formAction] = useFormState(createOrUpdateProfile, initialState);
    const isEditing = Boolean(profile);
    const [photoName, setPhotoName] = useState<string | null>(null);
    const [resumeName, setResumeName] = useState<string | null>(null);

    return (
        <form action={formAction} className="mt-8 space-y-10">
            {state?.error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {state.error}
                </div>
            )}

            <section className="space-y-6">
                <div>
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-900">Professional identity</h2>
                    <p className="mt-1 text-sm text-neutral-500">
                        Introduce yourself as you would to a recruiter meeting you for the first time.
                    </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <Input
                        label="Full name"
                        name="fullName"
                        defaultValue={profile?.fullName}
                        placeholder="Jane Smith"
                        required
                        minLength={2}
                        maxLength={100}
                    />
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        defaultValue={profile?.email}
                        placeholder="jane@university.edu"
                        required
                        pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                        title="Enter a valid email address"
                    />
                </div>
            </section>

            <section className="space-y-6">
                <div>
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-900">Academic details</h2>
                    <p className="mt-1 text-sm text-neutral-900">
                        Share where you&apos;re studying so recruiters can quickly place your background.
                    </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <Input
                        label="University"
                        name="university"
                        defaultValue={profile?.university || "BITS Pilani, Dubai Campus"}
                        placeholder="BITS Pilani, Dubai Campus"
                    />
                    <Input
                        label="Degree / Major"
                        name="degree"
                        defaultValue={profile?.degree}
                        placeholder="Computer Science, B.S."
                        maxLength={120}
                    />
                    <Input
                        label="Graduation year"
                        name="graduationYear"
                        defaultValue={profile?.graduationYear}
                        placeholder="2025"
                        minLength={4}
                        maxLength={4}
                        pattern="[0-9]{4}"
                        title="Enter a 4-digit year (e.g. 2025)"
                        inputMode="numeric"
                    />
                </div>
            </section>

            <section className="space-y-6">
                <div>
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-900">Skills & story</h2>
                    <p className="mt-1 text-sm text-neutral-900">
                        Highlight what you&apos;re great at and where you want to grow next.
                    </p>
                </div>
                <Input
                    label="Skills"
                    name="skills"
                    defaultValue={profile?.skills.join(", ")}
                    placeholder="Product design, React, Figma, UX research"
                    maxLength={500}
                />
                <p className="text-xs text-neutral-900">Separate skills with commas so we can feature them as tags.</p>
                <Textarea
                    label="Short bio"
                    name="bio"
                    defaultValue={profile?.bio}
                    placeholder="Share a quick summary of your background, focus areas, and what you want to work on next."
                    rows={4}
                    maxLength={1000}
                />
            </section>

            <section className="space-y-6">
                <div>
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Resume & photo</h2>
                    <p className="mt-1 text-sm text-neutral-900">
                        Your photo helps recruiters remember you. Your resume lets them dive deeper after the event.
                    </p>
                </div>
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-neutral-900">Profile photo</label>
                    <p className="text-xs text-neutral-900">Use a clear, professional headshot. JPG or PNG up to 5 MB.</p>
                    <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        onChange={(event) => setPhotoName(event.target.files?.[0]?.name ?? null)}
                        className="mt-3 w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm text-neutral-900 file:mr-4 file:rounded file:border-0 file:bg-neutral-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-neutral-900"
                    />
                    {photoName ? (
                        <p className="mt-1 text-sm text-neutral-900">Ready to upload: {photoName}</p>
                    ) : profile?.photoUrl ? (
                        <p className="mt-1 text-sm text-neutral-900">Current photo on file. Upload to replace.</p>
                    ) : null}
                    <UploadStatus show={Boolean(photoName)} label="photo" />
                </div>
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-neutral-900">Resume (PDF)</label>
                    <p className="text-xs text-neutral-900">Upload a PDF so recruiters can review or download it after scanning.</p>
                    <input
                        type="file"
                        name="resume"
                        accept=".pdf,application/pdf"
                        onChange={(event) => setResumeName(event.target.files?.[0]?.name ?? null)}
                        className="mt-3 w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm text-neutral-900 file:mr-4 file:rounded file:border-0 file:bg-neutral-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-neutral-900"
                    />
                    {resumeName ? (
                        <p className="mt-1 text-sm text-neutral-900">Ready to upload: {resumeName}</p>
                    ) : profile?.resumeUrl ? (
                        <p className="mt-1 text-sm text-neutral-900">Current resume on file. Upload to replace.</p>
                    ) : null}
                    <UploadStatus show={Boolean(resumeName)} label="resume" />
                </div>
            </section>

            <SubmitButton isEditing={isEditing} />
        </form>
    );
}
