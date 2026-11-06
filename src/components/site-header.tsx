import Link from "next/link";
import { Suspense } from "react";
import { LogoMark } from "@/components/logo";
import { NavLinks, NavLinksFallback } from "@/components/nav-links";

export function SiteHeader() {
  return (
    <header className="border-b-2 border-ink bg-paper">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight">
          <LogoMark className="size-9" />
          PathFinder
        </Link>
        {/* usePathname can suspend on routes with unknown params, so keep it isolated. */}
        <Suspense fallback={<NavLinksFallback />}>
          <NavLinks />
        </Suspense>
      </div>
    </header>
  );
}
