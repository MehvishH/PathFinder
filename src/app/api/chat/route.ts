import type Anthropic from "@anthropic-ai/sdk";
import { errorResponse, getClient, MODEL, textOf } from "@/lib/anthropic";
import { CHAT_SYSTEM } from "@/lib/prompts";

export const maxDuration = 120;

type IncomingMessage = { role?: unknown; content?: unknown };

export async function POST(request: Request) {
  let body: { messages?: unknown; context?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be JSON." }, { status: 400 });
  }

  const { messages, context } = body ?? {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "messages are required" }, { status: 400 });
  }

  try {
    const system: Anthropic.TextBlockParam[] = [
      { type: "text", text: CHAT_SYSTEM, cache_control: { type: "ephemeral" } },
    ];
    if (typeof context === "string" && context) {
      system.push({ type: "text", text: `The user's saved results for reference:\n${context}` });
    }

    const message = await getClient()
      .messages.stream({
        model: MODEL,
        max_tokens: 4000,
        thinking: { type: "adaptive" },
        system,
        messages: (messages as IncomingMessage[]).map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: String(m.content ?? ""),
        })),
      })
      .finalMessage();
    return Response.json({ reply: textOf(message).trim() });
  } catch (e) {
    return errorResponse(e);
  }
}
