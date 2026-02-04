"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { QRScanner, type QRScannerHandle } from "@/components/scan/QRScanner";

export default function ScanPage() {
  const router = useRouter();
  const scannerRef = useRef<QRScannerHandle>(null);

  const [status, setStatus] = useState<"idle" | "preparing" | "scanning" | "opening" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

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
    setError(
      msg || "Camera failed to start. Please allow camera access or use manual entry."
    );
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

  const handleManualEntry = useCallback(() => {
    const input = window.prompt("Enter profile URL or ID (e.g. /p/abc-123 or abc-123):");
    if (!input?.trim()) return;
    let path: string;
    if (input.startsWith("/")) {
      path = input;
    } else if (input.startsWith("http") && input.includes("/p/")) {
      try {
        path = new URL(input).pathname;
      } catch {
        path = `/p/${input}`;
      }
    } else {
      path = `/p/${input}`;
    }
    router.push(path);
  }, [router]);

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Scan a student&apos;s QR code</h1>
      <p className="mt-2 text-neutral-600">
        Point your camera at the QR code printed on the student&apos;s badge or phone. You&apos;ll open their profile in a
        second.
      </p>

      <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        {status === "idle" && (
          <div className="flex flex-col gap-6 text-center">
            <div className="mx-auto h-24 w-24 rounded-full bg-neutral-100" />
            <div>
              <p className="text-base font-medium text-neutral-800">Ready when you are</p>
              <p className="mt-1 text-sm text-neutral-500">
                Turn on the camera to scan. We&apos;ll guide you if anything looks off.
              </p>
            </div>
            <div className="space-y-2 text-sm text-neutral-500">
              <p>• Hold the QR code steady in the frame</p>
              <p>• Allow camera access when prompted</p>
              <p>• Tap below if you prefer to paste a link</p>
            </div>
            <Button onClick={startScanner}>Start camera</Button>
          </div>
        )}

        <div
          className={
            status === "preparing" || status === "scanning" ? "space-y-6" : "hidden"
          }
        >
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

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handleManualEntry}
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:underline"
          >
            Enter profile link manually
          </button>
        </div>
      </div>
    </div>
  );
}
