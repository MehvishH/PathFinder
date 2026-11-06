import { CHAT_SYSTEM } from '../server/prompts.js';
import { MODEL, getClient, textOf, handleError, requirePost } from './_shared.mjs';

export const config = { maxDuration: 120 };

export default async function handler(req, res) {
  if (!requirePost(req, res)) return;
  const { messages, context } = req.body ?? {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages are required' });
  }
  try {
    const system = [{ type: 'text', text: CHAT_SYSTEM, cache_control: { type: 'ephemeral' } }];
    if (context) system.push({ type: 'text', text: `The user's saved results for reference:\n${context}` });

    const message = await getClient()
      .messages.stream({
        model: MODEL,
        max_tokens: 4000,
        thinking: { type: 'adaptive' },
        system,
        messages: messages.map((m) => ({ role: m.role, content: String(m.content ?? '') })),
      })
      .finalMessage();
    res.status(200).json({ reply: textOf(message).trim() });
  } catch (e) {
    handleError(res, e);
  }
}
