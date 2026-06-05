import type { Metadata } from "next";
import { OpsView } from "./ops-view";

export const metadata: Metadata = {
  title: "Live Ops — Watch the OIOS team run",
  description:
    "A live window into the OIOS team. Watch each agent ship work in real time — every task, call, and handoff as it happens.",
  alternates: { canonical: "https://getoios.com/ops" },
};

export const dynamic = "force-dynamic";

export default function OpsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[color:var(--bg-primary)] px-6 py-16 md:px-10 md:py-20">
      <div className="orb orb-1" aria-hidden />
      <div className="orb orb-2" aria-hidden />
      <div className="orb orb-3" aria-hidden />

      <div className="relative mx-auto max-w-6xl">
        <header className="mb-10 flex flex-col gap-3">
          <div className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--accent-teal)]">
            OIOS · Live Ops
          </div>
          <h1 className="text-4xl font-semibold leading-tight text-[color:var(--foreground)] md:text-5xl">
            Watch the <span className="gradient-text">machine run</span>.
          </h1>
          <p className="max-w-2xl text-base text-[color:var(--text-body)]">
            This isn&apos;t a pitch — it&apos;s the team working. Every card below is a real agent. Every row in the feed
            is a real event they logged. Refresh and you&apos;ll see new stuff.
          </p>
        </header>
        <OpsView />
        <footer className="mt-16 border-t border-[rgba(148,163,184,0.08)] pt-6 text-[11px] uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
          Data streams from Supabase · read-only · refreshes every 15s
        </footer>
      </div>
    </main>
  );
}
