"use client";

export default function OpsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[color:var(--bg-primary)] px-6 text-center">
      <div className="text-sm uppercase tracking-[0.2em] text-[color:var(--color-destructive)]">
        Live ops feed is down
      </div>
      <p className="max-w-md text-sm text-[color:var(--text-body)]">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="btn-glow rounded-lg border border-[rgba(245,158,11,0.4)] bg-[rgba(245,158,11,0.1)] px-4 py-2 text-sm font-semibold text-[color:var(--accent-amber)]"
      >
        Try again
      </button>
    </main>
  );
}
