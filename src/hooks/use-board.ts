/** @format */

import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskService } from "../db/services/task.service";
import { ColumnService } from "../db/services/column.service";
import type { TaskInput } from "../db/schemas";
import { toast } from "sonner";

const EMPTY_ARRAY: any[] = [];

export function useKanban(project_id: string) {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ["tasks", project_id],
    queryFn: () => TaskService.getTasksWithProps(project_id),
    enabled: !!project_id,
  });

  const columnsQuery = useQuery({
    queryKey: ["columns", project_id],
    queryFn: () => ColumnService.getColumns(project_id),
    enabled: !!project_id,
  });

  const tasks = useMemo(
    () => tasksQuery.data ?? EMPTY_ARRAY,
    [tasksQuery.data],
  );
  const columns = useMemo(
    () => columnsQuery.data ?? EMPTY_ARRAY,
    [columnsQuery.data],
  );

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
    tasks,
    columns,
    updateTaskBatch: updateTasksBatchMutation,
    createTask: createTaskMutation,
    isLoading: tasksQuery.isLoading || columnsQuery.isLoading,
  };
}
