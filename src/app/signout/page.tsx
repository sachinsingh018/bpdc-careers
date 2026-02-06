"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export default function SignOutPage() {
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);
    await signOut({ callbackUrl: "/" });
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-semibold text-neutral-900">Sign out</h1>
      <p className="mt-2 text-neutral-900">
        Are you sure you want to sign out? You can sign back in anytime.
      </p>
      <div className="mt-8 space-y-3">
        <Button onClick={handleSignOut} fullWidth isLoading={pending} loadingText="Signing out…">
          Sign out
        </Button>
        <Link href="/dashboard" className="block">
          <Button variant="secondary" fullWidth>
            Cancel
          </Button>
        </Link>
      </div>
    </div>
  );
}
