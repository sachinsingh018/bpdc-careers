"use client";

import { useEffect, useRef } from "react";
import jsQR from "jsqr";

type Props = {
  onDetected: (path: string) => void;
  onReady?: () => void;
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

  if (v.startsWith("/")) return v;
  return `/p/${v}`;
}

export function QRScanner({ onDetected, onReady, onError }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>();
  const detectedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (cancelled) return;

        streamRef.current = stream;

        const video = videoRef.current;
        if (!video) return;

        video.srcObject = stream;
        video.setAttribute("playsinline", "true");
        video.setAttribute("muted", "true");
        video.muted = true;

        await video.play();
        onReady?.();

        scanLoop();
      } catch (e: unknown) {
        const err = e as Error & { name?: string };
        console.error(err);
        onError?.(
          err?.name === "NotAllowedError"
            ? "Camera permission denied"
            : "Unable to access camera"
        );
      }
    }

    function scanLoop() {
      const video = videoRef.current;
      if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) {
        rafRef.current = requestAnimationFrame(scanLoop);
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        rafRef.current = requestAnimationFrame(scanLoop);
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const code = jsQR(imageData.data, canvas.width, canvas.height);
      if (code?.data && !detectedRef.current) {
        const path = normalizeToPath(code.data);
        if (path) {
          detectedRef.current = true;
          cleanup();
          onDetected(path);
          return;
        }
      }

      rafRef.current = requestAnimationFrame(scanLoop);
    }

    function cleanup() {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    start();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [onDetected, onError, onReady]);

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-neutral-900/10 bg-black shadow-inner">
        <video
          ref={videoRef}
          className="aspect-video w-full object-cover"
          playsInline
          muted
        />
      </div>
      <p className="text-center text-sm text-neutral-500">Point camera at QR code</p>
    </div>
  );
}
