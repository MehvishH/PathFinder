"use client";

import { useEffect, useState } from "react";
import { FLOWS, type FlowKey } from "@/lib/flows";

const MESSAGES: Record<FlowKey, string[]> = {
  student: [
    "Reading your answers…",
    "Matching your interests to majors…",
    "Mapping out where each major leads…",
    "Comparing schools that are strong in your areas…",
    "Looking up scholarships you could go for…",
    "Putting your plan together…",
  ],
  reentry: [
    "Reading your answers…",
    "Checking what's changed in your field…",
    "Spotting the skills worth refreshing…",
    "Finding certifications that fit your budget…",
    "Building a week-by-week plan…",
    "Putting your plan together…",
  ],
  switch: [
    "Reading your answers…",
    "Finding the skills that carry over…",
    "Sizing up the gaps to close…",
    "Picking roles that make a good first step…",
    "Mapping a realistic timeline…",
    "Putting your plan together…",
  ],
  scholarships: [
    "Reading your profile…",
    "Searching national scholarships…",
    "Checking awards for your state…",
    "Matching your field and activities…",
    "Sorting by best fit…",
    "Writing up how to apply…",
  ],
};

export function LoadingState({ flow }: { flow: FlowKey }) {
  const messages = MESSAGES[flow];
  const [step, setStep] = useState(0);
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const rotate = window.setInterval(() => setStep((s) => (s + 1) % messages.length), 4500);
    const slowTimer = window.setTimeout(() => setSlow(true), 50000);
    return () => {
      window.clearInterval(rotate);
      window.clearTimeout(slowTimer);
    };
  }, [messages.length]);

  return (
    <div className="mx-auto max-w-2xl px-4 pt-20 sm:px-6 md:pt-28">
      <div aria-hidden="true" className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="walk size-3.5 rounded-full border-2 border-ink"
            style={{
              animationDelay: `${i * 0.18}s`,
              background: ["#FF6EB4", "#34E3A0", "#F2FF4D"][i],
            }}
          />
        ))}
      </div>
      <h1 className="mt-8 text-2xl font-bold sm:text-3xl">Working on it</h1>
      <p className="mt-3 text-lg text-ink-soft">
        We&rsquo;re putting together {FLOWS[flow].outcome}. This usually takes 30 to 60 seconds.
      </p>
      <div aria-live="polite" className="mt-8">
        <p
          key={step}
          className="fade-swap inline-block rounded-lg bg-white px-4 py-3 text-lg font-semibold ring-2 ring-ink"
        >
          {messages[step]}
        </p>
      </div>
      {slow && (
        <p className="mt-6 text-ink-soft" aria-live="polite">
          Still going. Detailed plans take a little longer, so hang tight.
        </p>
      )}
      <p className="mt-10 text-sm text-ink-soft">Keep this tab open until your results show up.</p>
    </div>
  );
}
