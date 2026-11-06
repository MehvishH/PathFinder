import { errorResponse, extractJson, getClient, MODEL, textOf } from "@/lib/anthropic";
import { isFlowKey } from "@/lib/flows";
import { buildRecommendPrompt, RECOMMEND_SYSTEM, type Responses } from "@/lib/prompts";

// Recommendations use high effort and can take a minute or more.
export const maxDuration = 300;

export async function POST(request: Request) {
  let body: { flow?: unknown; responses?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be JSON." }, { status: 400 });
  }

  const { flow, responses } = body ?? {};
  if (typeof flow !== "string" || !responses || typeof responses !== "object" || Array.isArray(responses)) {
    return Response.json({ error: "flow and responses are required" }, { status: 400 });
  }
  if (!isFlowKey(flow)) {
    return Response.json({ error: `Unknown flow: ${flow}` }, { status: 400 });
  }

  try {
    const prompt = buildRecommendPrompt(flow, responses as Responses);
    const message = await getClient()
      .messages.stream({
        model: MODEL,
        max_tokens: 16000,
        thinking: { type: "adaptive" },
        output_config: { effort: "high" },
        system: [{ type: "text", text: RECOMMEND_SYSTEM, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: prompt }],
      })
      .finalMessage();
    const result = extractJson(textOf(message));
    return Response.json({ result });
  } catch (e) {
    return errorResponse(e);
  }
}
