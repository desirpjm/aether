import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { jitter, met, useAether, useNow } from "@/lib/aether";
import { pageHead } from "@/lib/head";
import { Dot, Label, Node } from "@/components/aether/ui";

export const Route = createFileRoute("/_console/comms")({
  head: pageHead("Comms", "Flight surgeon comms and priority health packet dispatch."),
  component: Comms,
});

const CH = [
  { h: "@HOUSTON-SURGEON", n: "Houston Flight Surgeon" },
  { h: "@CREW-MED-OFFICER", n: "Crew Medical Officer" },
  { h: "@CAPCOM-DESK", n: "CAPCOM Desk" },
];

function Comms() {
  const { crew, customId, sector, anomaly } = useAether();
  const t = useNow(1000);
  const [to, setTo] = useState(0);
  const [sent, setSent] = useState<{ at: string; to: number } | null>(null);
  const [sending, setSending] = useState(false);
  const rows = [
    ["Crew ID", `${customId ?? crew.handle} — ${crew.name}`],
    ["Age / Sex / BMI", `${crew.age} / ${crew.sex} / ${crew.bmi}`],
    ["Medical History", crew.history],
    ["Active Sector", `${sector.name} — ${sector.orbit} • 28.5729° N, 80.6490° W, 408 km`],
    ["MET Timestamp", met(t)],
    ["Live Vitals", `HR ${jitter(anomaly ? 118 : 68, 2, t, 1, 0)} • SpO₂ ${anomaly ? 89 : 98}% • T 36.8 °C • IOP ${anomaly ? 24 : 19} mmHg • Dose 14.2 mSv`],
  ];
  const send = () => { setSending(true); setTimeout(() => { setSending(false); setSent({ at: new Date().toISOString().replace("T", " ").slice(0, 19), to }); }, 1400); };
  return (
    <div className="space-y-10">
      <section>
        <Label className="border-b border-foreground pb-2">Select Recipient</Label>
        <div className="mt-8 flex flex-wrap justify-around gap-6">
          {CH.map((c, i) => <Node key={c.h} handle={c.h} active={to === i} onClick={() => { setTo(i); setSent(null); }} />)}
        </div>
      </section>
      <section className="rounded-[24px] border border-foreground p-6 md:p-10">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="font-serif text-2xl font-bold md:text-3xl">Critical Health Telemetry Packet</h1>
          <span className="meta flex items-center gap-2">{anomaly && <Dot className="blip" />}{anomaly ? "Priority • Urgent" : "Priority • Routine"}</span>
        </div>
        <dl className="mt-6 divide-y divide-foreground/20">
          {rows.map(([k, v]) => (
            <div key={k} className="grid gap-1 py-3 sm:grid-cols-[200px_1fr]"><dt className="meta">{k}</dt><dd className="font-sans tabular-nums">{v}</dd></div>
          ))}
        </dl>
        <div className="mt-8 flex flex-col gap-3 border-t border-foreground pt-6 md:flex-row md:items-center md:justify-between">
          <button onClick={send} disabled={sending} className="action text-left disabled:opacity-40">{sending ? "Transmitting…" : `Transmit Priority Health Packet → ${CH[to].h}`}</button>
          {sent && (
            <div className="text-left md:text-right">
              <div className="font-sc text-lg">Packet Dispatched • {CH[sent.to].n} Acknowledged</div>
              <div className="meta mt-1">{sent.at} UTC • Relay TDRS-12 • 1.3 s latency</div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
