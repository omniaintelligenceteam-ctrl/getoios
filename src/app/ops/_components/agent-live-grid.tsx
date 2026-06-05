import { PERSONAS, PERSONA_ORDER, type OpsData } from "@/lib/supabase-ops";
import { AgentLiveCard } from "./agent-live-card";

export function AgentLiveGrid({ data }: { data: OpsData }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {PERSONA_ORDER.map((id) => (
        <AgentLiveCard key={id} persona={PERSONAS[id]} activity={data.personaActivity[id]} />
      ))}
    </div>
  );
}
