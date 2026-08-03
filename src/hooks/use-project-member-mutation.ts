/** @format */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectMemberService } from "@/db/services/project-member.service";
import { toast } from "sonner";

export function useProjectMemberMutation(project_id: string) {
  const queryClient = useQueryClient();

  const useProjectMembers = () => {
    return useQuery({
      queryKey: ["project-member"],
      queryFn: () => {
        return ProjectMemberService.getProjectMembers(project_id!);
      },

      enabled: !!project_id,
    });
  };
  const addMemberByEmail = useMutation({
    mutationFn: ({
      email,
      role,
    }: {
      email: string;
      role?: "editor" | "viewer";
    }) => {
      return ProjectMemberService.addMemberByEmail(project_id, email, role);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-member"] });
    },

    onError: () => toast.warning("Algo deu errado ao criar uma task"),
  });

  return {
    useProjectMembers: useProjectMembers,
    addMemberByEmail: addMemberByEmail,
  };
}
