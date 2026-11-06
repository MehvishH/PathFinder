import Link from "next/link";
import { buttonClass } from "@/components/button-styles";
import { FlowChoice } from "@/components/flow-choice";
import { TrailMap } from "@/components/trail-map";
import { CAREER_FLOWS } from "@/lib/flows";

const STEPS = [
  {
    title: "Answer a few questions",
    body: "About 8 to 10 quick ones on what you like, what you're good at, and what you need. Most take a tap.",
  },
  {
    title: "Get your personalized plan",
    body: "Majors, roles, skills to build, a timeline and scholarships, all based on your answers.",
  },
  {
    title: "Keep going with the AI coach",
    body: "Ask follow-ups, get resume help or prep for an interview. The coach already knows your results.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 pb-16 sm:px-6 md:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-6">
        <div className="max-w-[36rem]">
          <h1 className="text-[2.15rem] leading-[1.08] font-bold sm:text-5xl lg:text-[3.4rem]">
            Find your <span className="highlight">next step</span> and how to pay for it.
          </h1>
          <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-ink-soft sm:text-xl">
            Short quizzes for students and career-changers. You get a plan built around your
            answers, real scholarships to apply for, and a coach to help you follow through.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/quiz" className={buttonClass("primary", "lg")}>
              Find my path
            </Link>
            <Link href="/quiz/scholarships" className={buttonClass("yellow", "lg")}>
              Find scholarships
            </Link>
          </div>
          <p className="mt-5 text-sm text-ink-soft">Free. No account. Takes about 3 minutes.</p>
        </div>
        <TrailMap className="mx-auto w-full max-w-[34rem]" />
      </section>

      {/* Path + money split */}
      <section aria-labelledby="split-heading" className="border-y-2 border-ink bg-white">
        <h2 id="split-heading" className="sr-only">
          What you can do here
        </h2>
        <div className="mx-auto grid max-w-6xl md:grid-cols-2">
          <div className="px-4 py-12 sm:px-6 md:py-16 md:pr-10">
            <h3 className="text-2xl font-bold sm:text-3xl">Figure out your path</h3>
            <p className="mt-3 max-w-[34rem] text-lg text-ink-soft">
              Pick the quiz that fits where you are right now. Each one ends with a plan you can
              actually use.
            </p>
            <div className="mt-8 grid gap-4">
              {CAREER_FLOWS.map((flow) => (
                <FlowChoice key={flow} flow={flow} />
              ))}
            </div>
          </div>
          <div className="border-t-2 border-ink px-4 py-12 sm:px-6 md:border-t-0 md:border-l-2 md:py-16 md:pl-10">
            <h3 className="text-2xl font-bold sm:text-3xl">Find money for it</h3>
            <p className="mt-3 max-w-[34rem] text-lg text-ink-soft">
              Tell us about school, your field, your state and what you&rsquo;re involved in. We
              match you with real scholarships and show you how to apply.
            </p>
            <ul className="mt-6 max-w-[34rem] space-y-3 text-lg">
              {[
                "6 to 10 matches, best fit first",
                "Amounts, deadlines and who's eligible",
                "Why each one fits you and where to apply",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 size-2.5 shrink-0 rounded-full bg-mint ring-2 ring-ink" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <FlowChoice flow="scholarships" />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section aria-labelledby="how-heading" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <h2 id="how-heading" className="text-3xl font-bold sm:text-4xl">
          How it works
        </h2>
        <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, i) => (
            <li key={step.title} className="max-w-[24rem]">
              <span
                aria-hidden="true"
                className="flex size-11 items-center justify-center rounded-full border-2 border-ink bg-highlight font-display text-lg font-bold"
              >
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold sm:text-xl">{step.title}</h3>
              <p className="mt-2 text-ink-soft">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Coach band */}
      <section aria-labelledby="coach-heading" data-flush-bottom className="bg-cobalt text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-[36rem]">
            <h2 id="coach-heading" className="text-2xl font-bold sm:text-3xl">
              Stuck on something specific?
            </h2>
            <p className="mt-3 text-lg text-white/85">
              Ask the AI Career Coach about majors, resumes, interviews or scholarship essays. If
              you&rsquo;ve taken a quiz, it uses your results.
            </p>
          </div>
          <Link href="/coach" className={buttonClass("yellow", "lg", "shrink-0")}>
            Talk to the coach
          </Link>
        </div>
      </section>
    </>
  );
}
