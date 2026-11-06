import type { Metadata } from "next";
import { CoachChat } from "@/components/coach/coach-chat";

export const metadata: Metadata = {
  title: "AI Career Coach",
  description: "Ask about majors, resumes, interviews and scholarships. Uses your quiz results if you have them.",
};

export default function CoachPage() {
  return <CoachChat />;
}
