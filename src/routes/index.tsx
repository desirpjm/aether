import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl rounded-[36px] border-[3px] border-foreground bg-surface-2 p-6 md:p-12">
        <div className="flex items-start justify-between">
          <div className="meta">NASA Crew ID • Badge Access</div>
          <button onClick={toggleDark} className="pill !text-[0.6rem]">{dark ? "Night-Vision" : "Daylight"}</button>
        </div>
        <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-6">
          <h1 className="text-right font-brand text-6xl font-semibold tracking-[0.08em] md:text-8xl">Aether</h1>
          <TiltLine className="h-24" />
          <p className="font-serif text-lg italic leading-snug md:text-xl">A cabin almanac for the body in orbit.</p>
        </div>
        <Label className="mt-10 border-b border-foreground pb-2">Select your badge</Label>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {CREWS.map((c) => (
            <button key={c.id} onClick={() => setCrewId(c.id)}
              className={cn("card-ed flex flex-col items-center gap-3 border p-6 text-center transition", crew.id === c.id ? "border-foreground" : "border-transparent hover:border-meta")}>
              <span className="h-20 w-20 rounded-full bg-node" />
              <span className="flex items-center gap-2 font-sans text-xs tracking-widest">{crew.id === c.id && <Dot />}{c.handle}</span>
              <span className="font-serif text-lg font-bold">{c.name}</span>
              <span className="meta">{c.age} • {c.sex} • BMI {c.bmi}</span>
              <span className="font-sans text-sm text-muted-foreground">History: {c.history}</span>
            </button>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <label className="flex-1">
            <span className="meta">Or enter custom NASA Crew ID</span>
            <input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="e.g. NASA-AX-0471"
              className="mt-2 block w-full border-b border-foreground bg-transparent py-2 font-sans tracking-widest outline-none placeholder:text-meta md:max-w-sm" />
          </label>
          <button onClick={enter} className="action text-left">Authenticate & Enter Cabin →</button>
        </div>
      </div>
    </div>
  );
}
