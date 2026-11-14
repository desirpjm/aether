import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { SECTORS, type Crew, type Measurement } from "./telemetry";
export { SECTORS } from "./telemetry";
export type { Crew } from "./telemetry";
export const CREWS: Crew[] = [
  { id: "vance", handle: "@VANCE", name: "Cmdr. Elena Vance", short: "Cmdr. Vance", age: 42, sex: "F", bmi: 21.8, history: "Mild SANS optic disc edema", baseline: "Baseline IOP 16 mmHg; current reading trends +3 mmHg above pre-flight." },
  { id: "chen", handle: "@CHEN", name: "Dr. Marcus Chen", short: "Dr. Chen", age: 38, sex: "M", bmi: 23.4, history: "Prior L4–L5 lumbar strain", baseline: "Spinal elongation 4.1 cm; bone density holding within 2% of baseline." },
  { id: "lin", handle: "@LIN", name: "Spec. Maya Lin", short: "Spec. Lin", age: 31, sex: "F", bmi: 20.5, history: "Solar radiation sensitivity", baseline: "Cumulative dose at 71% of personal limit; shelter threshold lowered to 0.8 µSv/h spike." },
];

export type Sector = typeof SECTORS[number];

type State = {
  crew: Crew; registerCrew: (crew: Crew) => void; measurement: Measurement; logMeasurement: (m: Measurement) => void; routine: boolean[]; toggleRoutine: (i: number) => void; setCrewId: (id: string) => void; customId: string | null; setCustomId: (s: string | null) => void;
  dark: boolean; toggleDark: () => void; anomaly: boolean; toggleAnomaly: () => void;
  sector: Sector; setSectorId: (id: string) => void;
};
const Ctx = createContext<State | null>(null);

export function AetherProvider({ children }: { children: ReactNode }) {
  const [crewId, chooseCrew] = useState("vance");
  const [customCrew, setCustomCrew] = useState<Crew | null>(null);
  const [measurements, setMeasurements] = useState<Record<string, Measurement>>({});
  const [routines, setRoutines] = useState<Record<string, boolean[]>>({});
  const activeCrew = customCrew ?? CREWS.find(c => c.id === crewId) ?? CREWS[0];
  if (!activeCrew) throw new Error("Crew roster unavailable");
  const key = activeCrew.id;
  const routine = routines[key] ?? [false, false, false, false];
  const setCrewId = (id: string) => { setCustomCrew(null); chooseCrew(id); };
  const [customId, setCustomId] = useState<string | null>(null);
  const [dark, setDark] = useState(false);
  const [anomaly, setAnomaly] = useState(false);
  const [sectorId, setSectorId] = useState("iss");
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);
  return (
    <Ctx.Provider value={{
      crew: activeCrew, setCrewId, customId, setCustomId,
      registerCrew: c => { setCustomCrew(c); setCustomId(c.handle); },
      measurement: measurements[key] ?? {}, logMeasurement: m => setMeasurements(all => ({ ...all, [key]: { ...all[key], ...m } })),
      routine, toggleRoutine: i => setRoutines(all => ({ ...all, [key]: routine.map((v, n) => n === i ? !v : v) })),
      dark, toggleDark: () => setDark((d) => !d), anomaly, toggleAnomaly: () => setAnomaly((a) => !a),
      sector: SECTORS.find((s) => s.id === sectorId) ?? SECTORS[0], setSectorId,
    }}>{children}</Ctx.Provider>
  );
}
export const useAether = () => { const c = useContext(Ctx); if (!c) throw new Error("no provider"); return c; };

export function useNow(ms = 1000) {
  const [t, setT] = useState<number | null>(null);
  useEffect(() => { setT(Date.now()); const i = setInterval(() => setT(Date.now()), ms); return () => clearInterval(i); }, [ms]);
  return t;
}
export const jitter = (base: number, amp: number, t: number | null, seed = 1, dp = 1) =>
  (t === null ? base : base + Math.sin(t / 1700 * seed + seed) * amp).toFixed(dp);

export function met(t: number | null) {
  const start = 142 * 86400 + 18 * 3600 + 4 * 60 + 55;
  const base = typeof window === "undefined" || t === null ? 0 : Math.floor((t - BOOT) / 1000);
  const s = start + base;
  const p = (n: number) => String(n).padStart(2, "0");
  return `${Math.floor(s / 86400)}:${p(Math.floor(s / 3600) % 24)}:${p(Math.floor(s / 60) % 60)}:${p(s % 60)}`;
}
const BOOT = Date.now();
