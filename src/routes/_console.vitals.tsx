import { createFileRoute } from "@tanstack/react-router";
import { jitter, useAether, useNow } from "@/lib/aether";
import { pageHead } from "@/lib/head";
import { Dot, Frame, Label, TiltLine } from "@/components/aether/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_console/vitals")({
  head: pageHead("Vitals", "Live biometric and bio-band monitor for the active crew member."),
  component: Vitals,
});

function Vitals() {
  const { crew, anomaly } = useAether();
  const t = useNow(1200);
  const m = [
    { k: "Heart Rate", v: jitter(anomaly ? 118 : 68, 2, t, 1, 0), u: "BPM", alert: anomaly },
    { k: "SpO₂", v: jitter(anomaly ? 89 : 98, 0.4, t, 2, 0), u: "%", alert: anomaly },
    { k: "Core Temp", v: jitter(36.8, 0.1, t, 3), u: "°C" },
    { k: "Radiation Dose", v: jitter(14.2, 0.05, t, 4), u: "mSv" },
    { k: "Ocular / SANS", v: jitter(anomaly ? 24 : 19, 0.5, t, 5, 0), u: "mmHg", watch: true },
    { k: "Hydration / Bone", v: jitter(94, 0.4, t, 6, 0), u: "%" },
  ];
  return (
    <div className="space-y-10">
      <section className="card-ed p-6 md:p-12">
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
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {m.map((x) => (
            <div key={x.k} className={cn("rounded-[24px] border p-5 md:p-6", x.alert ? "border-alert" : "border-foreground")}>
              <div className="flex items-center justify-between"><span className="meta">{x.k}</span>{(x.alert || (x.watch && anomaly)) && <Dot className="blip" />}</div>
              <div className="mt-4 font-sans text-3xl tabular-nums md:text-5xl">{x.v}<span className="ml-1 text-sm text-meta">{x.u}</span></div>
            </div>
          ))}
        </div>
      </section>

      <Frame label="Medical History Cross-Check">
        <div className="grid gap-4 md:grid-cols-[auto_1fr] md:gap-10">
          <div><div className="meta">{crew.handle} • {crew.age} • {crew.sex} • BMI {crew.bmi}</div><div className="mt-2 font-serif text-xl font-bold">{crew.history}</div></div>
          <p className="font-serif text-lg">{crew.baseline} {anomaly ? "Acute deviation exceeds personal tolerance — escalate." : "No action required beyond scheduled check."}</p>
        </div>
      </Frame>

      <section className="grid grid-cols-[1fr_auto_1fr] gap-6 md:gap-12">
        <div><Label className="mb-4 border-b border-foreground pb-2">Nominal</Label>
          <ul className="space-y-2 font-serif text-lg">{["Cardiac rhythm", "Thermoregulation", "Hydration", "Sleep debt", ...(anomaly ? [] : ["Respiration"])].map((s) => <li key={s}>{s}</li>)}</ul></div>
        <TiltLine />
        <div><Label className="mb-4 border-b border-foreground pb-2">Watch</Label>
          <ul className="space-y-2 font-serif text-lg">{[...(anomaly ? ["Respiration", "Heart rate"] : []), "Ocular pressure", "Radiation load", "Bone density"].map((s) => <li key={s} className="flex items-center gap-2">{anomaly && (s === "Respiration" || s === "Heart rate") && <Dot />}{s}</li>)}</ul></div>
      </section>
    </div>
  );
}
