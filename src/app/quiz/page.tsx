import type { Metadata } from "next";
import { FlowChoice } from "@/components/flow-choice";
import { CAREER_FLOWS } from "@/lib/flows";

export const metadata: Metadata = {
  title: "Choose a quiz",
  description: "Pick the PathFinder quiz that fits where you are: choosing a major, returning to work, or switching careers.",
};

export default function QuizChooser() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 md:pt-16">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold sm:text-4xl">Where are you starting from?</h1>
        <p className="mt-4 text-lg text-ink-soft">
          Pick the one that sounds most like you. You can always come back and take another.
        </p>
        <div className="mt-10 grid gap-4">
          {CAREER_FLOWS.map((flow) => (
            <FlowChoice key={flow} flow={flow} />
          ))}
        </div>
        <h2 className="mt-14 text-xl font-bold sm:text-2xl">Just here for scholarships?</h2>
        <p className="mt-2 text-ink-soft">Skip straight to the matcher. It&rsquo;s 7 questions.</p>
        <div className="mt-6">
          <FlowChoice flow="scholarships" />
        </div>
      </div>
    </div>
  );
}
