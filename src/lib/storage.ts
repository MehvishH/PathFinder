"use client";

import { FLOW_KEYS, FLOWS, type FlowKey } from "@/lib/flows";

// Results live in sessionStorage: they survive a refresh but not closing the tab,
// which suits a no-account site.

const resultKey = (flow: FlowKey) => `pathfinder:result:${flow}`;
const CHAT_KEY = "pathfinder:chat";

export type SavedResult = {
  flow: FlowKey;
  name?: string;
  savedAt: string;
  result: unknown;
};

export type ChatMessage = { role: "user" | "assistant"; content: string };

function read<T>(key: string): T | null {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be full or blocked (private mode). The current page still works.
  }
}

export function saveResult(saved: SavedResult) {
  write(resultKey(saved.flow), saved);
}

export function loadResult(flow: FlowKey) {
  return read<SavedResult>(resultKey(flow));
}

export function loadAllResults() {
  return FLOW_KEYS.map(loadResult).filter((r): r is SavedResult => r !== null);
}

/** A compact text version of saved results for the coach's context. */
export function resultsContext(maxChars = 24000) {
  const all = loadAllResults();
  if (!all.length) return "";
  const text = all
    .map((r) => `## ${FLOWS[r.flow].title}${r.name ? ` (for ${r.name})` : ""}\n${JSON.stringify(r.result)}`)
    .join("\n\n");
  return text.length > maxChars ? `${text.slice(0, maxChars)}\n…(truncated)` : text;
}

export function loadChat() {
  return read<ChatMessage[]>(CHAT_KEY) ?? [];
}

export function saveChat(messages: ChatMessage[]) {
  write(CHAT_KEY, messages);
}

export function clearChat() {
  try {
    window.sessionStorage.removeItem(CHAT_KEY);
  } catch {}
}
