import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Crew = { id: string; handle: string; name: string; short: string; age: number; sex: string; bmi: number; history: string; baseline: string };
export const CREWS: Crew[] = [
  { id: "vance", handle: "@VANCE", name: "Cmdr. Elena Vance", short: "Cmdr. Vance", age: 42, sex: "F", bmi: 21.8, history: "Mild SANS optic disc edema", baseline: "Baseline IOP 16 mmHg; current reading trends +3 mmHg above pre-flight." },
  { id: "chen", handle: "@CHEN", name: "Dr. Marcus Chen", short: "Dr. Chen", age: 38, sex: "M", bmi: 23.4, history: "Prior L4–L5 lumbar strain", baseline: "Spinal elongation 4.1 cm; bone density holding within 2% of baseline." },
  { id: "lin", handle: "@LIN", name: "Spec. Maya Lin", short: "Spec. Lin", age: 31, sex: "F", bmi: 20.5, history: "Solar radiation sensitivity", baseline: "Cumulative dose at 71% of personal limit; shelter threshold lowered to 0.8 µSv/h spike." },
];

export type Sector = { id: string; name: string; orbit: string; tzOffset: number; temp: string; pressure: string; gravity: string; flux: string };
export const SECTORS: Sector[] = [
  { id: "iss", name: "ISS", orbit: "Low Earth Orbit", tzOffset: 0, temp: "−157 / +121 °C", pressure: "101.3 kPa", gravity: "0.00 g", flux: "0.42" },
  { id: "gateway", name: "Lunar Gateway", orbit: "NRHO Orbit", tzOffset: 0, temp: "−173 / +127 °C", pressure: "70.3 kPa", gravity: "0.00 g", flux: "0.61" },
  { id: "artemis", name: "Artemis Base", orbit: "Lunar South Pole", tzOffset: 0, temp: "−203 °C", pressure: "70.3 kPa / 0 atm", gravity: "0.166 g", flux: "0.57" },
  { id: "transit", name: "Deep Space", orbit: "Mars Transit Habitat", tzOffset: 0, temp: "−270 °C", pressure: "101.3 kPa", gravity: "0.00 g", flux: "1.84" },
  { id: "jezero", name: "Mars Surface", orbit: "Jezero Crater", tzOffset: -7, temp: "−63 °C", pressure: "0.61 kPa ext.", gravity: "0.38 g", flux: "0.67" },
];

type State = {
  crew: Crew; setCrewId: (id: string) => void; customId: string | null; setCustomId: (s: string | null) => void;
  dark: boolean; toggleDark: () => void; anomaly: boolean; toggleAnomaly: () => void;
  sector: Sector; setSectorId: (id: string) => void;
};
const Ctx = createContext<State | null>(null);

export function AetherProvider({ children }: { children: ReactNode }) {
  const [crewId, setCrewId] = useState("vance");
  const [customId, setCustomId] = useState<string | null>(null);
  const [dark, setDark] = useState(false);
  const [anomaly, setAnomaly] = useState(false);
  const [sectorId, setSectorId] = useState("iss");
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);
  return (
    <Ctx.Provider value={{
      crew: CREWS.find((c) => c.id === crewId)!, setCrewId, customId, setCustomId,
      dark, toggleDark: () => setDark((d) => !d), anomaly, toggleAnomaly: () => setAnomaly((a) => !a),
      sector: SECTORS.find((s) => s.id === sectorId)!, setSectorId,
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
