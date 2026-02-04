"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { QRScanner, type QRScannerHandle } from "@/components/scan/QRScanner";
import { ScanErrorBoundary } from "@/components/ScanErrorBoundary";

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
  const scannerRef = useRef<QRScannerHandle>(null);

  const [status, setStatus] = useState<"idle" | "preparing" | "scanning" | "opening" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [input, setInput] = useState("");

  const startScanner = useCallback(() => {
    setError(null);
    setStatus("preparing");
    scannerRef.current?.start();
  }, []);

  const stopScanner = useCallback(() => {
    scannerRef.current?.stop();
    setStatus("idle");
  }, []);

  const onDetected = useCallback((path: string) => {
    setPendingPath(path);
    setStatus("opening");
  }, []);

  const onScannerReady = useCallback(() => {
    setStatus("scanning");
  }, []);

  const onScannerError = useCallback((msg: string) => {
    setStatus("error");
    setError(msg || "Camera failed to start. Please allow camera access or use manual entry.");
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setPendingPath(null);
    setStatus("idle");
  }, []);

  useEffect(() => {
    if (!pendingPath) return;
    const t = setTimeout(() => {
      router.push(pendingPath);
    }, 900);
    return () => clearTimeout(t);
  }, [pendingPath, router]);

  const handleManualSubmit = useCallback(
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
    <ScanErrorBoundary>
      <div className="mx-auto max-w-lg px-4 py-10">
        <h1 className="text-2xl font-semibold text-neutral-900">Scan a student&apos;s QR code</h1>
        <p className="mt-2 text-neutral-600">
          Open your phone&apos;s Camera and scan the QR — it will open automatically. Or use the in-browser scanner below.
        </p>

        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          {status === "idle" && (
            <div className="flex flex-col gap-6 text-center">
              <div className="rounded-lg bg-neutral-50 p-4 text-sm text-neutral-700">
                <p className="font-medium text-neutral-900">How to scan</p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-left">
                  <li>Use your phone&apos;s native Camera app — it opens links automatically</li>
                  <li>Or start the in-browser camera below to scan from this device</li>
                </ul>
              </div>
              <Button onClick={startScanner}>Start camera</Button>
            </div>
          )}

          {(status === "preparing" || status === "scanning") && (
            <div className="space-y-6">
              <QRScanner
                ref={scannerRef}
                onDetected={onDetected}
                onReady={onScannerReady}
                onError={onScannerError}
              />
              <p className="text-center text-sm text-neutral-500">
                Align the QR code inside the square. We&apos;ll open the profile as soon as it&apos;s detected.
              </p>
              <button
                type="button"
                onClick={stopScanner}
                className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Stop camera
              </button>
            </div>
          )}

          {status === "opening" && pendingPath && (
            <div className="flex flex-col items-center gap-3 py-10 text-neutral-600">
              <span className="inline-flex h-8 w-8 items-center justify-center">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
              </span>
              <p className="text-sm">Opening profile…</p>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
              <Button variant="secondary" onClick={reset} className="w-full">
                Try again
              </Button>
            </div>
          )}

          <div className="mt-6 space-y-3">
            <form onSubmit={handleManualSubmit} className="space-y-2">
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
              {error && status === "idle" && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" className="w-full">
                Open profile
              </Button>
            </form>
          </div>
        </div>
      </div>
    </ScanErrorBoundary>
  );
}
