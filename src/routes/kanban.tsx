/** @format */

import { createFileRoute } from "@tanstack/react-router";
import KanbanBoard from "../components/kanban/board";
import { useAuthStore } from "@/store/use-auth-store";
import { LoginDialog } from "@/components/login-dialog";
import { useProjectsMutation } from "@/hooks/use-project-mutation";

export const Route = createFileRoute("/kanban")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuthStore();
  const { useProjects } = useProjectsMutation();
  const projects = useProjects();
  const projectId = projects.data?.[0]?.id;

  return (
    <div className="bg-linear-to-b from-[#211E21] to-[#080308] text-white w-full h-screen">
      <LoginDialog isLogged={user === null} />
      {projectId && <KanbanBoard project_id={projectId} />}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 opacity-50 z-0"
        style={{
          width: "100vw",
          height: 900,
          background:
            "radial-gradient(ellipse 140% 100% at 50% 0%, rgba(124,58,237,0.25) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
