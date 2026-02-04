"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email")?.toString()?.trim();
    if (!email) {
      setError("Email is required");
      setPending(false);
      return;
    }
    const result = await signIn("credentials", {
      email,
      redirect: false,
      callbackUrl: "/dashboard",
    });
    if (result?.error) {
      setError("No account found with this email. Please sign up first.");
      setPending(false);
      return;
    }
    if (result?.ok) {
      router.push("/dashboard");
      router.refresh();
      return;
    }
    setPending(false);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-semibold text-neutral-900">Sign in</h1>
      <p className="mt-2 text-neutral-900">
        Enter your email to access your career profile.
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
        <Button type="submit" fullWidth isLoading={pending} loadingText="Signing in…">
        Sign in
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-neutral-900">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-neutral-900 hover:underline">
          Create account
        </Link>
      </p>
    </div>
  );
}
