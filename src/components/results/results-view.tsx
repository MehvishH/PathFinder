"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { buttonClass } from "@/components/button-styles";
import {
  ReentryResults,
  ScholarshipsResults,
  StudentResults,
  SwitchResults,
} from "@/components/results/flow-results";
import { FLOWS, type FlowKey } from "@/lib/flows";
import type { ReentryResult, ScholarshipsResult, StudentResult, SwitchResult } from "@/lib/results";
import { loadResult, type SavedResult } from "@/lib/storage";

// sessionStorage isn't observable, so this store only reads once per mount.
const subscribe = () => () => {};

function useSavedResult(flow: FlowKey) {
  const raw = useSyncExternalStore(
    subscribe,
    () => JSON.stringify(loadResult(flow)),
    () => undefined,
  );
  return useMemo(() => (raw === undefined ? undefined : (JSON.parse(raw) as SavedResult | null)), [raw]);
}

function hasContent(flow: FlowKey, result: unknown) {
  if (!result || typeof result !== "object") return false;
  const r = result as Record<string, unknown>;
  switch (flow) {
    case "student":
      return Array.isArray(r.majors) && r.majors.length > 0;
    case "scholarships":
      return Array.isArray(r.scholarships) && r.scholarships.length > 0;
    default:
      return Object.keys(r).length > 0;
  }
}

export function ResultsView({ flow }: { flow: FlowKey }) {
  const saved = useSavedResult(flow);
  const meta = FLOWS[flow];

  // Server render and first paint: nothing to read yet.
  if (saved === undefined) {
    return <div className="mx-auto min-h-[50vh] max-w-4xl px-4 pt-14 sm:px-6" aria-busy="true" />;
  }

  if (!saved || !hasContent(flow, saved.result)) {
    return (
      <div className="mx-auto max-w-2xl px-4 pt-14 sm:px-6 md:pt-20">
        <h1 className="text-3xl font-bold sm:text-4xl">No results here yet</h1>
        <p className="mt-4 text-lg text-ink-soft">
          {saved
            ? "We couldn't read your last results. Taking the quiz again should fix it."
            : `Take the ${meta.title.toLowerCase()} quiz and your results will show up here. They stay put if you refresh, until you close this tab.`}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href={`/quiz/${flow}`} className={buttonClass("primary", "lg")}>
            Take the quiz
          </Link>
          <Link href="/quiz" className={buttonClass("plain", "lg")}>
            See all quizzes
          </Link>
        </div>
      </div>
    );
  }

  const heading =
    flow === "scholarships"
      ? "Your scholarship matches"
      : saved.name
        ? `Here's your plan, ${saved.name}`
        : "Here's your plan";

  return (
    <div className="mx-auto max-w-4xl px-4 pt-12 sm:px-6 md:pt-16">
      <p className="font-semibold text-ink-soft">{meta.title}</p>
      <h1 className="mt-2 text-3xl leading-tight font-bold sm:text-4xl">{heading}</h1>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/coach" className={buttonClass("primary")}>
          Ask the coach about this
        </Link>
        <Link href={`/quiz/${flow}`} className={buttonClass("plain")}>
          Retake the quiz
        </Link>
      </div>
      <p className="mt-4 text-sm text-ink-soft">
        Made by AI from your answers. Treat it as a starting point and double-check the details.
      </p>

      {flow === "student" && <StudentResults data={saved.result as StudentResult} />}
      {flow === "reentry" && <ReentryResults data={saved.result as ReentryResult} />}
      {flow === "switch" && <SwitchResults data={saved.result as SwitchResult} />}
      {flow === "scholarships" && <ScholarshipsResults data={saved.result as ScholarshipsResult} />}

      {flow !== "scholarships" && (
        <aside className="mt-20 border-t-2 border-ink pt-10">
          <h2 className="text-xl font-bold sm:text-2xl">Need more money for school?</h2>
          <p className="mt-2 max-w-[60ch] text-ink-soft">
            The scholarship matcher digs deeper than the few listed here. It takes 7 questions.
          </p>
          <Link href="/quiz/scholarships" className={buttonClass("yellow", "md", "mt-5")}>
            Find scholarships
          </Link>
        </aside>
      )}
    </div>
  );
}
