"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { buttonClass } from "@/components/button-styles";
import { LoadingState } from "@/components/quiz/loading-state";
import { getRecommendations } from "@/lib/api";
import { FLOWS, type FlowKey, type Question } from "@/lib/flows";
import type { Responses } from "@/lib/prompts";
import { saveResult } from "@/lib/storage";

type Status = "answering" | "loading" | "error";

function isAnswered(q: Question, value: string | string[] | undefined) {
  if (q.optional) return true;
  if (q.type === "multiple") return Array.isArray(value) && value.length > 0;
  return typeof value === "string" && value.trim().length > 0;
}

export function QuizRunner({ flow }: { flow: FlowKey }) {
  const meta = FLOWS[flow];
  const questions = meta.questions;
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Responses>({});
  const [status, setStatus] = useState<Status>("answering");
  const [error, setError] = useState("");

  const headingRef = useRef<HTMLHeadingElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const shownIndex = useRef(0);
  const headingId = useId();

  const q = questions[index];
  const value = answers[q.id];
  const isLast = index === questions.length - 1;
  const canContinue = isAnswered(q, value);

  // Move focus to the new question so keyboard and screen reader users follow along.
  useEffect(() => {
    if (shownIndex.current === index) return;
    shownIndex.current = index;
    // Text questions focus their input; option questions focus the heading.
    (inputRef.current ?? headingRef.current)?.focus();
  }, [index]);

  function setAnswer(next: string | string[]) {
    setAnswers((prev) => ({ ...prev, [q.id]: next }));
  }

  function toggle(option: string) {
    if (q.type === "single") {
      setAnswer(option);
      return;
    }
    const current = Array.isArray(value) ? value : [];
    setAnswer(current.includes(option) ? current.filter((o) => o !== option) : [...current, option]);
  }

  async function submit() {
    setStatus("loading");
    setError("");
    const responses: Responses = {};
    for (const question of questions) {
      const v = answers[question.id];
      responses[question.id] = typeof v === "string" ? v.trim() : (v ?? []);
    }
    try {
      const result = await getRecommendations(flow, responses);
      const name = typeof responses.name === "string" ? responses.name : undefined;
      saveResult({ flow, name, savedAt: new Date().toISOString(), result });
      router.push(`/results/${flow}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  function next() {
    if (!canContinue) return;
    if (isLast) void submit();
    else setIndex((i) => i + 1);
  }

  if (status === "loading") {
    return <LoadingState flow={flow} />;
  }

  if (status === "error") {
    return (
      <div className="mx-auto max-w-2xl px-4 pt-16 sm:px-6" role="alert">
        <h1 className="text-2xl font-bold sm:text-3xl">That didn&rsquo;t work</h1>
        <p className="mt-4 text-lg text-ink-soft">{error}</p>
        <p className="mt-2 text-ink-soft">Your answers are still here, so you won&rsquo;t need to start over.</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <button type="button" className={buttonClass("primary")} onClick={() => void submit()}>
            Try again
          </button>
          <button type="button" className={buttonClass("plain")} onClick={() => setStatus("answering")}>
            Back to my answers
          </button>
        </div>
      </div>
    );
  }

  const progress = Math.round(((index + 1) / questions.length) * 100);
  const selected = Array.isArray(value) ? value : typeof value === "string" ? [value] : [];

  return (
    <div className="mx-auto max-w-2xl px-4 pt-10 sm:px-6 md:pt-14">
      <div className="flex items-baseline justify-between gap-4 text-sm font-semibold">
        <span>{meta.title}</span>
        <span className="text-ink-soft">
          Question {index + 1} of {questions.length}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="Quiz progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        className="mt-3 h-3.5 overflow-hidden rounded-full border-2 border-ink bg-white"
      >
        <div
          className="h-full rounded-full bg-cobalt transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      <form
        className="mt-10"
        onSubmit={(e) => {
          e.preventDefault();
          next();
        }}
      >
        <h1
          id={headingId}
          ref={headingRef}
          tabIndex={-1}
          className="text-2xl leading-tight font-bold outline-none sm:text-3xl"
        >
          {q.type === "text" ? <label htmlFor={`${headingId}-input`}>{q.question}</label> : q.question}
        </h1>
        {q.description && <p className="mt-3 text-lg text-ink-soft">{q.description}</p>}

        <div className="mt-8">
          {q.type === "text" && (
            <input
              id={`${headingId}-input`}
              key={q.id}
              type="text"
              ref={inputRef}
              autoComplete={q.id === "name" ? "given-name" : "off"}
              value={typeof value === "string" ? value : ""}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={q.placeholder}
              maxLength={200}
              className="w-full rounded-xl border-2 border-ink bg-white px-4 py-3.5 text-lg placeholder:text-ink-soft/60 focus:border-cobalt focus:outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-cobalt"
            />
          )}

          {q.type === "single" && (
            <div role="group" aria-labelledby={headingId} className="grid gap-3">
              {q.options?.map((option) => {
                const on = selected.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(option)}
                    className={`sticker flex w-full items-center gap-3 px-4 py-3.5 text-left text-base font-medium sm:text-lg ${
                      on ? "bg-highlight" : "bg-white"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-ink ${
                        on ? "bg-ink" : "bg-white"
                      }`}
                    >
                      {on && <span className="size-2 rounded-full bg-highlight" />}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>
          )}

          {q.type === "multiple" && (
            <div role="group" aria-labelledby={headingId} className="flex flex-wrap gap-3">
              {q.options?.map((option) => {
                const on = selected.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(option)}
                    className={`sticker inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-left font-medium ${
                      on ? "bg-highlight" : "bg-white"
                    }`}
                  >
                    <span aria-hidden="true" className="w-3 text-center font-bold">
                      {on ? "✓" : "+"}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-10 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setIndex((i) => i - 1)}
            disabled={index === 0}
            className={buttonClass("plain", "md", index === 0 ? "invisible" : "")}
          >
            ← Back
          </button>
          <button type="submit" disabled={!canContinue} className={buttonClass("primary", "md")}>
            {isLast
              ? flow === "scholarships"
                ? "Find my scholarships"
                : "Get my plan"
              : q.optional && selected.length === 0
                ? "Skip"
                : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}
