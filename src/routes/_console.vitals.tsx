import { createFileRoute } from "@tanstack/react-router";
import { useAether, useNow } from "@/lib/aether";
import { pageHead } from "@/lib/head";
import { Dot, Frame, Label, TiltLine } from "@/components/aether/ui";
import { telemetry, measurementRisk } from "@/lib/telemetry";
import { Anatomy } from "@/components/aether/Anatomy";
import { Trends } from "@/components/aether/Trends";
import { SelfCheck } from "@/components/aether/SelfCheck";
import { Routine } from "@/components/aether/Routine";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_console/vitals")({
  head: pageHead("Vitals", "Live biometric and bio-band monitor for the active crew member."),
  component: Vitals,
});

function Vitals() {
  const { crew, anomaly, measurement } = useAether();
  const t = useNow(1200);
  const v = telemetry(crew, anomaly, t, measurement);
  const risks = measurementRisk(measurement);
  const m = [
    { k: "Heart Rate", v: v.hr, u: "BPM", alert: anomaly },
    { k: "SpO₂", v: v.spo2, u: "%", alert: anomaly },
    { k: "Core Temp", v: v.temp, u: "°C" },
    { k: "Radiation Dose", v: v.dose, u: "mSv" },
    { k: "Ocular / SANS", v: v.iop, u: "mmHg", watch: v.basis.sans },
    { k: "Hydration / Bone", v: v.hydration, u: "%" },
  ];
  return (
    <div className="space-y-8">
      <section className="py-4 sm:py-6">
        <p className="font-sans">Mission Day 142, <span className="underline underline-offset-4">{crew.short}</span>. Cabin status at a glance:</p>
        <h1 className={cn("mt-5 font-serif text-3xl leading-tight md:text-5xl", anomaly && "font-bold")}>
          {anomaly ? <><Dot className="blip mr-3 h-3 w-3 align-middle" />Oxygen saturation falling; tachycardia detected. Don mask now.</> : "Ocular pressure slightly elevated; cardiovascular rhythm nominal."}
        </h1>
        <p className="mt-6 max-w-2xl font-sans text-muted-foreground">
          {anomaly ? <>Critical in <u className="underline-offset-4">respiration</u> and <u className="underline-offset-4">cardiovascular</u>. Follow the hypoxia protocol and alert the flight surgeon.</>
            : <>Power in <u className="underline-offset-4">cardiovascular</u>, <u className="underline-offset-4">hydration</u>, and <u className="underline-offset-4">thermoregulation</u>. Watch <u className="underline-offset-4">ocular pressure</u> and <u className="underline-offset-4">radiation load</u>.</>}
        </p>
      </section>

      <section>
        <div className="flex items-baseline justify-between border-b border-foreground pb-2"><Label>Bio-Band Grid</Label><span className="meta">Live • 1.2 s refresh</span></div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-8">
          {m.map((x) => (
            <div key={x.k} className={cn("min-w-0 rounded-lg border p-4 sm:p-6", x.alert ? "border-alert" : "border-foreground")}>
              <div className="flex items-center justify-between"><span className="meta !tracking-normal">{x.k}</span>{(x.alert || (x.watch && anomaly)) && <Dot className="blip" />}</div>
              <div className="mt-4 font-mono text-2xl tabular-nums sm:text-3xl">{x.v}<span className="ml-1 text-sm text-meta">{x.u}</span></div>
            </div>
          ))}
        </div>
      </section>

      <div className="border-l-[3px] border-foreground pl-5 font-mono text-[10px] leading-relaxed">
        <div>PERSONALIZED THRESHOLD BASIS</div><p className="mt-2">{crew.age} years • {crew.sex === 'F' ? 'Female' : 'Male'} • BMI {crew.bmi} • HRmax = 220 − {crew.age} = {v.basis.maxHr} BPM. Resting pulse model ≈ 38% HRmax, with sex/BMI modifiers.</p>
        <p className="mt-2">IOP baseline {v.basis.iop} mmHg • {v.basis.sans ? 'SANS history: closer ocular review.' : 'No SANS history reported.'} Dose review at {v.basis.radiationLimit} mSv • {v.basis.radiation ? 'Radiation sensitivity lowers the simulated threshold.' : 'Standard demonstration threshold.'}</p>
      </div>
      <SelfCheck />
      <section className="border-t pt-6" aria-live="polite"><Label>Manual Crew Status</Label><p className="mt-3 font-mono text-xs">BP {v.bp} mmHg • Sleep {v.sleep} hrs • Blood sugar {measurement.sugar ?? '—'} mg/dL • Mood {measurement.mood ?? 'Not reported'}</p><p className="mt-3 font-serif">{risks.length ? risks.join(' ') : 'No self-reported flags in the demonstration review ranges.'}</p></section>
      <Frame label="Medical History Cross-Check">
        <div className="grid gap-4 md:grid-cols-[auto_1fr] md:gap-10">
          <div><div className="meta">{crew.handle} • {crew.age} • {crew.sex} • BMI {crew.bmi}</div><div className="mt-2 font-serif text-xl font-bold">{crew.history}</div></div>
          <p className="font-serif text-lg">{crew.baseline} {anomaly ? "Acute deviation exceeds personal tolerance — escalate." : "No action required beyond scheduled check."}</p>
        </div>
      </Frame>

      <Anatomy />
      <Trends />
      <Routine />
      <section className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-6 md:gap-12">
        <div><Label className="mb-4 border-b border-foreground pb-2">Nominal</Label>
          <ul className="space-y-2 font-serif text-lg">{["Cardiac rhythm", "Thermoregulation", "Hydration", "Sleep debt", ...(anomaly ? [] : ["Respiration"])].map((s) => <li key={s}>{s}</li>)}</ul></div>
        <TiltLine />
        <div><Label className="mb-4 border-b border-foreground pb-2">Watch</Label>
          <ul className="space-y-2 font-serif text-lg">{[...(anomaly ? ["Respiration", "Heart rate"] : []), "Ocular pressure", "Radiation load", "Bone density"].map((s) => <li key={s} className="flex items-center gap-2">{anomaly && (s === "Respiration" || s === "Heart rate") && <Dot />}{s}</li>)}</ul></div>
      </section>
    </div>
  );
}
