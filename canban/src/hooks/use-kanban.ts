/** @format */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { KanbanService } from "../db/services";
import type { TaskInput } from "../db/schema";

export function useKanban() {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: KanbanService.getTasksWithProps,
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<TaskInput>;
    }) => KanbanService.updateTask(id, updates),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: ({ task }: { task: TaskInput }) => KanbanService.addTask(task),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: ({ taskId }: { taskId: string }) =>
      KanbanService.deleteTask(taskId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return {
    tasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading,
    updateTask: updateTaskMutation,
    createTask: createTaskMutation.mutate, //todo - remover o mutate para ter estados e usar isSuccess...
    deleteTask: deleteTaskMutation,
  };
}
