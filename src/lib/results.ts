// Shapes the AI returns for each flow. Every field is optional because the
// UI must survive a model reply that drops or renames something.

export type Scholarship = {
  name?: string;
  provider?: string;
  amount?: string;
  deadline?: string;
  description?: string;
  eligibility?: string;
  why_matches?: string;
  how_to_apply?: string;
};

export type TimelineStage = { stage?: string; duration?: string; description?: string };
export type CareerPath = { title?: string; definition?: string; timeline?: TimelineStage[] };
export type School = {
  name?: string;
  location?: string;
  acceptance_rate?: string;
  annual_tuition?: string;
  why_excellent?: string;
};

export type Major = {
  major?: string;
  match_score?: number | string;
  overview?: string;
  why_matches?: string;
  career_paths?: CareerPath[];
  salary_range?: string;
  market_outlook?: string;
  top_schools?: School[];
  scholarships?: Scholarship[];
};

export type StudentResult = { majors?: Major[] };

export type Role = { title?: string; why_good_fit?: string; salary_range?: string; market_outlook?: string };
export type Certification = { name?: string; provider?: string; cost?: string; duration?: string; description?: string };

export type ReentryResult = {
  readiness_summary?: string;
  skill_gaps?: { skill?: string; why_it_matters?: string; how_to_close?: string }[];
  recommended_certifications?: Certification[];
  target_roles?: Role[];
  action_plan?: { phase?: string; focus?: string; steps?: string[] }[];
  scholarships_and_programs?: Scholarship[];
  resume_tips?: string[];
};

export type SwitchResult = {
  transition_summary?: string;
  transferable_skills?: { skill?: string; how_it_applies?: string }[];
  skill_gaps?: { skill?: string; how_to_close?: string }[];
  recommended_path?: { phase?: string; timeframe?: string; focus?: string }[];
  target_roles?: Role[];
  recommended_certifications?: Certification[];
  scholarships_and_programs?: Scholarship[];
};

export type ScholarshipsResult = {
  profile_summary?: string;
  scholarships?: Scholarship[];
  search_tips?: string[];
};

/** Narrow unknown JSON to an array so `.map` is always safe. */
export function list<T>(value: T[] | undefined | null | unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}
