import { createFileRoute } from "@tanstack/react-router";
import { jitter, met, SECTORS, useAether, useNow } from "@/lib/aether";
import { pageHead } from "@/lib/head";
import { Label, TiltLine } from "@/components/aether/ui";

export const Route = createFileRoute("/_console/sector")({
  head: pageHead("Sector", "Space sector environment and live telemetry readouts."),
  component: Sector,
});

function Sector() {
  const { sector, setSectorId, anomaly } = useAether();
  const t = useNow(1000);
  const utc = t ? new Date(t).toISOString().slice(11, 19) : "--:--:--";
  const local = t ? new Date(t + sector.tzOffset * 3600e3).toISOString().slice(11, 19) : "--:--:--";
  const rows = [
    ["Local Zone Time", local], ["External Temp", sector.temp], ["Cabin / Atm Pressure", sector.pressure],
    ["Gravity", sector.gravity], ["Radiation Flux", `${anomaly ? (Number(sector.flux) * 6).toFixed(2) : sector.flux} µSv/h`],
  ];
  return (
    <div className="space-y-10">
      <div className="meta flex flex-wrap gap-x-6 gap-y-1 border-b border-foreground pb-3 tabular-nums">
        <span>UTC {utc}</span><span>MET {met(t)}</span>
        <span>LAT {jitter(28.5729, 0.002, t, 1, 4)}° N</span><span>LON {jitter(80.649, 0.002, t, 2, 4)}° W</span><span>ALT {jitter(408, 0.3, t, 3, 0)} KM</span>
      </div>
      <section className="card-ed grid gap-6 p-6 md:grid-cols-[1fr_auto_1fr] md:p-12">
        <div>
          <Label>Space Sector</Label>
          <select value={sector.id} onChange={(e) => setSectorId(e.target.value)}
            className="mt-4 w-full cursor-pointer border-b border-foreground bg-transparent py-2 font-serif text-2xl outline-none md:text-3xl">
            {SECTORS.map((s) => <option key={s.id} value={s.id} className="bg-background text-base">{s.name} — {s.orbit}</option>)}
          </select>
        </div>
        <TiltLine className="hidden md:block" />
        <div className="self-end">
          <h1 className="font-serif text-4xl md:text-5xl">{sector.name}</h1>
          <p className="mt-1 font-sc text-lg text-muted-foreground">{sector.orbit}</p>
        </div>
      </section>
      <section>
        <div className="flex items-baseline justify-between border-b border-foreground pb-2"><Label>Environmental Telemetry</Label><span className="meta">Synced • Telemetry Snapshot</span></div>
        <div className="divide-y divide-foreground/20">
          {rows.map(([k, v]) => (
            <div key={k} className="flex flex-col justify-between gap-1 py-5 sm:flex-row sm:items-baseline">
              <span className="meta">{k}</span><span className="font-sans text-2xl tabular-nums md:text-3xl">{v}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
