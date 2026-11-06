import "server-only";
import Anthropic from "@anthropic-ai/sdk";

export const MODEL = "claude-opus-4-7";

let client: Anthropic | null = null;

/** Created lazily so builds and other routes work without the key set. */
export function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new MissingKeyError();
  }
  client ??= new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

class MissingKeyError extends Error {
  constructor() {
    super("ANTHROPIC_API_KEY is not set on the server.");
  }
}

export function textOf(message: Anthropic.Message) {
  return message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
}

export function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Model did not return a JSON object");
  return JSON.parse(raw.slice(start, end + 1));
}

export function errorResponse(e: unknown) {
  console.error(e);
  if (e instanceof MissingKeyError) {
    return Response.json({ error: "The server isn't set up with an API key yet." }, { status: 500 });
  }
  if (e instanceof Anthropic.AuthenticationError) {
    return Response.json({ error: "Server API key is invalid." }, { status: 500 });
  }
  if (e instanceof Anthropic.RateLimitError) {
    return Response.json({ error: "Busy right now. Please try again in a moment." }, { status: 429 });
  }
  const message = e instanceof Error ? e.message : "Unexpected error";
  return Response.json({ error: message }, { status: 500 });
}
