"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signup } from "@/app/actions/signup";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const formData = new FormData(e.currentTarget);
    const result = await signup(null, formData);
    if (result?.error) {
      setError(result.error);
      setPending(false);
      return;
    }
    const email = formData.get("email")?.toString()?.trim();
    if (email) {
      const signInResult = await signIn("credentials", {
        email,
        redirect: false,
        callbackUrl: "/profile/create",
      });
      if (signInResult?.ok) {
        router.push("/profile/create");
        router.refresh();
        return;
      }
    }
    setPending(false);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-semibold text-neutral-900">Create account</h1>
      <p className="mt-2 text-neutral-600">
        Enter your email to get started. You&apos;ll go straight to your profile setup.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
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
        <Button type="submit" fullWidth isLoading={pending} loadingText="Creating account…">
          Sign up
        </Button>
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
