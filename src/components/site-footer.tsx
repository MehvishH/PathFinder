import Link from "next/link";
import { LogoMark } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-ink bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <p className="flex items-center gap-2 font-display font-bold">
            <LogoMark className="size-7" />
            PathFinder
          </p>
          <p className="mt-3 text-ink-soft">
            Free guidance for picking a direction and paying for it. Answers come from AI, so
            double-check anything important before you act on it.
          </p>
        </div>
        <FooterList
          title="Quizzes"
          links={[
            { href: "/quiz/student", label: "Find my major" },
            { href: "/quiz/reentry", label: "Return to work" },
            { href: "/quiz/switch", label: "Switch careers" },
          ]}
        />
        <FooterList
          title="Keep going"
          links={[
            { href: "/quiz/scholarships", label: "Scholarship matcher" },
            { href: "/coach", label: "AI Career Coach" },
          ]}
        />
      </div>
    </footer>
  );
}

function FooterList({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="font-display text-sm font-semibold">{title}</h2>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-ink-soft underline-offset-4 hover:text-ink hover:underline">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
