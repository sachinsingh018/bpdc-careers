"use client";

import { QRCodeSVG } from "qrcode.react";

interface QRCodeDisplayProps {
  url: string;
  name?: string;
  size?: number;
  compact?: boolean;
}

export function QRCodeDisplay({ url, name = "", size = 240, compact }: QRCodeDisplayProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <QRCodeSVG value={url} size={size} level="M" includeMargin role="img" aria-label={`QR code for ${name || "profile"}`} />
      {!compact && (
        <>
          {name && <p className="mt-4 text-base font-medium text-neutral-900">{name}</p>}
          <p className="mt-1 text-sm text-neutral-900">Scan to view profile</p>
        </>
      )}
    </div>
  );
}
