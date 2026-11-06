import type { FlowKey } from "@/lib/flows";
import type { Responses } from "@/lib/prompts";
import type { ChatMessage } from "@/lib/storage";

async function post<T>(url: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Couldn't reach PathFinder. Check your connection and try again.");
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error ?? `Something went wrong (${res.status}). Please try again.`);
  }
  return data as T;
}

export async function getRecommendations(flow: FlowKey, responses: Responses) {
  const data = await post<{ result: unknown }>("/api/recommend", { flow, responses });
  return data.result;
}

export async function sendChat(messages: ChatMessage[], context: string) {
  const data = await post<{ reply: string }>("/api/chat", { messages, context: context || undefined });
  return data.reply;
}
