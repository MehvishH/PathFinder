import {
  Bullets,
  CertList,
  Lead,
  Meta,
  Prose,
  RoleList,
  Row,
  Rows,
  ScholarshipList,
  Section,
  Timeline,
} from "@/components/results/parts";
import {
  list,
  type CareerPath,
  type Major,
  type ReentryResult,
  type School,
  type ScholarshipsResult,
  type StudentResult,
  type SwitchResult,
} from "@/lib/results";

function score(value: Major["match_score"]) {
  const n = typeof value === "number" ? value : parseFloat(String(value ?? ""));
  return Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : null;
}

function MatchScore({ value }: { value: Major["match_score"] }) {
  const n = score(value);
  if (n === null) return null;
  return (
    <div className="flex items-center gap-3">
      <div
        role="meter"
        aria-label="Match score"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={n}
        className="h-3 w-32 overflow-hidden rounded-full border-2 border-ink bg-white sm:w-40"
      >
        <div className="h-full bg-mint" style={{ width: `${n}%` }} />
      </div>
      <span className="font-display text-sm font-bold">{n}% match</span>
    </div>
  );
}

function CareerPaths({ paths }: { paths: CareerPath[] | undefined }) {
  return (
    <div className="space-y-10">
      {list<CareerPath>(paths).map((p, i) => (
        <div key={`${p.title}-${i}`}>
          <h4 className="font-display text-base font-semibold">{p.title}</h4>
          <Prose>{p.definition}</Prose>
          {list(p.timeline).length > 0 && (
            <div className="mt-5">
              <Timeline
                items={list<NonNullable<CareerPath["timeline"]>[number]>(p.timeline).map((t) => ({
                  title: t.stage,
                  when: t.duration,
                  body: t.description,
                }))}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Schools({ schools }: { schools: School[] | undefined }) {
  return (
    <Rows>
      {list<School>(schools).map((s, i) => (
        <Row key={`${s.name}-${i}`}>
          <h4 className="font-display text-base font-semibold">{s.name}</h4>
          {s.location && <p className="text-ink-soft">{s.location}</p>}
          <Meta items={[["Acceptance rate", s.acceptance_rate], ["Tuition per year", s.annual_tuition]]} />
          <Prose>{s.why_excellent}</Prose>
        </Row>
      ))}
    </Rows>
  );
}

export function StudentResults({ data }: { data: StudentResult }) {
  const majors = list<Major>(data.majors);
  return (
    <>
      <nav aria-label="Your matches" className="mt-8">
        <h2 className="font-display text-sm font-semibold">Your top matches</h2>
        <ol className="mt-3 flex flex-wrap gap-3">
          {majors.map((m, i) => (
            <li key={i}>
              <a
                href={`#major-${i + 1}`}
                className="sticker inline-flex items-center gap-2 bg-white px-4 py-2 font-semibold"
              >
                {m.major}
                {score(m.match_score) !== null && (
                  <span className="rounded-full bg-mint px-2 text-sm">{score(m.match_score)}%</span>
                )}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {majors.map((m, i) => (
        <article key={i} id={`major-${i + 1}`} className="mt-16 scroll-mt-6 border-t-2 border-ink pt-10">
          <h2 className="text-2xl font-bold sm:text-3xl">{m.major}</h2>
          <div className="mt-4">
            <MatchScore value={m.match_score} />
          </div>
          <Lead>{m.overview}</Lead>
          {m.why_matches && (
            <p className="mt-4 max-w-[68ch]">
              <span className="highlight font-semibold">Why it fits you:</span> {m.why_matches}
            </p>
          )}
          <dl className="mt-8 grid max-w-4xl gap-6 sm:grid-cols-2">
            {m.salary_range && (
              <div>
                <dt className="font-display text-sm font-semibold">Pay</dt>
                <dd className="mt-1 text-ink-soft">{m.salary_range}</dd>
              </div>
            )}
            {m.market_outlook && (
              <div>
                <dt className="font-display text-sm font-semibold">Job outlook</dt>
                <dd className="mt-1 text-ink-soft">{m.market_outlook}</dd>
              </div>
            )}
          </dl>
          <Section title="Where it can lead">
            <CareerPaths paths={m.career_paths} />
          </Section>
          <Section title="Schools to look at">
            <Schools schools={m.top_schools} />
          </Section>
          <Section title="Scholarships for this major">
            <ScholarshipList items={m.scholarships} />
          </Section>
        </article>
      ))}
    </>
  );
}

export function ReentryResults({ data }: { data: ReentryResult }) {
  return (
    <>
      <Lead>{data.readiness_summary}</Lead>
      <Section title="Roles to aim for">
        <RoleList items={data.target_roles} />
      </Section>
      <Section title="Your plan">
        <Timeline
          items={list<NonNullable<ReentryResult["action_plan"]>[number]>(data.action_plan).map((p) => ({
            title: p.focus,
            when: p.phase,
            body: list<string>(p.steps).length ? (
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {list<string>(p.steps).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            ) : null,
          }))}
        />
      </Section>
      <Section title="Skills to refresh">
        <Rows>
          {list<NonNullable<ReentryResult["skill_gaps"]>[number]>(data.skill_gaps).map((g, i) => (
            <Row key={i}>
              <h3 className="font-display text-base font-semibold">{g.skill}</h3>
              <Prose>{g.why_it_matters}</Prose>
              {g.how_to_close && (
                <p className="mt-2 max-w-[68ch]">
                  <span className="font-semibold">How to close it: </span>
                  {g.how_to_close}
                </p>
              )}
            </Row>
          ))}
        </Rows>
      </Section>
      <Section title="Certifications worth it">
        <CertList items={data.recommended_certifications} />
      </Section>
      <Section title="Explaining the gap on your resume">
        <Bullets items={data.resume_tips} />
      </Section>
      <Section title="Scholarships and programs">
        <ScholarshipList items={data.scholarships_and_programs} />
      </Section>
    </>
  );
}

export function SwitchResults({ data }: { data: SwitchResult }) {
  return (
    <>
      <Lead>{data.transition_summary}</Lead>
      <Section title="Skills you already have">
        <Rows>
          {list<NonNullable<SwitchResult["transferable_skills"]>[number]>(data.transferable_skills).map((s, i) => (
            <Row key={i}>
              <h3 className="font-display text-base font-semibold">{s.skill}</h3>
              <Prose>{s.how_it_applies}</Prose>
            </Row>
          ))}
        </Rows>
      </Section>
      <Section title="Gaps to close">
        <Rows>
          {list<NonNullable<SwitchResult["skill_gaps"]>[number]>(data.skill_gaps).map((s, i) => (
            <Row key={i}>
              <h3 className="font-display text-base font-semibold">{s.skill}</h3>
              <Prose>{s.how_to_close}</Prose>
            </Row>
          ))}
        </Rows>
      </Section>
      <Section title="Your path">
        <Timeline
          items={list<NonNullable<SwitchResult["recommended_path"]>[number]>(data.recommended_path).map((p) => ({
            title: p.phase,
            when: p.timeframe,
            body: p.focus,
          }))}
        />
      </Section>
      <Section title="Roles to aim for">
        <RoleList items={data.target_roles} />
      </Section>
      <Section title="Certifications worth it">
        <CertList items={data.recommended_certifications} />
      </Section>
      <Section title="Scholarships and programs">
        <ScholarshipList items={data.scholarships_and_programs} />
      </Section>
    </>
  );
}

export function ScholarshipsResults({ data }: { data: ScholarshipsResult }) {
  return (
    <>
      <Lead>{data.profile_summary}</Lead>
      <Section title="Your matches">
        <ScholarshipList items={data.scholarships} />
      </Section>
      {list(data.search_tips).length > 0 && (
        <Section title="Finding more">
          <Bullets items={data.search_tips} />
        </Section>
      )}
    </>
  );
}
