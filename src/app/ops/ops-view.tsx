"use client";

import { useOpsPoll } from "@/hooks/useOpsPoll";
import { KpiStrip } from "./_components/kpi-strip";
import { AgentLiveGrid } from "./_components/agent-live-grid";
import { ActivityFeed } from "./_components/activity-feed";
import { relativeTime } from "@/lib/supabase-ops";

export function OpsView() {
  const { data, error, loading } = useOpsPoll();

  if (loading && !data) {
    return (
      <div className="flex flex-col gap-6">
        <div className="glass-card flex animate-pulse items-center justify-center px-5 py-12 text-[color:var(--text-muted)]">
          Warming up the floor…
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="glass-card border-[color:var(--color-destructive)] px-5 py-6">
        <div className="text-sm text-[color:var(--color-destructive)]">Couldn&apos;t reach the ops feed: {error}</div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-col gap-8">
      <KpiStrip data={data} />
      <section>
        <header className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[color:var(--foreground)]">The team, right now</h2>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
              Each card shows what that agent last shipped. Active if inside the hour.
            </p>
          </div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
            Updated {relativeTime(data.fetchedAt)}
          </div>
        </header>
        <AgentLiveGrid data={data} />
      </section>
      <ActivityFeed data={data} />
    </div>
  );
}
