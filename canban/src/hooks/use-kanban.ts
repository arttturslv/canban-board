/** @format */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { KanbanService } from "../db/services";
import type { TaskInput } from "../db/schema";
import { toast } from "sonner";

export function useKanban(projectId: string) {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: () => KanbanService.getTasksWithProps(projectId),
  });

  const columnsQuery = useQuery({
    queryKey: ["columns"],
    queryFn: () => KanbanService.getColumns(projectId),
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<TaskInput>;
    }) => {
      return KanbanService.updateTask(id, { ...updates });
    },

    onMutate: async (newVariables) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData(["tasks"]);

      queryClient.setQueryData(["tasks"], (oldTasks: any) => {
        return oldTasks.map((task: any) =>
          task.id === newVariables.id
            ? { ...task, ...newVariables.updates }
            : task,
        );
      });

      return { previousTasks };
    },

    onError: (_err, _newVariables, context) => {
      queryClient.setQueryData(["tasks"], context?.previousTasks);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const updateTasksBatchMutation = useMutation({
    mutationFn: (updatedTasks: { id: string; updates: Partial<TaskInput> }[]) =>
      KanbanService.updateTaskBatch(updatedTasks),
    onMutate: async (updatedTaskList) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const prevTasks = queryClient.getQueryData<any[]>(["tasks"]);

      queryClient.setQueryData(["tasks"], (oldTasks: any[] | undefined) => {
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
      });
      return { prevTasks };
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(["tasks"], context?.prevTasks);
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: ({ task }: { task: TaskInput }) => {
      console.log("task: ", task);

      return KanbanService.addTask(task);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },

    onError: () => toast.warning("Algo deu errado ao criar uma task"),
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
    columns: columnsQuery.data || [],
    isLoading: tasksQuery.isLoading,
    updateTask: updateTaskMutation,
    createTask: createTaskMutation, //todo - remover o mutate para ter estados e usar isSuccess...
    deleteTask: deleteTaskMutation,
    updateTaskBatch: updateTasksBatchMutation,
  };
}
