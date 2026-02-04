"use client";

export function Watermark() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center"
      aria-hidden
    >
      {/* SVG scales crisply at any size; viewport-relative max keeps it subtle on mobile */}
      <img
        src="/bpdc.svg"
        alt=""
        className="h-auto w-auto max-h-[min(45vw,40vh)] max-w-[min(45vw,40vh)] opacity-[0.06] sm:max-h-[min(50vw,45vh)] sm:max-w-[min(50vw,45vh)]"
      />
    </div>
  );
}
