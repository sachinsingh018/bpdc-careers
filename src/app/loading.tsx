export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4 text-neutral-900">
        <span className="inline-flex h-10 w-10 items-center justify-center text-neutral-900">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-current border-t-transparent" />
        </span>
        <p className="text-sm text-neutral-900">Loading…</p>
      </div>
    </div>
  );
}

