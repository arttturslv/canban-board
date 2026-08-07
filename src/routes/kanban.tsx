/** @format */

import {
  createFileRoute,
  useLocation,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import KanbanBoard from "../components/kanban/board";
import { useAuthStore } from "@/store/use-auth-store";
import { LoginDialog } from "@/components/login-dialog";
import { useProjectsMutation } from "@/hooks/use-project-mutation";
import { SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/kanban")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuthStore();
  const { useProjects } = useProjectsMutation();
  const projects = useProjects();
  const router = useRouter();
  const location = useLocation();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );

  const projectIdFromUrl = useMemo(() => {
    const params = new URLSearchParams(location.search ?? "");
    return params.get("projectId");
  }, [location.search]);

  useEffect(() => {
    if (!projects.data?.length) return;

    if (projectIdFromUrl) {
      const exists = projects.data.some(
        (project) => project.id === projectIdFromUrl,
      );
      if (exists) {
        setSelectedProjectId(projectIdFromUrl);
        return;
      }
    }

    if (
      !selectedProjectId ||
      !projects.data.some((project) => project.id === selectedProjectId)
    ) {
      const fallbackProjectId = projects.data[0].id;
      setSelectedProjectId(fallbackProjectId);
      router.navigate({
        to: "/kanban",
        search: (prev: Record<string, unknown>) => ({
          ...prev,
          projectId: fallbackProjectId,
        }),
      });
    }
  }, [projects.data, projectIdFromUrl, router, selectedProjectId]);

  const activeProjectId = selectedProjectId ?? projects.data?.[0]?.id ?? null;

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    router.navigate({
      to: "/kanban",
      search: (prev: Record<string, unknown>) => ({ ...prev, projectId }),
    });
  };

  return (
    <div className="bg-linear-to-b from-[#211E21] to-[#080308] text-white w-full h-screen">
      <SidebarProvider>
        <LoginDialog isLogged={user === null} />
        {activeProjectId ? (
          <KanbanBoard
            project_id={activeProjectId}
            onSelectProject={handleSelectProject}
          />
        ) : (
          <div className="flex h-screen w-full items-center justify-center px-4 text-center text-sm text-white/70">
            {projects.isPending
              ? "Carregando projetos..."
              : "Nenhum projeto disponível."}
          </div>
        )}
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
      </SidebarProvider>
    </div>
  );
}
