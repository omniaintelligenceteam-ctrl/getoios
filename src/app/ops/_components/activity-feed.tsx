import {
  PERSONAS,
  domainToPersona,
  relativeTime,
  type OpsData,
} from "@/lib/supabase-ops";

export function ActivityFeed({ data }: { data: OpsData }) {
  return (
    <section className="glass-card p-5">
      <header className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[color:var(--foreground)]">Activity feed</h2>
          <p className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
            Last {Math.min(data.feed.length, 30)} events · refreshes every 15s
          </p>
        </div>
      </header>

      <ol className="flex flex-col gap-2">
        {data.feed.slice(0, 30).map((row) => {
          const persona = PERSONAS[domainToPersona(row.domain)];
          return (
            <li
              key={row.id}
              className="flex items-start gap-3 rounded-lg border border-[rgba(148,163,184,0.08)] bg-[rgba(15,23,42,0.4)] px-3 py-2.5"
            >
              <div
                className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-base"
                style={{
                  background: `${persona.accent}1a`,
                  border: `1px solid ${persona.accent}55`,
                }}
                title={persona.name}
              >
                {persona.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="text-sm font-semibold" style={{ color: persona.accent }}>
                    {persona.name}
                  </span>
                  {row.domain ? (
                    <span className="text-[11px] uppercase tracking-[0.12em] text-[color:var(--text-muted)]">
                      {row.domain}
                    </span>
                  ) : null}
                  <span className="ml-auto text-[11px] text-[color:var(--text-muted)]">
                    {relativeTime(row.created_at)}
                  </span>
                </div>
                <div className="text-sm text-[color:var(--text-body)] leading-snug">
                  {row.summary ?? "(no summary)"}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
