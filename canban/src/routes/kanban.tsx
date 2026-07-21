/** @format */

import { createFileRoute } from "@tanstack/react-router";
import KanbanBoard from "../components/kanban/Board";
import { useAppInit } from "@/hooks/use-app-init";

export const Route = createFileRoute("/kanban")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: initData, isLoading } = useAppInit(null);

  if (isLoading) {
    return "loading";
  }

  if (!initData?.defaultProjectId) {
    return "error";
  }

  return (
    <div className="bg-linear-to-b from-[#211E21] to-[#080308] text-white w-full h-screen">
      <KanbanBoard projectId={initData.defaultProjectId} />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 opacity-50 z-0"
        style={{
          width: 900,
          height: 600,
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
