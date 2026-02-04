"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/Button";

function normalizeToPath(input: string): string | null {
  const v = input.trim();
  if (!v) return null;

  try {
    if (v.startsWith("http")) return new URL(v).pathname;
  } catch {
    // ignore
  }

  if (v.startsWith("/p/")) return v;
  if (v.startsWith("/p")) return v;
  if (v.startsWith("/")) return v;
  return `/p/${v}`;
}

export default function ScanPage() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      const path = normalizeToPath(input);
      if (!path || !path.startsWith("/p/") || path.length <= 4) {
        setError("Please enter a profile link, /p/... path, or ID.");
        return;
      }
      router.push(path);
    },
    [input, router]
  );

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Scan a student&apos;s QR code</h1>
      <p className="mt-2 text-neutral-600">
        Open your phone&apos;s Camera and scan the QR — it will open automatically.
      </p>

      <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="space-y-6">
          <div className="rounded-lg bg-neutral-50 p-4 text-sm text-neutral-700">
            <p className="font-medium text-neutral-900">How to scan</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Open your phone&apos;s native Camera app</li>
              <li>Point it at the student&apos;s QR code</li>
              <li>The profile will open automatically — no extra app needed</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <label htmlFor="profile-input" className="block text-sm font-medium text-neutral-700">
              Or enter manually
            </label>
            <input
              id="profile-input"
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(null);
              }}
              placeholder="Paste link, /p/abc-123, or profile ID"
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-neutral-900 placeholder-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full">
              Open profile
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
