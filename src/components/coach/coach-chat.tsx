"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import ReactMarkdown from "react-markdown";
import { buttonClass } from "@/components/button-styles";
import { ScholarshipNote } from "@/components/results/parts";
import { sendChat } from "@/lib/api";
import { FLOWS } from "@/lib/flows";
import {
  clearChat,
  loadAllResults,
  loadChat,
  resultsContext,
  saveChat,
  type ChatMessage,
} from "@/lib/storage";

const STARTERS_WITH_RESULTS = [
  "Which of my matches should I start with?",
  "What can I do this week to get going?",
  "Help me write a scholarship essay intro",
  "How do I talk about this in an interview?",
];

const STARTERS = [
  "How do I pick a major when I like everything?",
  "How do I explain a career gap on my resume?",
  "Is a bootcamp worth it for switching careers?",
  "Where should I look for scholarships?",
];

const noop = () => () => {};

export function CoachChat() {
  // Chat history lives in sessionStorage, so only render it once we're in the browser.
  const hydrated = useSyncExternalStore(noop, () => true, () => false);

  return (
    <div className="mx-auto flex max-w-3xl flex-col px-4 pt-10 sm:px-6 md:pt-14">
      <h1 className="text-3xl font-bold sm:text-4xl">AI Career Coach</h1>
      <p className="mt-3 max-w-[60ch] text-lg text-ink-soft">
        Ask about majors, resumes, interviews, applications or scholarships. Answers come from
        AI, so double-check anything important.
      </p>
      {hydrated ? <Chat /> : <div className="min-h-[40vh]" aria-busy="true" />}
    </div>
  );
}

function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadChat());
  const [saved] = useState(() => loadAllResults());
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    saveChat(messages);
    if (messages.length) endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages, pending]);

  async function send(history: ChatMessage[]) {
    setPending(true);
    setError("");
    try {
      const reply = await sendChat(history, resultsContext());
      setMessages([...history, { role: "assistant", content: reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  function ask(text: string) {
    const content = text.trim();
    if (!content || pending) return;
    const history: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(history);
    setDraft("");
    void send(history);
  }

  function reset() {
    clearChat();
    setMessages([]);
    setError("");
    inputRef.current?.focus();
  }

  const starters = saved.length ? STARTERS_WITH_RESULTS : STARTERS;
  const lastIsUser = messages.at(-1)?.role === "user";

  return (
    <>
      <div className="mt-6 text-sm">
        {saved.length ? (
          <p className="rounded-xl bg-white px-4 py-3 ring-2 ring-line">
            <span className="font-semibold">Using your results from: </span>
            {saved.map((s) => FLOWS[s.flow].title).join(", ")}
          </p>
        ) : (
          <p className="text-ink-soft">
            Tip: <Link href="/quiz" className="font-semibold text-cobalt underline underline-offset-4">take a quiz</Link>{" "}
            first and the coach will tailor its advice to your results.
          </p>
        )}
      </div>
      <ScholarshipNote className="mt-4 text-sm" />

      <div className="mt-8" aria-live="polite">
        {messages.length === 0 ? (
          <div>
            <h2 className="font-display text-base font-semibold">Try asking</h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {starters.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => ask(s)}
                    className="sticker rounded-full bg-white px-4 py-2.5 text-left font-medium"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <ol className="space-y-6">
            {messages.map((m, i) => (
              <li key={i} className={m.role === "user" ? "flex justify-end" : ""}>
                {m.role === "user" ? (
                  <div className="max-w-[85%] rounded-2xl rounded-br-md bg-cobalt px-4 py-3 whitespace-pre-wrap text-white">
                    <span className="sr-only">You said: </span>
                    {m.content}
                  </div>
                ) : (
                  <div className="max-w-[68ch]">
                    <p className="mb-1 font-display text-xs font-semibold text-ink-soft">Coach</p>
                    <div className="coach-md rounded-2xl rounded-tl-md bg-white px-4 py-3 ring-2 ring-line">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </li>
            ))}
            {pending && (
              <li className="flex items-center gap-2 text-ink-soft">
                <span className="walk size-3 rounded-full border-2 border-ink bg-mint" aria-hidden="true" />
                Coach is thinking…
              </li>
            )}
          </ol>
        )}
        {error && (
          <div role="alert" className="mt-6 rounded-xl border-2 border-bubblegum bg-white px-4 py-3">
            <p className="font-semibold">{error}</p>
            {lastIsUser && !pending && (
              <button
                type="button"
                onClick={() => void send(messages)}
                className="mt-2 font-semibold text-cobalt underline underline-offset-4"
              >
                Try again
              </button>
            )}
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form
        className="sticky bottom-0 mt-8 -mx-4 border-t-2 border-ink bg-paper px-4 pt-4 pb-5 sm:mx-0 sm:px-0"
        onSubmit={(e) => {
          e.preventDefault();
          ask(draft);
        }}
      >
        <label htmlFor="coach-input" className="sr-only">
          Message the coach
        </label>
        <div className="flex items-end gap-3">
          <textarea
            id="coach-input"
            ref={inputRef}
            rows={2}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                ask(draft);
              }
            }}
            placeholder="Ask anything about your next step…"
            maxLength={4000}
            className="min-h-[3.25rem] flex-1 resize-y rounded-xl border-2 border-ink bg-white px-4 py-3 text-base placeholder:text-ink-soft/60 focus:border-cobalt focus:outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-cobalt"
          />
          <button type="submit" disabled={pending || !draft.trim()} className={buttonClass("primary")}>
            Send
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-ink-soft">
          <span>Enter to send, Shift+Enter for a new line</span>
          {messages.length > 0 && (
            <button type="button" onClick={reset} className="font-semibold underline underline-offset-4 hover:text-ink">
              Start over
            </button>
          )}
        </div>
      </form>
    </>
  );
}
