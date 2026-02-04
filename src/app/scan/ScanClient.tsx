"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/Button";
import { QRScanner } from "@/components/scan/QRScanner";

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

export function ScanClient() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");

  const onDetected = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  const onScannerError = useCallback((msg: string) => {
    setError(msg || "Camera failed to start.");
  }, []);

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
      <h1 className="text-2xl font-semibold text-neutral-900">Scan profile QR code</h1>
      <p className="mt-2 text-neutral-900">
        Point your camera at the QR code, or enter a profile link below.
      </p>

      <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="space-y-6">
          <QRScanner onDetected={onDetected} onError={onScannerError} />
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-2">
            <label htmlFor="profile-input" className="block text-sm font-medium text-neutral-900">
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
              placeholder="Profile URL, path, or ID"
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-neutral-900 placeholder-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            />
            <Button type="submit" className="w-full">
              Open profile
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
