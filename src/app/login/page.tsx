"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { login } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" fullWidth isLoading={pending} loadingText="Logging in…">
            Log in
        </Button>
    );
}

export default function LoginPage() {
    const [state, formAction] = useFormState(login, null);

    return (
        <div className="mx-auto max-w-md px-4 py-12">
            <h1 className="text-2xl font-semibold text-neutral-900">Log in</h1>
            <p className="mt-2 text-neutral-600">
                Enter your email to access your career profile.
            </p>
            <form action={formAction} className="mt-8 space-y-6">
                {state?.error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {state.error}
                    </div>
                )}
                <Input
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="you@university.edu"
                    required
                    autoComplete="email"
                />
                <SubmitButton />
            </form>
            <p className="mt-6 text-center text-sm text-neutral-600">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-medium text-neutral-900 hover:underline">
                    Sign up
                </Link>
            </p>
        </div>
    );
}
