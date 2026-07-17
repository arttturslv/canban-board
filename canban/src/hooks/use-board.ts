/** @format */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskService } from "../db/services/task.service";
import { ColumnService } from "../db/services/column.service";

import type { TaskInput } from "../db/schemas";
import { toast } from "sonner";

export function useKanban(projectId: string) {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => TaskService.getTasksWithProps(projectId),
  });

  const columnsQuery = useQuery({
    queryKey: ["columns"],
    queryFn: () => ColumnService.getColumns(projectId),
  });

  const updateTasksBatchMutation = useMutation({
    mutationFn: (updatedTasks: { id: string; updates: Partial<TaskInput> }[]) =>
      TaskService.updateTaskBatch(updatedTasks),
    onMutate: async (updatedTaskList) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });
      const prevTasks = queryClient.getQueryData<any[]>(["tasks", projectId]);

      queryClient.setQueryData(
        ["tasks", projectId],
        (oldTasks: any[] | undefined) => {
          if (!oldTasks) return [];

          const updatesMap = new Map(
            updatedTaskList.map((item) => [item.id, item.updates]),
          );

          return oldTasks.map((task) => {
            if (updatesMap.has(task.id)) {
              return { ...task, ...updatesMap.get(task.id) };
            }
            return task;
          });
        },
      );
      return { prevTasks };
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(["tasks", projectId], context?.prevTasks);
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: ({ task }: { task: TaskInput }) => {
      return TaskService.addTask(task);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },

    onError: () => toast.warning("Algo deu errado ao criar uma task"),
  });

  return {
    tasks: tasksQuery.data || [],
    columns: columnsQuery.data || [],
    updateTaskBatch: updateTasksBatchMutation,
    createTask: createTaskMutation,
    isLoading: tasksQuery.isLoading || columnsQuery.isLoading,
  };
}
