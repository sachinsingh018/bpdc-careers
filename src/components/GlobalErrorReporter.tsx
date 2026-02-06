"use client";

import { useEffect, useState } from "react";

/** Next.js throws these intentionally for redirect/notFound - do not show as errors */
function isNextRouterSignal(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const d = (err as { digest?: string }).digest;
  const m = (err as Error).message;
  if (typeof d === "string" && d.startsWith("NEXT_")) return true;
  if (typeof m === "string" && (m.includes("NEXT_REDIRECT") || m.includes("NEXT_NOT_FOUND"))) return true;
  return false;
}

/**
 * Catches unhandled errors and rejections, displays them on screen.
 * Delays attaching listeners so initial redirects (e.g. / -> /dashboard) don't flash an error.
 */
export function GlobalErrorReporter() {
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const onError = (e: ErrorEvent) => {
      if (e.message?.includes("NEXT_REDIRECT") || e.message?.includes("NEXT_NOT_FOUND")) return;
      const msg = `${e.message} (${e.filename}:${e.lineno})`;
      setError(msg);
      return false;
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      const reason = e.reason;
      if (isNextRouterSignal(reason)) {
        e.preventDefault();
        return;
      }
      const msg = reason?.message ?? String(reason ?? "");
      if (/NEXT_REDIRECT|NEXT_NOT_FOUND/.test(msg)) {
        e.preventDefault();
        return;
      }
      setError(String(msg || "Unhandled rejection"));
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, [ready]);

  if (!error) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-[9999] rounded-lg border border-red-300 bg-red-50 p-3 text-xs text-red-800 shadow-lg"
      role="alert"
    >
      <p className="font-medium">Error caught:</p>
      <p className="mt-1 break-all">{error}</p>
      <button
        type="button"
        onClick={() => setError(null)}
        className="mt-2 text-red-600 underline"
      >
        Dismiss
      </button>
    </div>
  );
}
