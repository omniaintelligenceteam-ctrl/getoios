const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

export type Persona = "max" | "gary" | "elon" | "ari" | "buffett" | "sarah" | "g";

export type PersonaMeta = {
  id: Persona;
  name: string;
  title: string;
  tagline: string;
  avatar: string;
  accent: string;
};

export const PERSONAS: Record<Persona, PersonaMeta> = {
  max: {
    id: "max",
    name: "Max",
    title: "COO",
    tagline: "Orchestration, drafts, pipeline calls, memory, reporting.",
    avatar: "🧠",
    accent: "#2DD4BF",
  },
  gary: {
    id: "gary",
    name: "Gary",
    title: "CMO",
    tagline: "Cold emails, social posts, landing pages, brand voice, campaigns.",
    avatar: "🎙️",
    accent: "#F59E0B",
  },
  elon: {
    id: "elon",
    name: "Elon",
    title: "CTO",
    tagline: "Infra, routines, deploys, MCPs, memory stores.",
    avatar: "🛠️",
    accent: "#06B6D4",
  },
  ari: {
    id: "ari",
    name: "Ari",
    title: "CRO",
    tagline: "Prospecting, cold outreach, lead scoring, follow-ups, closing.",
    avatar: "🎯",
    accent: "#F97316",
  },
  buffett: {
    id: "buffett",
    name: "Buffett",
    title: "CFO",
    tagline: "Invoices, Stripe, budgets, reports, cashflow.",
    avatar: "💼",
    accent: "#FBBF24",
  },
  sarah: {
    id: "sarah",
    name: "Sarah",
    title: "Voice Agent",
    tagline: "Inbound, outbound, bookings, qualification, summaries.",
    avatar: "📞",
    accent: "#34D399",
  },
  g: {
    id: "g",
    name: "G",
    title: "Field Agent",
    tagline: "Discord, community, DMs, forums, field work.",
    avatar: "🛰️",
    accent: "#A78BFA",
  },
};

export const PERSONA_ORDER: Persona[] = ["max", "gary", "elon", "ari", "buffett", "sarah", "g"];

const DOMAIN_TO_PERSONA: Record<string, Persona> = {
  "client-ops": "buffett",
  clients: "buffett",
  client_health: "buffett",
  briefing: "max",
  ops: "max",
  tasks: "max",
  strategy: "max",
  autodream: "max",
  "eod-wrap": "max",
  gmail: "max",
  memory: "max",
  sales: "ari",
  pipeline: "ari",
  "lead-scraper": "ari",
  calls: "sarah",
  content: "gary",
  infra: "elon",
  maintenance: "elon",
  "self-heal": "elon",
  "disk-hygiene": "elon",
  architecture: "elon",
  system: "elon",
  openclaw: "g",
};

export function domainToPersona(domain: string | null): Persona {
  if (!domain) return "max";
  return DOMAIN_TO_PERSONA[domain] ?? "max";
}

export type PlatformLog = {
  id: string;
  platform: string | null;
  domain: string | null;
  category: string | null;
  summary: string | null;
  action: string | null;
  created_at: string;
};

export type PipelineSnapshot = {
  total_leads: number;
  leads_with_email: number;
  outreach_sent: number;
  demos_scheduled: number;
  proposals_out: number;
  mrr: string;
  hot_leads: Array<{ name?: string; score?: number; status?: string; note?: string }> | null;
  updated_at: string;
};

export type OpsData = {
  feed: PlatformLog[];
  snapshot: PipelineSnapshot | null;
  personaActivity: Record<Persona, PlatformLog | null>;
  fetchedAt: string;
};

async function rest<T>(path: string): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchOpsData(): Promise<OpsData> {
  const [feed, snapshotArr] = await Promise.all([
    rest<PlatformLog[]>(
      "platform_log?select=id,platform,domain,category,summary,action,created_at&order=created_at.desc&limit=40"
    ),
    rest<PipelineSnapshot[]>(
      "pipeline_snapshot?select=total_leads,leads_with_email,outreach_sent,demos_scheduled,proposals_out,mrr,hot_leads,updated_at&order=updated_at.desc&limit=1"
    ),
  ]);

  const personaActivity: Record<Persona, PlatformLog | null> = {
    max: null,
    gary: null,
    elon: null,
    ari: null,
    buffett: null,
    sarah: null,
    g: null,
  };

  for (const row of feed) {
    const persona = domainToPersona(row.domain);
    if (!personaActivity[persona]) personaActivity[persona] = row;
  }

  return {
    feed,
    snapshot: snapshotArr[0] ?? null,
    personaActivity,
    fetchedAt: new Date().toISOString(),
  };
}

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const s = Math.round(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}
