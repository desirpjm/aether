import { Link } from "@tanstack/react-router";
import { useAether } from "@/lib/aether";
import { Dot } from "./ui";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/vitals", label: "01. Vitals" }, { to: "/sector", label: "02. Sector" }, { to: "/seal", label: "03. O₂ Seal" },
  { to: "/protocols", label: "04. Protocols" }, { to: "/comms", label: "05. Comms" },
] as const;

export function TopBar() {
  const { crew, customId, dark, toggleDark, anomaly, toggleAnomaly } = useAether();
  return (
    <header className="sticky top-0 z-20 bg-background/95 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-3 md:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/" className="flex items-center gap-2 font-sc text-sm hover:opacity-60">
            <Dot className={anomaly ? "blip" : ""} />{customId ?? crew.handle}
          </Link>
          <button onClick={toggleDark} className="pill hidden !py-1 !text-[0.6rem] sm:inline-block">{dark ? "Night-Vision" : "Daylight"}</button>
        </div>
        <Link to="/vitals" className="font-brand text-4xl font-semibold tracking-[0.08em] md:text-5xl">Aether</Link>
        <div className="flex items-center justify-end gap-2">
          <button onClick={toggleDark} className="pill !px-2 !py-1 !text-[0.6rem] sm:hidden">{dark ? "NV" : "DAY"}</button>
          <button onClick={toggleAnomaly} className={cn("pill flex items-center gap-2 !text-[0.6rem] md:!text-[0.7rem]", anomaly && "border-alert text-alert")}>
            <span className={cn("h-1.5 w-1.5 rounded-full", anomaly ? "bg-alert blip" : "bg-meta")} />
            <span className="hidden sm:inline">Simulate</span> Anomaly
          </button>
        </div>
      </div>
      <nav className="border-y border-foreground">
        <div className="mx-auto flex max-w-6xl gap-5 overflow-x-auto px-4 py-2.5 md:justify-between md:px-8">
          {TABS.map((t) => (
            <Link key={t.to} to={t.to} className="whitespace-nowrap font-sc text-sm tracking-[0.1em] text-meta hover:text-foreground"
              activeProps={{ className: "!text-foreground underline underline-offset-[6px]" }}>{t.label}</Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
