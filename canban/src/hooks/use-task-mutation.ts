/** @format */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TaskService } from "../db/services/task.service";
import type { TaskInput } from "../db/schemas";
import { toast } from "sonner";

export function useTaskMutations(projectId: string) {
  const queryClient = useQueryClient();

  const useTask = (taskId: string | null) => {
    return useQuery({
      queryKey: ["task", taskId],
      queryFn: () => {
        return TaskService.getTaskById(taskId!);
      },

      enabled: !!taskId,
    });
  };

  const updateTaskMutation = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<TaskInput>;
    }) => {
      return TaskService.updateTask(id, { ...updates });
    },

    onMutate: async (newVariables) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });

      const previousTasks = queryClient.getQueryData(["tasks", projectId]);

      queryClient.setQueryData(["tasks", projectId], (oldTasks: any) => {
        return oldTasks.map((task: any) =>
          task.id === newVariables.id
            ? { ...task, ...newVariables.updates }
            : task,
        );
      });

      return { previousTasks };
    },

    onError: (_err, _newVariables, context) => {
      queryClient.setQueryData(["tasks", projectId], context?.previousTasks);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
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

  const deleteTaskMutation = useMutation({
    mutationFn: ({ taskId }: { taskId: string }) =>
      TaskService.deleteTask(taskId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });

  return {
    useTask: useTask,
    updateTask: updateTaskMutation,
    createTask: createTaskMutation,
    deleteTask: deleteTaskMutation,
    updateTaskBatch: updateTasksBatchMutation,
  };
}
