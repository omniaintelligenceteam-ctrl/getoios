import type { OpsData } from "@/lib/supabase-ops";

function KPI({ label, value, tone = "teal" }: { label: string; value: string; tone?: "teal" | "amber" | "cyan" | "emerald" }) {
  const toneClass =
    tone === "amber"
      ? "text-[#F59E0B]"
      : tone === "cyan"
      ? "text-[#06B6D4]"
      : tone === "emerald"
      ? "text-[#34D399]"
      : "text-[#2DD4BF]";
  return (
    <div className="glass-card flex flex-col items-start gap-1 px-5 py-4 min-w-[180px]">
      <span className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--text-muted)]">{label}</span>
      <span className={`text-3xl font-semibold tabular-nums ${toneClass}`}>{value}</span>
    </div>
  );
}

export function KpiStrip({ data }: { data: OpsData }) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const eventsToday = data.feed.filter((r) => new Date(r.created_at).getTime() >= startOfToday).length;
  const activeDomainsToday = new Set(
    data.feed.filter((r) => new Date(r.created_at).getTime() >= startOfToday).map((r) => r.domain ?? "other")
  ).size;
  const totalLeads = data.snapshot?.total_leads ?? 0;
  const hotLeads = data.snapshot?.hot_leads?.length ?? 0;

  return (
    <div className="flex flex-wrap gap-4">
      <KPI label="Events today" value={String(eventsToday)} tone="teal" />
      <KPI label="Workstreams active" value={String(activeDomainsToday)} tone="cyan" />
      <KPI label="Hot leads tracked" value={String(hotLeads)} tone="amber" />
      <KPI label="Leads in pipeline" value={String(totalLeads)} tone="emerald" />
    </div>
  );
}
