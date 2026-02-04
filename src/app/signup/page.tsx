"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { signup } from "@/app/actions/signup";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" fullWidth isLoading={pending} loadingText="Creating account…">
            Sign up
        </Button>
    );
}

export default function SignupPage() {
    const [state, formAction] = useFormState(signup, null);

    return (
        <div className="mx-auto max-w-md px-4 py-12">
            <h1 className="text-2xl font-semibold text-neutral-900">Create account</h1>
            <p className="mt-2 text-neutral-600">
                Enter your email to get started. You&apos;ll go straight to your profile setup.
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
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-neutral-900 hover:underline">
                    Log in
                </Link>
            </p>
        </div>
    );
}
