"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerProps {
  onError?: (message: string) => void;
  onStop?: () => void;
  onDetected?: (path: string) => void;
}

export function QRScanner({ onError, onStop, onDetected }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isStarting, setIsStarting] = useState(true);

  const stopScanning = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch {
        // already stopped
      }
      scannerRef.current = null;
    }
    setIsStarting(false);
    onStop?.();
  }, [onStop]);

  const startScanning = useCallback(async () => {
    const element = document.getElementById("qr-reader");
    if (!element) {
      onError?.("Scanner could not initialize. Please try again.");
      return;
    }

    const qrboxSize = Math.min(280, Math.min(window.innerWidth - 32, window.innerHeight * 0.4));
    const config = {
      fps: 8,
      qrbox: { width: qrboxSize, height: qrboxSize },
      aspectRatio: 1,
      disableFlip: false,
    };

    const tryStart = async (facingMode: "environment" | "user") => {
      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;
      await html5QrCode.start(
        { facingMode },
        config,
        async (decodedText) => {
          await stopScanning();
          let path = decodedText;
          if (decodedText.startsWith("http")) {
            try {
              path = new URL(decodedText).pathname;
            } catch {
              path = decodedText;
            }
          } else if (!decodedText.startsWith("/")) {
            path = `/p/${decodedText}`;
          }
          onDetected?.(path);
        },
        () => { }
      );
      setIsStarting(false);
    };

    try {
      await tryStart("environment");
    } catch (err) {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const msg = err instanceof Error ? err.message : String(err);
      const isUnknownOrQuery = /unknown error|unable to query|error getting/i.test(msg);
      if (isMobile && isUnknownOrQuery) {
        try {
          if (scannerRef.current) {
            await scannerRef.current.stop().catch(() => { });
            scannerRef.current = null;
          }
          const el = document.getElementById("qr-reader");
          if (el) {
            el.innerHTML = "";
          }
          await tryStart("user");
          return;
        } catch {
          // Fall through to error handling
        }
      }
      const name = err instanceof Error ? (err as Error & { name?: string }).name : "";
      const message = err instanceof Error ? err.message : String(err);
      const full = `${name} ${message}`.toLowerCase();

      if (full.includes("notallowederror") || full.includes("permission") || full.includes("denied")) {
        onError?.("Camera access was denied. Please allow camera access in your browser settings and try again.");
      } else if (full.includes("notfounderror") || full.includes("not found") || full.includes("no camera")) {
        onError?.("No camera found. Please use a device with a camera.");
      } else if (full.includes("notreadableerror") || full.includes("in use")) {
        onError?.("Camera is in use by another app. Please close other apps using the camera.");
      } else if (full.includes("unknown error") || full.includes("unable to query") || full.includes("secure context") || full.includes("https")) {
        onError?.("Camera couldn't start. On mobile: use HTTPS, allow camera access, and try refreshing. Use \"Enter link manually\" below if it still fails.");
      } else if (full.includes("getusermedia") || full.includes("error getting")) {
        onError?.("Camera couldn't start. Please ensure you're on HTTPS, allow camera access when prompted, and try again.");
      } else {
        onError?.("Camera couldn't start. On mobile: ensure you're on HTTPS and have allowed camera access. Use \"Enter link manually\" below if needed.");
      }
      setIsStarting(false);
    }
  }, [onDetected, onError, stopScanning]);

  useEffect(() => {
    const timer = setTimeout(() => startScanning(), 400);
    return () => {
      clearTimeout(timer);
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => { });
      }
    };
  }, [startScanning]);

  return (
    <div className="space-y-4">
      <div
        id="qr-reader"
        className="min-h-[240px] overflow-hidden rounded-2xl border border-neutral-900/10 bg-black shadow-inner"
        style={{ minHeight: "min(280px, 70vw)" }}
        aria-label="Camera view finder"
      />
      {isStarting && (
        <p className="text-center text-sm text-neutral-500">Starting camera…</p>
      )}
      <button
        type="button"
        onClick={stopScanning}
        className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
      >
        Stop camera
      </button>
    </div>
  );
}

