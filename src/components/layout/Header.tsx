import Link from "next/link";
import Image from "next/image";
import { logout } from "@/app/actions/logout";
import { Button } from "@/components/ui/Button";

interface HeaderProps {
  isAuthenticated?: boolean;
  hasProfile?: boolean;
}

export function Header({ isAuthenticated, hasProfile }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <Link
          href={isAuthenticated ? "/dashboard" : "/"}
          className="flex items-center gap-2"
        >
          <Image
            src="/bpdc.jpg"
            alt="BPDC"
            width={120}
            height={40}
            className="h-10 w-auto object-contain"
            priority
          />
          <span className="hidden text-lg font-medium text-neutral-900 sm:inline">Career Profile</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/scan"
            className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            Scan Others
          </Link>
          {isAuthenticated ? (
            <>
              {hasProfile ? (
                <>
                  <Link
                    href="/dashboard"
                    className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/me"
                    className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                  >
                    My Card
                  </Link>
                </>
              ) : (
                <Link
                  href="/profile/create"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                >
                  Create Profile
                </Link>
              )}
              <form action={logout} className="ml-2">
                <Button type="submit" variant="ghost" className="text-sm">
                  Log out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/" className="hidden rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 sm:inline-block">
                Home
              </Link>
              <Link href="/login">
                <Button variant="ghost" className="text-sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="text-sm">Sign up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
