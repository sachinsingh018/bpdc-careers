"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface HeaderProps {
  isAuthenticated?: boolean;
  hasProfile?: boolean;
}

export function Header({ isAuthenticated, hasProfile }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const closeMobile = () => setMobileOpen(false);

  const navLink =
    "block rounded-lg px-4 py-3 text-base font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900";
  const navLinkActive = "bg-neutral-100 text-neutral-900";

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-14 min-h-[3.5rem] max-w-4xl items-center justify-between px-4 sm:h-16">
        <Link
          href={isAuthenticated ? "/dashboard" : "/"}
          className="flex min-w-0 items-center gap-2"
          onClick={closeMobile}
        >
          <Image
            src="/bpdc.jpg"
            alt="BPDC"
            width={140}
            height={50}
            className="h-10 w-auto max-w-[140px] object-contain sm:h-12 sm:max-w-[160px]"
            priority
          />
          <span className="hidden truncate text-base font-medium text-neutral-900 md:inline">Career Profile</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex md:gap-2">
          <Link
            href="/scan"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-neutral-100 hover:text-neutral-900 ${pathname === "/scan" ? "text-neutral-900" : "text-neutral-600"}`}
          >
            Scan Others
          </Link>
          {isAuthenticated ? (
            <>
              {hasProfile ? (
                <>
                  <Link
                    href="/dashboard"
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-neutral-100 hover:text-neutral-900 ${pathname === "/dashboard" ? "text-neutral-900" : "text-neutral-600"}`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/me"
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-neutral-100 hover:text-neutral-900 ${pathname === "/me" ? "text-neutral-900" : "text-neutral-600"}`}
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
              <Link href="/api/auth/signout?callbackUrl=/">
                <Button variant="ghost" className="text-sm">
                  Log out
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/"
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-neutral-100 hover:text-neutral-900 ${pathname === "/" ? "text-neutral-900" : "text-neutral-600"}`}
              >
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

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 md:hidden"
          aria-expanded={mobileOpen}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 md:hidden"
            onClick={closeMobile}
            aria-hidden
          />
          <nav
            className="absolute left-0 right-0 top-full z-50 border-b border-neutral-200 bg-white py-2 shadow-lg md:hidden"
            aria-label="Mobile navigation"
          >
            <div className="mx-auto max-w-4xl px-2">
              <Link
                href="/scan"
                onClick={closeMobile}
                className={`${navLink} ${pathname === "/scan" ? navLinkActive : ""}`}
              >
                Scan Others
              </Link>
              {isAuthenticated ? (
                <>
                  {hasProfile ? (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={closeMobile}
                        className={`${navLink} ${pathname === "/dashboard" ? navLinkActive : ""}`}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/me"
                        onClick={closeMobile}
                        className={`${navLink} ${pathname === "/me" ? navLinkActive : ""}`}
                      >
                        My Card
                      </Link>
                    </>
                  ) : (
                    <Link href="/profile/create" onClick={closeMobile} className={navLink}>
                      Create Profile
                    </Link>
                  )}
                  <Link
                    href="/api/auth/signout?callbackUrl=/"
                    onClick={closeMobile}
                    className={`${navLink} border-t border-neutral-100 pt-2`}
                  >
                    Log out
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/"
                    onClick={closeMobile}
                    className={`${navLink} ${pathname === "/" ? navLinkActive : ""}`}
                  >
                    Home
                  </Link>
                  <Link href="/login" onClick={closeMobile} className={navLink}>
                    Log in
                  </Link>
                  <Link href="/signup" onClick={closeMobile} className={navLink}>
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
