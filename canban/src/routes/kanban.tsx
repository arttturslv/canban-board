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
    <div className="bg-[#211E21] text-white w-full h-screen">
      <KanbanBoard projectId={initData.defaultProjectId} />
    </div>
  );
}
