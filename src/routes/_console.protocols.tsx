import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAether } from "@/lib/aether";
import { pageHead } from "@/lib/head";
import { Dot, Label } from "@/components/aether/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_console/protocols")({
  head: pageHead("Protocols", "Individualized safety checklists and an emergency habitat map."),
  component: Protocols,
});

const P = {
  hypoxia: { name: "Hypoxia / Mask Leak", target: "o2", steps: ["Don emergency mask; confirm seal by exhale test.", "Move to Emergency O₂ Cache.", "Set flow to 15 L/min and monitor SpO₂ above 94%.", "Report to flight surgeon with packet."] },
  solar: { name: "Solar Radiation Storm", target: "shelter", steps: ["Stop all EVA prep immediately.", "Proceed to Storm Shelter; seal hatch.", "Wear personal dosimeter; log readings every 10 min.", "Await all-clear from CAPCOM."] },
  sans: { name: "SANS Ocular Shift", target: "med", steps: ["Pause high-exertion tasks.", "Go to Med-Bay for fundoscopy and OCT scan.", "Apply thigh cuffs to reduce fluid shift.", "Transmit imaging to ophthalmology."] },
  depress: { name: "Depressurization", target: "airlock", steps: ["Close bulkhead hatches behind you.", "Don pressure suit or mask.", "Isolate leak; move to Airlock safe-haven.", "Confirm crew count over loop."] },
  micro: { name: "Microgravity Deconditioning", target: "quarters", steps: ["Log orthostatic symptoms.", "Complete 45-min resistive exercise.", "Hydrate with 500 mL saline load.", "Rest in Crew Quarters; re-check BP."] },
} as const;
type Key = keyof typeof P;

const MOD = {
  cmd: { x: 20, y: 20, w: 150, h: 90, label: "Command Deck" },
  quarters: { x: 230, y: 20, w: 150, h: 90, label: "Crew Quarters" },
  med: { x: 20, y: 170, w: 150, h: 90, label: "Med-Bay" },
  o2: { x: 230, y: 170, w: 150, h: 90, label: "Emergency O₂ Cache" },
  airlock: { x: 20, y: 320, w: 150, h: 70, label: "Airlock" },
  shelter: { x: 230, y: 320, w: 150, h: 70, label: "Storm Shelter" },
} as Record<string, { x: number; y: number; w: number; h: number; label: string }>;
const c = (k: string) => { const m = MOD[k]!; return { x: m.x + m.w / 2, y: m.y + m.h / 2 }; };

function Protocols() {
  const { anomaly, crew } = useAether();
  const auto: Key = anomaly ? "hypoxia" : crew.id === "vance" ? "sans" : crew.id === "lin" ? "solar" : "micro";
  const [sel, setSel] = useState<Key>(auto);
  useEffect(() => setSel(auto), [auto]);
  const proto = P[sel];
  const a = c("cmd"), b = c(proto.target);
  const path = `M${a.x} ${a.y} L200 ${a.y} L200 ${b.y} L${b.x} ${b.y}`;
  return (
    <div className="grid gap-10 md:grid-cols-[1fr_auto_1fr] md:gap-8">
      <section>
        <Label className="border-b border-foreground pb-2">Context-Aware Checklist</Label>
        <div className="mt-4 flex flex-wrap gap-2">
          {(Object.keys(P) as Key[]).map((k) => (
            <button key={k} onClick={() => setSel(k)} className={cn("pill flex items-center gap-1.5 !text-[0.6rem]", sel === k ? "bg-foreground text-background" : "border-meta text-meta hover:text-foreground")}>
              {k === auto && <Dot className="h-1.5 w-1.5" />}{P[k].name}
            </button>
          ))}
        </div>
        <h1 className="mt-8 font-serif text-3xl font-bold md:text-4xl">{proto.name}</h1>
        {sel === auto && <div className="meta mt-2 flex items-center gap-2"><Dot />Active alert for {crew.handle}</div>}
        <ol className="mt-6 space-y-4">
          {proto.steps.map((s, i) => (
            <li key={s} className="grid grid-cols-[2.5rem_1fr] border-t border-foreground/20 pt-4 font-serif text-lg">
              <span className="font-sc text-meta">{String(i + 1).padStart(2, "0")}</span>{s}
            </li>
          ))}
        </ol>
      </section>
      <div className="tilt-line hidden md:block" />
      <section className="card-ed p-5 md:p-8">
        <div className="flex items-baseline justify-between"><Label>Habitat Map</Label><span className="meta">Route → {MOD[proto.target]!.label}</span></div>
        <svg viewBox="0 0 400 410" className="mt-4 w-full" fill="none">
          <g stroke="currentColor" strokeWidth=".75" className="text-meta">
            <line x1="170" y1="65" x2="230" y2="65" /><line x1="95" y1="110" x2="95" y2="170" /><line x1="305" y1="110" x2="305" y2="170" />
            <line x1="170" y1="215" x2="230" y2="215" /><line x1="95" y1="260" x2="95" y2="320" /><line x1="305" y1="260" x2="305" y2="320" />
          </g>
          {Object.entries(MOD).map(([k, m]) => (
            <g key={k}>
              <rect x={m.x} y={m.y} width={m.w} height={m.h} rx="4" stroke="currentColor" strokeWidth={k === proto.target ? 2.5 : 1} />
              <text x={m.x + 10} y={m.y + 20} fill="currentColor" style={{ font: "10px var(--font-sans)", letterSpacing: ".15em" }}>{m.label.toUpperCase()}</text>
            </g>
          ))}
          <path d={path} stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 4" className="dash-anim" />
          <circle cx={a.x} cy={a.y} r="7" className="fill-alert blip" />
          <circle cx={b.x} cy={b.y} r="5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <div className="meta mt-3 flex items-center gap-2"><Dot />You • Command Deck</div>
      </section>
    </div>
  );
}
