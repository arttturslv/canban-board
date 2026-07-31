/** @format */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskService } from "../db/services/task.service";
import { ColumnService } from "../db/services/column.service";

import type { TaskInput } from "../db/schemas";
import { toast } from "sonner";

export function useKanban(project_id: string) {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ["tasks", project_id],
    queryFn: () => TaskService.getTasksWithProps(project_id),
  });

  const columnsQuery = useQuery({
    queryKey: ["columns"],
    queryFn: () => ColumnService.getColumns(project_id),
  });

  const updateTasksBatchMutation = useMutation({
    mutationFn: (updatedTasks: { id: string; updates: Partial<TaskInput> }[]) =>
      TaskService.updateTaskBatch(updatedTasks),
    onMutate: async (updatedTaskList) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", project_id] });
      const prevTasks = queryClient.getQueryData<any[]>(["tasks", project_id]);

      queryClient.setQueryData(
        ["tasks", project_id],
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
      queryClient.setQueryData(["tasks", project_id], context?.prevTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", project_id] });
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: ({ task }: { task: TaskInput }) => {
      return TaskService.addTask(task);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", project_id] });
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
