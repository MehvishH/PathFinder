import Link from "next/link";
import { FLOWS, type FlowKey } from "@/lib/flows";

const ACCENT: Record<FlowKey, string> = {
  student: "bg-bubblegum",
  reentry: "bg-mint",
  switch: "bg-cobalt",
  scholarships: "bg-highlight",
};

export function FlowChoice({ flow, showCount = true }: { flow: FlowKey; showCount?: boolean }) {
  const meta = FLOWS[flow];
  return (
    <Link
      href={`/quiz/${flow}`}
      className="sticker group flex items-start gap-4 bg-white p-4 sm:p-5"
    >
      <span aria-hidden="true" className={`mt-1 size-4 shrink-0 rounded-full border-2 border-ink ${ACCENT[flow]}`} />
      <span className="min-w-0 flex-1">
        <span className="block font-display text-base font-semibold sm:text-lg">{meta.title}</span>
        <span className="mt-1 block text-ink-soft">{meta.blurb}</span>
        {showCount && (
          <span className="mt-2 block text-sm text-ink-soft">{meta.questions.length} questions</span>
        )}
      </span>
      <span aria-hidden="true" className="mt-0.5 text-xl transition-transform group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}
