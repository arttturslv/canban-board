/** @format */

import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useProjectsMutation } from "@/hooks/use-project-mutation";
import type { Project } from "@/db/schemas";
import { useAuthStore } from "@/store/use-auth-store";
import { cn } from "@/lib/utils";
import { FolderKanban, LogOut, X } from "lucide-react";

type AppSidebarProps = {
  currentProjectId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectProject?: (projectId: string) => void;
};

function getInitials(value?: string | null) {
  if (!value) return "U";

  const parts = value.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function AppSidebar({
  currentProjectId,
  isOpen,
  onClose,
  onSelectProject,
}: AppSidebarProps) {
  const { user, profile, logout } = useAuthStore();
  const { useProjects } = useProjectsMutation();
  const projectsQuery = useProjects();

  const projects = projectsQuery.data ?? [];
  const displayName = profile?.name ?? user?.email ?? "Usuário";
  const avatarUrl = profile?.avatar_url ?? user?.user_metadata?.avatar_url;
  const activeProject = projects.find(
    (project) => project.id === currentProjectId,
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      <div
        aria-hidden
        className={cn(
          "fixed inset-0 z-40 bg-black/55 transition-opacity duration-200",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      <Sidebar
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-[#0c060c] backdrop-blur-xl transition-transform duration-200",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-end  py-1">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-white/70 cursor-pointer hover:text-white"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </div>

        <SidebarHeader className="px-3 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 p-2">
              <Avatar size="sm" className="bg-violet-500/20 text-violet-200">
                <AvatarImage src={avatarUrl ?? undefined} alt={displayName} />
                <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {displayName}
                </p>
                <p className="truncate text-xs text-white/60">
                  {user?.email ?? "Faça login para continuar"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="justify-start text-white/70 cursor-pointer hover:text-white"
              onClick={() => logout()}
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </SidebarHeader>

        <SidebarContent className="p-2">
          <SidebarGroup>
            <SidebarGroupLabel>Projetos</SidebarGroupLabel>
            <SidebarGroupContent>
              {projectsQuery.isPending ? (
                <div className="space-y-2 p-2">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-10 animate-pulse rounded-xl bg-white/10"
                    />
                  ))}
                </div>
              ) : projectsQuery.isError ? (
                <p className="px-3 py-2 text-sm text-white/60">
                  Não foi possível carregar os projetos.
                </p>
              ) : projects.length === 0 ? (
                <p className="px-3 py-2 text-sm text-white/60">
                  Nenhum projeto disponível.
                </p>
              ) : (
                <SidebarMenu>
                  {projects.map((project: Project) => {
                    const isActive = project.id === activeProject?.id;

                    return (
                      <SidebarMenuItem key={project.id}>
                        <SidebarMenuButton
                          isActive={isActive}
                          onClick={() => {
                            onSelectProject?.(project.id);
                            onClose();
                          }}
                          className={cn(
                            "justify-start  cursor-pointer",
                            isActive
                              ? "bg-[#7B2EA8]/30"
                              : "hover:bg-[#7B2EA8]/10",
                          )}
                        >
                          <FolderKanban className="size-4" />
                          <span>{project.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
