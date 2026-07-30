/** @format */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "../db/services/project.service";
import type { ProjectInput } from "../db/schemas";

export function useProjectsMutation() {
  const queryClient = useQueryClient();

  const useProject = (projectId: string | null) => {
    return useQuery({
      queryKey: ["project", projectId],
      queryFn: () => {
        return ProjectService.getProjectById(projectId!);
      },

      enabled: !!projectId,
    });
  };

  const updateProjectMutation = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<ProjectInput>;
    }) => {
      return ProjectService.updateProject(id, { ...updates });
    },

    onMutate: async (newVariables) => {
      await queryClient.cancelQueries({ queryKey: ["projects"] });

      const previousProjects = queryClient.getQueryData(["projects"]);

      queryClient.setQueryData(["projects"], (oldProject: any) => {
        return {
          ...oldProject,
          ...newVariables.updates,
        };
      });

      return { previousProjects };
    },

    onError: (err) => console.log(err),

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return {
    useProject: useProject,
    updateProject: updateProjectMutation,
  };
}
