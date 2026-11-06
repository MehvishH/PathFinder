import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ResultsView } from "@/components/results/results-view";
import { FLOW_KEYS, FLOWS, isFlowKey } from "@/lib/flows";

export function generateStaticParams() {
  return FLOW_KEYS.map((flow) => ({ flow }));
}

export async function generateMetadata({ params }: PageProps<"/results/[flow]">): Promise<Metadata> {
  const { flow } = await params;
  if (!isFlowKey(flow)) return {};
  return { title: `${FLOWS[flow].title} results`, robots: { index: false } };
}

async function Results({ params }: { params: PageProps<"/results/[flow]">["params"] }) {
  const { flow } = await params;
  if (!isFlowKey(flow)) notFound();
  return <ResultsView flow={flow} />;
}

// Reading params inside Suspense keeps navigation into this route instant.
export default function ResultsPage({ params }: PageProps<"/results/[flow]">) {
  return (
    <Suspense fallback={<div className="min-h-[50vh]" aria-busy="true" />}>
      <Results params={params} />
    </Suspense>
  );
}
