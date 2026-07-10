/** @format */

import { createFileRoute } from "@tanstack/react-router";
import KanbanBoard from "../components/kanban/Board";

export const Route = createFileRoute("/kanban")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-[#211E21] text-white w-full h-screen">
      <KanbanBoard />
    </div>
  );
}
