"use client";

import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";

type Props = {
  onDetected: (path: string) => void;
  onError?: (msg: string) => void;
};

function normalizeToPath(text: string): string | null {
  const v = text.trim();
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

function friendlyPermissionMessage(err: unknown): string {
  const msg = String(err instanceof Error ? err.message : err).toLowerCase();
  if (
    msg.includes("permission") ||
    msg.includes("notallowed") ||
    msg.includes("not allowed") ||
    msg.includes("denied")
  ) {
    return "Camera access was denied. Use the form below to enter a profile link manually.";
  }
  if (msg.includes("notfound") || msg.includes("no camera")) {
    return "No camera found. Use the form below to enter a profile link manually.";
  }
  return "Camera unavailable. Use the form below to enter a profile link manually.";
}

const CONTAINER_ID = "qr-reader";

export function QRScanner({ onDetected, onError }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const startedRef = useRef(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const element = document.getElementById(CONTAINER_ID);
    if (!element) return;

    const scanner = new Html5Qrcode(CONTAINER_ID);
    scannerRef.current = scanner;

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    };

    scanner
      .start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          const path = normalizeToPath(decodedText);
          if (!path || !path.startsWith("/p/")) return;
          onDetected(path);
        },
        () => {}
      )
      .then(() => {
        startedRef.current = true;
      })
      .catch((err: unknown) => {
        const friendly = friendlyPermissionMessage(err);
        setFailed(true);
        onError?.(friendly);
      });

    return () => {
      scannerRef.current = null;
      if (startedRef.current) {
        scanner.stop().catch(() => {});
        startedRef.current = false;
      } else {
        try {
          scanner.clear?.();
        } catch {
          // ignore
        }
      };
    };
  }, [onDetected, onError]);

  if (failed) {
    return (
      <div
        className="flex min-h-[120px] flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-center"
        role="status"
      >
        <p className="text-sm text-neutral-900">Camera not available</p>
        <p className="mt-1 text-xs text-neutral-600">Use the form below to enter a profile link.</p>
      </div>
    );
  }

  return (
    <div
      id={CONTAINER_ID}
      className="min-h-[240px] overflow-hidden rounded-2xl border border-neutral-900/10 bg-black"
      aria-label="Camera view finder"
    />
  );
}
