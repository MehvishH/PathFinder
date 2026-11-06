import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { QuizRunner } from "@/components/quiz/quiz-runner";
import { FLOW_KEYS, FLOWS, isFlowKey } from "@/lib/flows";

export function generateStaticParams() {
  return FLOW_KEYS.map((flow) => ({ flow }));
}

export async function generateMetadata({ params }: PageProps<"/quiz/[flow]">): Promise<Metadata> {
  const { flow } = await params;
  if (!isFlowKey(flow)) return {};
  return { title: FLOWS[flow].title, description: FLOWS[flow].blurb };
}

async function Quiz({ params }: { params: PageProps<"/quiz/[flow]">["params"] }) {
  const { flow } = await params;
  if (!isFlowKey(flow)) notFound();
  return <QuizRunner flow={flow} />;
}

// Reading params inside Suspense keeps navigation into this route instant.
export default function QuizPage({ params }: PageProps<"/quiz/[flow]">) {
  return (
    <Suspense fallback={<div className="min-h-[50vh]" aria-busy="true" />}>
      <Quiz params={params} />
    </Suspense>
  );
}
