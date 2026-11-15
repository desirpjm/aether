import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CrewIntake } from "@/components/aether/CrewIntake";
import { Illustration, Portrait, ScientificFooter } from "@/components/aether/Media";
import { useState } from "react";
import { CREWS, useAether } from "@/lib/aether";
import { pageHead } from "@/lib/head";
import { Dot, Label, TiltLine } from "@/components/aether/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: pageHead("Crew Badge Access", "Select your NASA crew badge to enter the Aether cabin console."),
  component: Entry,
});

function Entry() {
  const { crew, setCrewId, setCustomId, dark, toggleDark } = useAether();
  const [custom, setCustom] = useState("");
  const nav = useNavigate();
  const enter = () => { setCustomId(custom.trim() ? custom.trim().toUpperCase() : null); nav({ to: "/vitals" }); };
  return (
    <div className="min-h-screen px-5 py-10">
      <div className="mx-auto w-full max-w-3xl border-[3px] border-foreground bg-surface-2 p-6 sm:p-10">
        <div className="flex items-start justify-between">
          <div className="meta">NASA Crew ID • Badge Access</div>
          <Button variant="editorial" onClick={toggleDark} className="pill !text-[0.6rem]">{dark ? "Night-Vision" : "Daylight"}</Button>
        </div>
        <div className="mt-8"><Illustration kind="emblem" /></div>
        <div className="mt-6 grid items-center gap-6 sm:grid-cols-[1fr_auto_1fr]">
          <h1 className="text-center font-brand text-6xl font-normal sm:text-right md:text-8xl">Aether</h1>
          <TiltLine className="hidden h-24 sm:block" />
          <p className="text-center font-serif text-lg italic leading-snug sm:text-left md:text-xl">A cabin almanac for the body in orbit.</p>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2 font-mono text-[10px] text-meta">
          <a href="https://github.com/desirpjm/aether/" target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-foreground">SOURCE CODE (GITHUB)</a>
          <span>•</span>
          <a href="https://aether-manual.tiiny.site/" target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-foreground">CREW FLIGHT MANUAL</a>
        </div>
        <Label className="mt-10 border-b border-foreground pb-2">Select your badge</Label>
        <div className="mt-6 grid gap-8 md:grid-cols-3">
          {CREWS.map((c) => (
            <Button variant="editorial" key={c.id} onClick={() => setCrewId(c.id)}
              className={cn("card-ed h-auto whitespace-normal flex flex-col items-center gap-3 border p-6 text-center transition", crew.id === c.id ? "border-foreground" : "border-transparent hover:border-meta")}>
              <Portrait id={c.id} name={c.name} />
              <span className="flex items-center gap-2 font-sans text-xs tracking-widest">{crew.id === c.id && <Dot />}{c.handle}</span>
              <span className="font-serif text-lg font-bold">{c.name}</span>
              <span className="meta">{c.age} • {c.sex} • BMI {c.bmi}</span>
              <span className="font-sans text-sm text-muted-foreground">History: {c.history}</span>
            </Button>
          ))}
        </div>
        <CrewIntake />
        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <label className="flex-1">
            <span className="meta">Or enter custom NASA Crew ID</span>
            <input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="e.g. NASA-AX-0471"
              className="mt-2 block w-full border-b border-foreground bg-transparent py-2 font-sans tracking-widest outline-none placeholder:text-meta md:max-w-sm" />
          </label>
          <Button variant="editorial" onClick={enter} className="action text-left">Authenticate & Enter Cabin →</Button>
        </div>
      </div>
      <ScientificFooter />
    </div>
  );
}
