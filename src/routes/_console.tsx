import { createFileRoute, Outlet } from "@tanstack/react-router";
import { TopBar } from "@/components/aether/TopBar";

export const Route = createFileRoute("/_console")({ component: Layout });

function Layout() {
  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12"><Outlet /></main>
      <footer className="meta mx-auto max-w-6xl px-4 pb-8 md:px-8">Aether • Cabin health almanac • Mock telemetry</footer>
    </div>
  );
}
