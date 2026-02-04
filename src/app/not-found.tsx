import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold text-neutral-900">Profile not found</h1>
      <p className="mt-2 text-neutral-600">
        This profile may have been removed or the link is incorrect.
      </p>
      <Link href="/" className="mt-8 inline-block">
        <Button>Go home</Button>
      </Link>
    </div>
  );
}
