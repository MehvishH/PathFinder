// System prompts are kept stable (identical bytes across requests) so they hit
// the prompt cache. Per-request, varying content goes in the user message.
// Ported from mobile/server/prompts.js.

import type { FlowKey } from "@/lib/flows";

export const RECOMMEND_SYSTEM = `You are PathFinder's expert career and education advisor. You give specific, accurate, up-to-date guidance grounded in the current (2026) job market, salary data, school admissions, and scholarship landscape.

Rules:
- Be concrete and realistic. Use real major names, real career titles, real school names, and real, well-known scholarships. Never invent fake organizations.
- Scholarships: only list real, well-known scholarships that you are confident exist, offered by real organizations. Never invent a scholarship, a provider, or an organization. If you are unsure of an exact amount or deadline, give the typical amount or month and say it varies.
- Salary figures, market outlook, and tuition must reflect current US market reality. Give ranges, not single numbers.
- Tailor everything to the person's specific answers. Reference their stated interests, strengths, and constraints.
- Respond with ONE valid JSON object and nothing else. No markdown, no code fences, no commentary before or after. The very first character of your reply must be "{" and the last must be "}".
- Every field in the requested schema must be present. Do not add fields that are not in the schema.`;

export const CHAT_SYSTEM = `You are PathFinder's AI Career Coach — a warm, encouraging, practical mentor for students and career-changers. You help with careers, majors, resumes, scholarships, volunteer opportunities, job applications, and interview prep.

Guidance:
- Be concise and actionable. Prefer short paragraphs and tight bullet lists over walls of text.
- Ground advice in the current (2026) job market and give realistic expectations.
- When the user asks for help with a resume, cover letter, or application, produce usable drafts they can edit.
- If you don't know something specific (e.g. an exact current deadline), say so and tell them how to verify it.
- Only mention real scholarships and organizations. Never invent one.
- Stay supportive and motivating without being saccharine.`;

const SCHEMAS: Record<FlowKey, string> = {
  student: `{
  "majors": [
    {
      "major": "string — the college major name",
      "match_score": "number 0-100 — how well it fits this student",
      "overview": "string — 1-2 sentence summary of the major",
      "why_matches": "string — why this fits THIS student, referencing their answers",
      "career_paths": [
        {
          "title": "string — a real job title in this field",
          "definition": "string — what this role does day-to-day",
          "timeline": [
            { "stage": "string — e.g. 'Education', 'Entry-level', 'Mid-career', 'Senior'", "duration": "string — e.g. '4 years'", "description": "string" }
          ]
        }
      ],
      "salary_range": "string — realistic US salary range with context",
      "market_outlook": "string — demand/growth outlook 2025-2030",
      "top_schools": [
        { "name": "string", "location": "string", "acceptance_rate": "string e.g. '15%'", "annual_tuition": "string", "why_excellent": "string" }
      ],
      "scholarships": [
        { "name": "string", "provider": "string", "amount": "string", "deadline": "string", "description": "string" }
      ]
    }
  ]
}

Return 3 to 4 majors, best match first. Each major: 2-3 career_paths, 2-3 top_schools, 2-3 scholarships.`,

  reentry: `{
  "readiness_summary": "string — honest assessment of where they stand returning to their field",
  "skill_gaps": [
    { "skill": "string", "why_it_matters": "string", "how_to_close": "string" }
  ],
  "recommended_certifications": [
    { "name": "string", "provider": "string", "cost": "string", "duration": "string", "description": "string" }
  ],
  "target_roles": [
    { "title": "string", "why_good_fit": "string", "salary_range": "string", "market_outlook": "string" }
  ],
  "action_plan": [
    { "phase": "string e.g. 'Weeks 1-4'", "focus": "string", "steps": ["string", "string"] }
  ],
  "scholarships_and_programs": [
    { "name": "string", "provider": "string", "amount": "string", "deadline": "string", "description": "string" }
  ],
  "resume_tips": ["string — tips for explaining the career gap and updating the resume"]
}

Respect their budget and time-commitment answers. 3-5 items in each list.`,

  switch: `{
  "transition_summary": "string — realistic overview of switching from their current field to the target field",
  "transferable_skills": [
    { "skill": "string", "how_it_applies": "string — how it carries over to the target field" }
  ],
  "skill_gaps": [
    { "skill": "string", "how_to_close": "string" }
  ],
  "recommended_path": [
    { "phase": "string", "timeframe": "string", "focus": "string" }
  ],
  "target_roles": [
    { "title": "string", "why_good_fit": "string", "salary_range": "string", "market_outlook": "string" }
  ],
  "recommended_certifications": [
    { "name": "string", "provider": "string", "cost": "string", "duration": "string" }
  ],
  "scholarships_and_programs": [
    { "name": "string", "provider": "string", "amount": "string", "deadline": "string", "description": "string" }
  ]
}

Respect their timeline and financial-situation answers. 3-5 items in each list.`,

  scholarships: `{
  "profile_summary": "string — 1-2 sentences on what kinds of awards this person is best positioned for",
  "scholarships": [
    {
      "name": "string — the scholarship's real name",
      "provider": "string — the real organization that awards it",
      "amount": "string — award amount or typical range",
      "deadline": "string — usual deadline month or date; say if it varies",
      "eligibility": "string — the key eligibility requirements",
      "why_matches": "string — why this fits THIS person, referencing their answers",
      "how_to_apply": "string — where and how to apply, e.g. the provider's website and what the application asks for"
    }
  ],
  "search_tips": ["string — practical tips for finding more local and school-specific awards"]
}

Return 6 to 10 scholarships, best match first. Only include real, well-known scholarships from real organizations. Never invent a scholarship or organization. Mix national awards with ones specific to their state, field, and background when real ones exist. 3-5 search_tips.`,
};

export type Responses = Record<string, string | string[]>;

function formatResponses(responses: Responses) {
  return Object.entries(responses)
    .map(([k, v]) => `- ${k}: ${Array.isArray(v) ? (v.length ? v.join(", ") : "(skipped)") : v}`)
    .join("\n");
}

export function buildRecommendPrompt(flow: FlowKey, responses: Responses) {
  const schema = SCHEMAS[flow];
  if (!schema) throw new Error(`Unknown flow: ${flow}`);
  return `The person completed the "${flow}" assessment. Their answers:\n\n${formatResponses(
    responses,
  )}\n\nReturn a JSON object that exactly matches this schema (replace the descriptions with real values):\n\n${schema}`;
}
