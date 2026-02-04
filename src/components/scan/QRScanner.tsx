"use client";

import { Html5Qrcode } from "html5-qrcode";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

type Props = {
  onDetected: (path: string) => void;
  onReady?: () => void;
  onError?: (msg: string) => void;
};

export type QRScannerHandle = {
  start: () => Promise<void>;
  stop: () => Promise<void>;
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

export const QRScanner = forwardRef<QRScannerHandle, Props>(
  function QRScanner({ onDetected, onReady, onError }, ref) {
    const containerId = "qr-reader";
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [message, setMessage] = useState("");

    const stop = useCallback(async () => {
      const scanner = scannerRef.current;
      scannerRef.current = null;

      if (!scanner) return;

      try {
        await scanner.stop();
      } catch {
        // already stopped
      }

      try {
        scanner.clear?.();
      } catch {
        // ignore
      }

      setMessage("");
    }, []);

    const start = useCallback(async () => {
      const element = document.getElementById(containerId);
      if (!element) {
        onError?.("Scanner container not found.");
        return;
      }

      try {
        setMessage("Initializing camera…");

        const warmupStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: false,
        });
        warmupStream.getTracks().forEach((t) => t.stop());

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((d) => d.kind === "videoinput");
        if (videoInputs.length === 0) {
          onError?.("No camera found.");
          return;
        }

        const backCamera = videoInputs.find(
          (d) =>
            d.label.toLowerCase().includes("back") ||
            d.label.toLowerCase().includes("environment") ||
            d.label.toLowerCase().includes("rear")
        );
        const deviceId = backCamera?.deviceId ?? videoInputs[0].deviceId;

        const scanner = new Html5Qrcode(containerId);
        scannerRef.current = scanner;

        const qrbox = Math.min(
          280,
          Math.min(window.innerWidth - 32, window.innerHeight * 0.4)
        );

        const config = {
          fps: 8,
          qrbox: { width: qrbox, height: qrbox },
          aspectRatio: 1,
          disableFlip: false,
        };

        await scanner.start(
          deviceId,
          config,
          async (decodedText) => {
            const path = normalizeToPath(decodedText);
            if (!path) return;

            await stop();
            onDetected(path);
          },
          () => { }
        );

        setMessage("Point camera at QR code");
        onReady?.();
      } catch (err: unknown) {
        const msg = String(err instanceof Error ? err.message : err || "Camera error");
        await stop();
        onError?.(msg);
      }
    }, [onDetected, onError, onReady, stop]);

    useImperativeHandle(
      ref,
      () => ({
        start,
        stop,
      }),
      [start, stop]
    );

    return (
      <div className="space-y-4">
        <div
          id={containerId}
          className="min-h-[240px] overflow-hidden rounded-2xl border border-neutral-900/10 bg-black shadow-inner"
          style={{ minHeight: "min(280px, 70vw)" }}
          aria-label="Camera view finder"
        />
        {message && (
          <p className="text-center text-sm text-neutral-500">{message}</p>
        )}
      </div>
    );
  }
);
