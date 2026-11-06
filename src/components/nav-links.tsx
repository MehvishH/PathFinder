"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/quiz", label: "Quizzes", match: (p: string) => p === "/quiz" || (p.startsWith("/quiz/") && !p.endsWith("/scholarships")) },
  { href: "/quiz/scholarships", label: "Scholarships", match: (p: string) => p.endsWith("/scholarships") },
  { href: "/coach", label: "AI Coach", match: (p: string) => p.startsWith("/coach") },
];

function Links({ pathname }: { pathname: string | null }) {
  return (
    <nav aria-label="Main">
      <ul className="flex items-center gap-1 sm:gap-2">
        {LINKS.map((link) => {
          const active = pathname ? link.match(pathname) : false;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-3 py-2 font-semibold transition-colors hover:bg-white ${
                  active ? "highlight" : ""
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function NavLinks() {
  return <Links pathname={usePathname()} />;
}

export function NavLinksFallback() {
  return <Links pathname={null} />;
}
