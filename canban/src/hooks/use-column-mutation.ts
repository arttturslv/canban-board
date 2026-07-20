/** @format */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnService } from "../db/services/column.service";
import type { ColumnUpdate } from "../db/schemas";

export function useColumnMutation() {
  const queryClient = useQueryClient();

  const useColumn = (columnId: string | null) => {
    return useQuery({
      queryKey: ["column", columnId],
      queryFn: () => {
        return ColumnService.getColumnById(columnId!);
      },

      enabled: !!columnId,
    });
  };

  const updateColumnMutation = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<ColumnUpdate>;
    }) => {
      return ColumnService.updateColumn(id, { ...updates });
    },

    onMutate: async (newVariables) => {
      await queryClient.cancelQueries({ queryKey: ["column"] });

      const previousColumns = queryClient.getQueryData(["column"]);

      queryClient.setQueryData(["column"], (oldProject: any) => {
        return {
          ...oldProject,
          ...newVariables.updates,
        };
      });

      return { previousColumns };
    },

    onError: (err) => console.log(err),

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["column", "tasks"] });
    },
  });

  return {
    useColumn: useColumn,
    updateColumn: updateColumnMutation,
  };
}
