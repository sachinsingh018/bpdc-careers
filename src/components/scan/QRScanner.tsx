"use client";

import { useCallback, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerProps {
  onError?: (message: string) => void;
  onStop?: () => void;
  onDetected?: (path: string) => void;
}

export function QRScanner({ onError, onStop, onDetected }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const stopScanning = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch {
        // already stopped
      }
      scannerRef.current = null;
    }
    onStop?.();
  }, [onStop]);

  const startScanning = useCallback(async () => {
    try {
      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
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
    } catch (err) {
      onError?.("Could not access camera. Please allow camera access and try again.");
    }
  }, [onDetected, onError, stopScanning]);

  useEffect(() => {
    startScanning();
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => { });
      }
    };
  }, [startScanning]);

  return (
    <div className="space-y-4">
      <div
        id="qr-reader"
        className="overflow-hidden rounded-2xl border border-neutral-900/10 bg-black shadow-inner"
        aria-label="Camera view finder"
      />
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

