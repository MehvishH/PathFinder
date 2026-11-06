import Link from "next/link";
import { buttonClass } from "@/components/button-styles";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-16 sm:px-6 md:pt-24">
      <h1 className="text-3xl font-bold sm:text-4xl">This trail doesn&rsquo;t go anywhere</h1>
      <p className="mt-4 text-lg text-ink-soft">The page you were looking for isn&rsquo;t here.</p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/" className={buttonClass("primary", "lg")}>
          Go home
        </Link>
        <Link href="/quiz" className={buttonClass("plain", "lg")}>
          See the quizzes
        </Link>
      </div>
    </div>
  );
}
