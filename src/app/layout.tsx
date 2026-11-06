import type { Metadata } from "next";
import { Figtree, Unbounded } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s · PathFinder",
    default: "PathFinder: find your next step and how to pay for it",
  },
  description:
    "Free AI-powered quizzes that help students and career-changers pick a direction, build a plan, and find real scholarships.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${unbounded.variable} ${figtree.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-lg bg-highlight px-4 py-2 font-semibold focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1 pb-24 has-[[data-flush-bottom]]:pb-0">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
