import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { jitter, useAether, useNow } from "@/lib/aether";
import { pageHead } from "@/lib/head";
import { Dot, Frame } from "@/components/aether/ui";

export const Route = createFileRoute("/_console/seal")({
  head: pageHead("O₂ Seal", "Oxygen mask and suit seal diagnostic with a 5-second scan."),
  component: Seal,
});

function Readout({ k, v, alert }: { k: string; v: string; alert?: boolean }) {
  return <div className="border-t border-foreground pt-3"><div className="meta flex items-center gap-2">{alert && <Dot className="blip" />}{k}</div><div className="mt-2 font-sans text-2xl tabular-nums md:text-3xl">{v}</div></div>;
}

function Seal() {
  const { anomaly } = useAether();
  const t = useNow(1500);
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
      <div className="grid items-center gap-8 md:grid-cols-[1fr_minmax(0,280px)_1fr]">
        <div className="space-y-8 order-2 md:order-1">
          <Readout k="Mask Seal Integrity" v={`${anomaly ? jitter(93.1, 0.3, t, 1) : jitter(99.4, 0.1, t, 1)}%`} alert={anomaly} />
          <Readout k="O₂ Partial Pressure" v={`${anomaly ? jitter(17.6, 0.2, t, 2) : jitter(21.3, 0.1, t, 2)} kPa`} alert={anomaly} />
        </div>
        <div className="relative order-1 mx-auto aspect-[3/4] w-full max-w-[280px] overflow-hidden md:order-2">
          <svg viewBox="0 0 300 400" className="h-full w-full text-frame" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="4" y="4" width="292" height="392" strokeDasharray="4 6" />
            <ellipse cx="150" cy="150" rx="95" ry="110" className="text-foreground" stroke="currentColor" />
            <ellipse cx="150" cy="140" rx="70" ry="60" />
            <path d="M95 200 Q150 250 205 200 L195 245 Q150 275 105 245 Z" className="text-foreground" stroke="currentColor" />
            <circle cx="150" cy="235" r="12" />
            <path d="M138 245 C110 300 70 300 70 350 M162 245 C190 300 230 300 230 350" strokeDasharray="6 4" className={anomaly ? "dash-anim" : ""} />
            <rect x="50" y="350" width="40" height="30" rx="6" /><rect x="210" y="350" width="40" height="30" rx="6" />
            <line x1="40" y1="150" x2="260" y2="150" strokeWidth=".5" /><line x1="150" y1="30" x2="150" y2="330" strokeWidth=".5" />
            {anomaly && <circle cx="198" cy="222" r="6" className="fill-alert blip" stroke="none" />}
          </svg>
          {p !== null && <div className="absolute inset-x-0 h-px bg-foreground" style={{ top: `${p}%` }} />}
        </div>
        <div className="order-3 space-y-8">
          <Readout k="CO₂ Scrubber Capacity" v={`${jitter(88, 0.4, t, 3, 0)}%`} />
          <Readout k="Respiratory Flow" v={`${anomaly ? jitter(22.8, 0.5, t, 4) : jitter(14.5, 0.3, t, 4)} L/min`} alert={anomaly} />
        </div>
      </div>
      <div className="mt-10 border-t border-foreground pt-6">
        <div className="h-px w-full bg-meta/40"><div className="h-[3px] -translate-y-px bg-foreground transition-all" style={{ width: `${p ?? (result ? 100 : 0)}%` }} /></div>
        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <button disabled={p !== null} onClick={() => { setResult(null); setP(0); }} className="action text-left disabled:opacity-40">
            {p !== null ? `Scanning… ${(p / 20).toFixed(1)} s` : "Run 5-Second Seal & Flow Scan"}
          </button>
          {result === "pass" && <div className="font-serif text-xl font-bold">PASS — Seal holding. Flow nominal.</div>}
          {result === "leak" && <div className="flex items-center gap-2 font-serif text-xl font-bold text-alert"><Dot className="blip" />MICRO-LEAK — Right cheek gasket, −0.8 kPa/min.</div>}
          {!result && p === null && <span className="meta">Last scan • T−00:42:10</span>}
        </div>
      </div>
    </Frame>
  );
}
