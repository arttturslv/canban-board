/** @format */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnService } from "../db/services/column.service";
import type { ColumnInput, ColumnUpdate } from "../db/schemas";
import { toast } from "sonner";

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

  const createColumnMutation = useMutation({
    mutationFn: ({ column }: { column: ColumnInput }) => {
      return ColumnService.createColumn(column);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["columns"],
      });
    },

    onError: () => toast.warning("Algo deu errado ao criar uma coluna"),
  });

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
      await queryClient.cancelQueries({ queryKey: ["columns"] });

      const previousColumns = queryClient.getQueryData(["columns"]);

      queryClient.setQueryData(["columns"], (oldColumns: any) => {
        if (!Array.isArray(oldColumns)) return oldColumns;

        return oldColumns.map((col) =>
          col.id === newVariables.id
            ? { ...col, ...newVariables.updates }
            : col,
        );
      });

      return { previousColumns };
    },
    onError: () => toast.warning("Algo deu errado ao editar uma coluna"),

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["columns", "tasks"] });
    },
  });

  return {
    useColumn: useColumn,
    updateColumn: updateColumnMutation,
    createColumn: createColumnMutation,
  };
}
