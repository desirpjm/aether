import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { met, useAether, useNow } from "@/lib/aether";
import { pageHead } from "@/lib/head";
import { Button } from "@/components/ui/button";
import { Portrait } from "@/components/aether/Media";
import { telemetry, measurementRisk, routineCompliance } from "@/lib/telemetry";
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
  const { crew, customId, sector, anomaly, measurement, routine } = useAether();
  const t = useNow(1000);
  const v = telemetry(crew, anomaly, t, measurement);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const [to, setTo] = useState(0);
  const [sent, setSent] = useState<{ at: string; to: number } | null>(null);
  const [sending, setSending] = useState(false);
  const rows = [
    ["Crew ID", `${customId ?? crew.handle} — ${crew.name}`],
    ["Age / Sex / BMI", `${crew.age} / ${crew.sex} / ${crew.bmi}`],
    ["Medical History", crew.history],
    ["Active Sector", `${sector.name} — ${sector.orbit} • ${sector.coordinates}`],
    ["MET Timestamp", met(t)],
    ["Manual Self-Check", `BP ${v.bp} mmHg • Sleep ${v.sleep} hrs • Blood sugar ${measurement.sugar ?? "—"} mg/dL • Mood ${measurement.mood ?? "Not reported"}`],
    ["Personalized Risk", measurementRisk(measurement).join(" ") || "No manual flags reported"],
    ["Countermeasures", `${routineCompliance(routine)}% complete today`],
    ["Live Vitals", `HR ${v.hr} BPM • SpO₂ ${v.spo2}% • T ${v.temp} °C • IOP ${v.iop} mmHg • Dose ${v.dose} mSv`],
  ];
  const send = () => { setSending(true); timer.current = setTimeout(() => { setSending(false); setSent({ at: new Date().toISOString().replace("T", " ").slice(0, 19), to }); }, 1400); };
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-5"><Portrait id={crew.id} name={crew.name} /><div className="min-w-0"><h2 className="text-3xl">{crew.name}</h2><p className="font-sc text-sm">{customId ?? crew.handle} • Active crew dossier</p></div></div>
      <section>
        <Label className="border-b border-foreground pb-2">Select Recipient</Label>
        <div className="mt-8 flex flex-wrap justify-around gap-6">
          {CH.map((c, i) => <Node key={c.h} handle={c.h} active={to === i} onClick={() => { setTo(i); setSent(null); }} />)}
        </div>
      </section>
      <aside className="border-[3px] p-6 sm:p-10"><div className="font-mono text-xs">EST. ONE-WAY EARTH LATENCY: {sector.delay}</div><p className="mt-4 font-serif text-lg">Light takes time to travel from {sector.name} to Earth. A reply requires at least a round trip plus clinical review. Onboard triage must start now rather than wait for Houston.</p><p className="mt-3 font-mono text-[10px] text-meta">ONBOARD AUTONOMOUS TELEMETRY ENGINE (OFFLINE-READY)</p></aside>
      <section className="rounded-lg border border-foreground p-6 md:p-10">
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
          <Button variant="editorial" onClick={send} disabled={sending} className="action text-left disabled:opacity-40">{sending ? "Transmitting…" : `Transmit Priority Health Packet → ${CH[to]?.h}`}</Button>
          {sent && (
            <div className="text-left md:text-right">
              <div className="font-sc text-lg">Packet Dispatched • {CH[sent.to]?.n} Acknowledged</div>
              <div className="meta mt-1">{sent.at} UTC • Simulated local acknowledgment • {sector.delay} one-way light-time</div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
