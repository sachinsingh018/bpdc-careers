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

    try {
      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      const qrboxSize = Math.min(280, Math.min(window.innerWidth - 32, window.innerHeight * 0.4));
      const config = {
        fps: 8,
        qrbox: { width: qrboxSize, height: qrboxSize },
        aspectRatio: 1,
        disableFlip: false,
      };

      await html5QrCode.start(
        { facingMode: "environment" },
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
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("NotAllowedError") || message.includes("Permission")) {
        onError?.("Camera access was denied. Please allow camera access in your browser settings and try again.");
      } else if (message.includes("NotFoundError") || message.includes("not found")) {
        onError?.("No camera found. Please use a device with a camera.");
      } else if (message.includes("NotReadableError") || message.includes("in use")) {
        onError?.("Camera is in use by another app. Please close other apps using the camera.");
      } else {
        onError?.("Could not access camera. Please ensure you're on HTTPS and allow camera access.");
      }
      setIsStarting(false);
    }
  }, [onDetected, onError, stopScanning]);

  useEffect(() => {
    const timer = setTimeout(() => startScanning(), 100);
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

