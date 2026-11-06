import { RECOMMEND_SYSTEM, buildRecommendPrompt } from '../server/prompts.js';
import { MODEL, getClient, textOf, extractJson, handleError, requirePost } from './_shared.mjs';

export const config = { maxDuration: 300 };

export default async function handler(req, res) {
  if (!requirePost(req, res)) return;
  const { flow, responses } = req.body ?? {};
  if (!flow || !responses || typeof responses !== 'object') {
    return res.status(400).json({ error: 'flow and responses are required' });
  }
  try {
    const prompt = buildRecommendPrompt(flow, responses);
    const message = await getClient()
      .messages.stream({
        model: MODEL,
        max_tokens: 16000,
        thinking: { type: 'adaptive' },
        output_config: { effort: 'high' },
        system: [{ type: 'text', text: RECOMMEND_SYSTEM, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: prompt }],
      })
      .finalMessage();
    res.status(200).json({ result: extractJson(textOf(message)) });
  } catch (e) {
    handleError(res, e);
  }
}
