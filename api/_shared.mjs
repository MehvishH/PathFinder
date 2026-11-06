// Shared helpers for the Vercel serverless functions (files starting with "_" are not routes).
import Anthropic from '@anthropic-ai/sdk';

export const MODEL = 'claude-opus-4-7';

let client;
export function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('Missing ANTHROPIC_API_KEY. Add it in Vercel → Project → Settings → Environment Variables.');
  }
  client ??= new Anthropic();
  return client;
}

export function textOf(message) {
  return message.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');
}

export function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('Model did not return a JSON object');
  return JSON.parse(raw.slice(start, end + 1));
}

export function handleError(res, e) {
  console.error(e);
  if (e instanceof Anthropic.AuthenticationError) {
    return res.status(500).json({ error: 'Server API key is invalid.' });
  }
  if (e instanceof Anthropic.RateLimitError) {
    return res.status(429).json({ error: 'Busy right now — please try again in a moment.' });
  }
  return res.status(500).json({ error: e?.message ?? 'Unexpected error' });
}

export function requirePost(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return false;
  }
  return true;
}
