import type { PersonaMeta, PlatformLog } from "@/lib/supabase-ops";
import { relativeTime } from "@/lib/supabase-ops";

export function AgentLiveCard({
  persona,
  activity,
}: {
  persona: PersonaMeta;
  activity: PlatformLog | null;
}) {
  const isActive = !!activity && Date.now() - new Date(activity.created_at).getTime() < 60 * 60 * 1000;

  return (
    <article
      className="glass-card group relative flex flex-col gap-3 p-5 transition-all"
      style={{ borderColor: isActive ? `${persona.accent}55` : undefined }}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full text-2xl"
            style={{ background: `${persona.accent}1a`, border: `1px solid ${persona.accent}55` }}
          >
            {persona.avatar}
          </div>
          <div>
            <div className="text-base font-semibold text-[color:var(--foreground)]">{persona.name}</div>
            <div className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
              {persona.title}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em]">
          <span
            className="relative flex h-2 w-2"
            aria-hidden="true"
          >
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${isActive ? "animate-ping" : ""}`}
              style={{ background: isActive ? persona.accent : "#64748B" }}
            />
            <span
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ background: isActive ? persona.accent : "#64748B" }}
            />
          </span>
          <span style={{ color: isActive ? persona.accent : "#64748B" }}>
            {isActive ? "Active" : "Standby"}
          </span>
        </div>
      </header>

      <p className="text-sm text-[color:var(--text-body)] leading-relaxed italic border-l-2 pl-3" style={{ borderColor: `${persona.accent}55` }}>
        {persona.tagline}
      </p>

      <div className="rounded-lg bg-[rgba(15,23,42,0.6)] border border-[rgba(148,163,184,0.08)] p-3">
        <div className="text-[10px] uppercase tracking-[0.14em] text-[color:var(--text-muted)] mb-1">
          {isActive ? "Current task" : "Last activity"}
        </div>
        {activity ? (
          <>
            <div className="text-sm text-[color:var(--foreground)] leading-snug line-clamp-2">
              {activity.summary ?? "(no summary)"}
            </div>
            <div className="mt-1 text-[11px] text-[color:var(--text-muted)]">
              {relativeTime(activity.created_at)}
              {activity.domain ? ` · ${activity.domain}` : ""}
            </div>
          </>
        ) : (
          <div className="text-sm text-[color:var(--text-muted)]">Standing by.</div>
        )}
      </div>
    </article>
  );
}
