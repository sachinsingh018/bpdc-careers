"use client";

import { useEffect, useState } from "react";

/**
 * Full-screen loader shown on initial mount. Covers the screen during
 * auth check and redirect (e.g. / -> /dashboard) so no error flash appears.
 */
export function InitialLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1200);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-white"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-4">
        <span className="inline-flex h-10 w-10 items-center justify-center">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
        </span>
        <p className="text-sm text-neutral-900">Loading…</p>
      </div>
    </div>
  );
}
