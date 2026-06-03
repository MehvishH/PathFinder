import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import { RECOMMEND_SYSTEM, CHAT_SYSTEM, buildRecommendPrompt } from './prompts.js';

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Missing ANTHROPIC_API_KEY. Copy .env.example to .env and add your key.');
  process.exit(1);
}

const client = new Anthropic();
const MODEL = 'claude-opus-4-7';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

function textOf(message) {
  return message.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');
}

function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('Model did not return a JSON object');
  return JSON.parse(raw.slice(start, end + 1));
}

function handleError(res, e) {
  console.error(e);
  if (e instanceof Anthropic.AuthenticationError) {
    return res.status(500).json({ error: 'Server API key is invalid.' });
  }
  if (e instanceof Anthropic.RateLimitError) {
    return res.status(429).json({ error: 'Busy right now — please try again in a moment.' });
  }
  return res.status(500).json({ error: e?.message ?? 'Unexpected error' });
}

app.get('/health', (_req, res) => res.json({ ok: true }));

app.post('/recommend', async (req, res) => {
  const { flow, responses } = req.body ?? {};
  if (!flow || !responses || typeof responses !== 'object') {
    return res.status(400).json({ error: 'flow and responses are required' });
  }
  try {
    const prompt = buildRecommendPrompt(flow, responses);
    const message = await client.messages
      .stream({
        model: MODEL,
        max_tokens: 16000,
        thinking: { type: 'adaptive' },
        output_config: { effort: 'high' },
        system: [{ type: 'text', text: RECOMMEND_SYSTEM, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: prompt }],
      })
      .finalMessage();
    const result = extractJson(textOf(message));
    res.json({ result });
  } catch (e) {
    handleError(res, e);
  }
});

app.post('/chat', async (req, res) => {
  const { messages, context } = req.body ?? {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages are required' });
  }
  try {
    const system = [{ type: 'text', text: CHAT_SYSTEM, cache_control: { type: 'ephemeral' } }];
    if (context) system.push({ type: 'text', text: `The user's saved results for reference:\n${context}` });

    const message = await client.messages
      .stream({
        model: MODEL,
        max_tokens: 4000,
        thinking: { type: 'adaptive' },
        system,
        messages: messages.map((m) => ({ role: m.role, content: String(m.content ?? '') })),
      })
      .finalMessage();
    res.json({ reply: textOf(message).trim() });
  } catch (e) {
    handleError(res, e);
  }
});

const port = process.env.PORT || 8787;
app.listen(port, () => console.log(`PathFinder backend listening on http://localhost:${port}`));
