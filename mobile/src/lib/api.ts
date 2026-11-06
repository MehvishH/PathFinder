import { API_URL } from './config';
import type { FlowKey } from '@/data/quizzes';

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Request failed (${res.status}): ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

export function getRecommendations(flow: FlowKey, responses: Record<string, unknown>) {
  return post<{ result: any }>('/recommend', { flow, responses });
}

export function sendChat(messages: ChatMessage[], context?: string) {
  return post<{ reply: string }>('/chat', { messages, context });
}
