import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAether, useNow } from "@/lib/aether";
import { pageHead } from "@/lib/head";
import { Button } from "@/components/ui/button";
import { Illustration } from "@/components/aether/Media";
import { telemetry } from "@/lib/telemetry";
import { Dot, Frame } from "@/components/aether/ui";

export const Route = createFileRoute("/_console/seal")({
  head: pageHead("O₂ Seal", "Oxygen mask and suit seal diagnostic with a 5-second scan."),
  component: Seal,
});

function Readout({ k, v, alert }: { k: string; v: string; alert?: boolean }) {
  return <div className="border-t border-foreground pt-3"><div className="meta flex items-center gap-2">{alert && <Dot className="blip" />}{k}</div><div className="mt-2 font-sans text-2xl tabular-nums md:text-3xl">{v}</div></div>;
}

function Seal() {
  const { anomaly, crew, measurement } = useAether();
  const t = useNow(1500);
  const v = telemetry(crew, anomaly, t, measurement);
  const [p, setP] = useState<number | null>(null);
  const [result, setResult] = useState<null | "pass" | "leak">(null);
  useEffect(() => {
    if (p === null) return;
    if (p >= 100) { setResult(anomaly ? "leak" : "pass"); setP(null); return; }
    const id = setTimeout(() => setP(p + 2), 100);
    return () => clearTimeout(id);
  }, [p, anomaly]);
  const reset = () => { setP(null); setResult(null); };
  return (
    <Frame label="Life Support Diagnostic" onClose={reset} className="mx-auto max-w-5xl">
      <div className="grid items-center gap-8 sm:grid-cols-2 md:grid-cols-[1fr_minmax(0,180px)_1fr]">
        <div className="space-y-8 order-2 md:order-1">
          <Readout k="Mask Seal Integrity" v={`${v.seal}%`} alert={anomaly} />
          <Readout k="O₂ Partial Pressure" v={`${v.ppO2} kPa`} alert={anomaly} />
        </div>
        <div className="relative order-1 col-span-full mx-auto md:col-span-1 aspect-[3/4] w-full max-w-[280px] overflow-hidden md:order-2">
          <Illustration kind="helmet" />
          {p !== null && <div className="absolute inset-x-0 h-px bg-foreground" style={{ top: `${p}%` }} />}
        </div>
        <div className="order-3 space-y-8">
          <Readout k="CO₂ Scrubber Capacity" v={`${v.scrubber}%`} />
          <Readout k="Respiratory Flow" v={`${v.flow} L/min`} alert={anomaly} />
        </div>
      </div>
      <p className="mt-6 font-mono text-[10px]">SpO₂ {v.spo2}% • PERSONALIZED THRESHOLD BASIS: {crew.handle}, age {crew.age} • Oxygen baseline 98%; anomaly simulation triggers low-oxygen review.</p>
      <div className="mt-10 border-t border-foreground pt-6">
        <div className="h-px w-full bg-meta/40"><div className="h-[3px] -translate-y-px bg-foreground transition-all" style={{ width: `${p ?? (result ? 100 : 0)}%` }} /></div>
        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Button variant="editorial" disabled={p !== null} onClick={() => { setResult(null); setP(0); }} className="action text-left disabled:opacity-40">
            {p !== null ? `Scanning… ${(p / 20).toFixed(1)} s` : "Run 5-Second Seal Scan"}
          </Button>
          {result === "pass" && <div className="font-serif text-xl font-bold">PASS — Seal holding. Flow nominal.</div>}
          {result === "leak" && <div className="flex items-center gap-2 font-serif text-xl font-bold text-alert"><Dot className="blip" />MICRO-LEAK — Right cheek gasket, −0.8 kPa/min.</div>}
          {!result && p === null && <span className="meta">Last scan • T−00:42:10</span>}
        </div>
      </div>
    </Frame>
  );
}
