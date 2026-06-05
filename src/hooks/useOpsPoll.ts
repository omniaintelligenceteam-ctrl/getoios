"use client";

import { useEffect, useState } from "react";
import { fetchOpsData, type OpsData } from "@/lib/supabase-ops";

export function useOpsPoll(intervalMs = 15_000): {
  data: OpsData | null;
  error: string | null;
  loading: boolean;
} {
  const [data, setData] = useState<OpsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function tick() {
      try {
        const next = await fetchOpsData();
        if (!cancelled) {
          setData(next);
          setError(null);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e));
          setLoading(false);
        }
      }
    }

    tick();
    const id = setInterval(tick, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [intervalMs]);

  return { data, error, loading };
}
