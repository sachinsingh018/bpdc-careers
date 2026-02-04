"use client";

import { useEffect, useState } from "react";

/**
 * Catches unhandled errors and rejections, displays them on screen.
 * Useful for debugging iOS crashes - remove in production once fixed.
 */
export function GlobalErrorReporter() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onError = (e: ErrorEvent) => {
      const msg = `${e.message} (${e.filename}:${e.lineno})`;
      setError(msg);
      return false;
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      const msg = String(e.reason?.message ?? e.reason ?? "Unhandled rejection");
      setError(msg);
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

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
