import type { ReactNode } from "react";
import { list, type Certification, type Role, type Scholarship } from "@/lib/results";

export function ScholarshipNote({ className = "" }: { className?: string }) {
  return (
    <p
      role="note"
      className={`flex gap-3 rounded-xl border-2 border-ink bg-highlight px-4 py-3 font-semibold ${className}`}
    >
      <span aria-hidden="true">!</span>
      <span>Always confirm amounts and deadlines on the provider&rsquo;s site.</span>
    </p>
  );
}

export function Section({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  return (
    <section id={id} className="mt-14 scroll-mt-6">
      <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

/** Plain divided list. Used instead of a grid of identical cards. */
export function Rows({ children }: { children: ReactNode }) {
  return <ul className="divide-y-2 divide-line border-y-2 border-line">{children}</ul>;
}

export function Row({ children }: { children: ReactNode }) {
  return <li className="py-5">{children}</li>;
}

export function Meta({ items }: { items: [string, string | undefined][] }) {
  const shown = items.filter(([, v]) => v);
  if (!shown.length) return null;
  return (
    <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm">
      {shown.map(([label, v]) => (
        <div key={label} className="flex gap-1.5">
          <dt className="text-ink-soft">{label}:</dt>
          <dd className="font-semibold">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Prose({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return <p className="mt-2 max-w-[68ch] text-ink-soft">{children}</p>;
}

export function Lead({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="mt-6 max-w-[68ch] text-lg leading-relaxed sm:text-xl">{children}</p>;
}

function searchUrl(s: Scholarship) {
  const q = [s.name, s.provider, "scholarship"].filter(Boolean).join(" ");
  return `https://www.google.com/search?q=${encodeURIComponent(q)}`;
}

export function ScholarshipList({ items }: { items: Scholarship[] | undefined }) {
  const all = list<Scholarship>(items);
  if (!all.length) return <p className="text-ink-soft">No scholarships came back for this one.</p>;
  return (
    <>
      <ScholarshipNote className="mb-5" />
      <Rows>
        {all.map((s, i) => (
          <Row key={`${s.name}-${i}`}>
            <h3 className="font-display text-base font-semibold sm:text-lg">{s.name}</h3>
            {s.provider && <p className="text-ink-soft">{s.provider}</p>}
            <Meta items={[["Amount", s.amount], ["Deadline", s.deadline]]} />
            {s.eligibility && (
              <p className="mt-3 max-w-[68ch]">
                <span className="font-semibold">Who can apply: </span>
                {s.eligibility}
              </p>
            )}
            {s.why_matches && (
              <p className="mt-2 max-w-[68ch]">
                <span className="font-semibold">Why it fits you: </span>
                {s.why_matches}
              </p>
            )}
            {s.description && <Prose>{s.description}</Prose>}
            {s.how_to_apply && (
              <p className="mt-2 max-w-[68ch]">
                <span className="font-semibold">How to apply: </span>
                {s.how_to_apply}
              </p>
            )}
            {s.name && (
              <a
                href={searchUrl(s)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block font-semibold text-cobalt underline underline-offset-4"
              >
                Look it up<span className="sr-only"> (opens in a new tab)</span> ↗
              </a>
            )}
          </Row>
        ))}
      </Rows>
    </>
  );
}

export function RoleList({ items }: { items: Role[] | undefined }) {
  return (
    <Rows>
      {list<Role>(items).map((r, i) => (
        <Row key={`${r.title}-${i}`}>
          <h3 className="font-display text-base font-semibold sm:text-lg">{r.title}</h3>
          <Meta items={[["Pay", r.salary_range]]} />
          <Prose>{r.why_good_fit}</Prose>
          {r.market_outlook && (
            <p className="mt-2 max-w-[68ch] text-sm">
              <span className="font-semibold">Outlook: </span>
              {r.market_outlook}
            </p>
          )}
        </Row>
      ))}
    </Rows>
  );
}

export function CertList({ items }: { items: Certification[] | undefined }) {
  return (
    <Rows>
      {list<Certification>(items).map((c, i) => (
        <Row key={`${c.name}-${i}`}>
          <h3 className="font-display text-base font-semibold sm:text-lg">{c.name}</h3>
          <Meta items={[["From", c.provider], ["Cost", c.cost], ["Time", c.duration]]} />
          <Prose>{c.description}</Prose>
        </Row>
      ))}
    </Rows>
  );
}

/** A real sequence (phases, stages), so numbering and a connecting line are earned. */
export function Timeline({
  items,
}: {
  items: { title?: string; when?: string; body?: ReactNode }[];
}) {
  return (
    <ol className="relative ml-3 border-l-2 border-dashed border-ink">
      {items.map((item, i) => (
        <li key={i} className="relative pb-7 pl-7 last:pb-0">
          <span
            aria-hidden="true"
            className="absolute top-0.5 -left-[13px] flex size-6 items-center justify-center rounded-full border-2 border-ink bg-mint text-xs font-bold"
          >
            {i + 1}
          </span>
          <p className="font-semibold">
            {item.title}
            {item.when && <span className="font-normal text-ink-soft"> · {item.when}</span>}
          </p>
          {item.body && <div className="mt-1 max-w-[68ch] text-ink-soft">{item.body}</div>}
        </li>
      ))}
    </ol>
  );
}

export function Bullets({ items }: { items: string[] | undefined }) {
  return (
    <ul className="max-w-[68ch] space-y-3">
      {list<string>(items).map((t, i) => (
        <li key={i} className="flex gap-3">
          <span aria-hidden="true" className="mt-2 size-2.5 shrink-0 rounded-full bg-bubblegum ring-2 ring-ink" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}
