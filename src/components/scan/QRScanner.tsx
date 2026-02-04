"use client";

import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef } from "react";

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

const CONTAINER_ID = "qr-reader";

export function QRScanner({ onDetected, onError }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);

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
      .catch((err: unknown) => {
        const msg = String(err instanceof Error ? err.message : err || "Camera error");
        onError?.(msg);
      });

    return () => {
      scannerRef.current = null;
      scanner.stop().catch(() => {});
    };
  }, [onDetected, onError]);

  return (
    <div
      id={CONTAINER_ID}
      className="min-h-[240px] overflow-hidden rounded-2xl border border-neutral-900/10 bg-black"
      aria-label="Camera view finder"
    />
  );
}
