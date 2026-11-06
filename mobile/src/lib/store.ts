import type { FlowKey } from '@/data/quizzes';

// Lightweight in-memory store to pass large result payloads between the quiz
// screen and the results screen without stuffing them into route params.
const results: Partial<Record<FlowKey, any>> = {};

export function setResult(flow: FlowKey, data: any) {
  results[flow] = data;
}

export function getResult(flow: FlowKey): any | undefined {
  return results[flow];
}
