import { createFileRoute } from "@tanstack/react-router";
import { met, SECTORS, useAether, useNow } from "@/lib/aether";
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
    ["Gravity", sector.gravity], ["Earth Light-Time", sector.delay], ["Radiation Environment", sector.radiation], ["Radiation Flux", `${anomaly ? (Number(sector.flux) * 6).toFixed(2) : sector.flux} µSv/h`],
  ];
  return (
    <div className="space-y-8">
      <div className="font-mono text-[10px] leading-relaxed">ONBOARD AUTONOMOUS TELEMETRY ENGINE (OFFLINE-READY)</div>
      <div className="meta flex flex-wrap gap-x-6 gap-y-1 border-b border-foreground pb-3 tabular-nums">
        <span>UTC {utc}</span><span>MET {met(t)}</span>
        <span>{sector.coordinates}</span>
      </div>
      <section className="grid gap-8 border-y py-8 md:grid-cols-[1fr_auto_1fr]">
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
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 items-baseline border-b border-foreground pb-2"><Label>Environmental Telemetry</Label><span className="meta max-w-24 text-right sm:max-w-none">Synced • Telemetry Snapshot</span></div>
        <div className="divide-y divide-foreground/20">
          {rows.map(([k, v]) => (
            <div key={k} className="flex flex-col justify-between gap-1 py-5 sm:flex-row sm:items-baseline">
              <span className="meta">{k}</span><span className="font-mono text-xl tabular-nums sm:text-2xl">{v}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
