import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ScientificFooter } from "@/components/aether/Media";
import { TopBar } from "@/components/aether/TopBar";

export const Route = createFileRoute("/_console")({ component: Layout });

function Layout() {
  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <TopBar />
      <main className="mx-auto max-w-3xl px-5 py-8 md:py-12"><Outlet /></main>
      <ScientificFooter />
    </div>
  );
}
