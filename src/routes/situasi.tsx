import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SituationProvider } from "@/features/situasi/context";

export const Route = createFileRoute("/situasi")({ component: SituasiLayout });

function SituasiLayout() {
  return <SituationProvider><Outlet /></SituationProvider>;
}