/** @format */

import { supabase } from "@/lib/supabase";
import type {
  Task,
  TaskInput,
  TaskInsert,
  TaskResponse,
  TaskUpdate,
  updateTaskBatchInput,
} from "../schemas/index";
import { useAuthStore } from "@/store/use-auth-store";

export const TaskService = {
  async getTaskById(taskId: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .is("deleted_at", null)
      .maybeSingle();

    if (error) {
      console.error("Erro ao buscar task:", error);
      return null;
    }

    if (!data) return null;

    return data;
  },

  async getTasksWithProps(project_id: string): Promise<TaskResponse[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select("*, comments(count)")
      .eq("project_id", project_id)
      .is("deleted_at", null)
      .order("order", { ascending: true });

    if (error) {
      console.error("Erro ao buscar tasks com propriedades:", error);
      throw error;
    }

    return (data || []).map((task: any) => ({
      ...task,
      id: task.id,
      column_id: task.column_id,
      project_id: task.project_id,
      order: task.order,
      title: task.title,
      description: task.description,
      priority: task.priority,
      tags: task.tags || [],
      assignee: task.assignee,
      due_date: task.due_date,
      commentsCount: task.comments[0]?.count ?? 0,
    }));
  },

  async addTask(task: TaskInput) {
    const user = useAuthStore.getState().user;
    const user_id = user?.id ?? null;

    if (!user_id) {
      throw new Error("Sessão expirada ou usuário não autenticado.");
    }

    const now = new Date().toISOString();

    const { data: maxTask } = await supabase
      .from("tasks")
      .select("order")
      .eq("project_id", task.project_id)
      .eq("column_id", task.column_id)
      .order("order", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextOrder = (maxTask?.order ?? -100) + 100;

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        project_id: task.project_id,
        column_id: task.column_id,
        title: task.title,
        description: task.description ?? null,
        priority: task.priority || "low",
        tags: task.tags ?? [],
        assignee: task.assignee ?? null,
        due_date: task.due_date ?? null,
        created_by: user_id,
        updated_by: user_id,
        order: nextOrder,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTask(id: string, updates: Partial<TaskInput>) {
    const payload: TaskUpdate = {
      updated_at: new Date().toISOString(),
    };

    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.description !== undefined)
      payload.description = updates.description;
    if (updates.priority !== undefined) payload.priority = updates.priority;
    if (updates.tags !== undefined) payload.tags = updates.tags;
    if (updates.assignee !== undefined) payload.assignee = updates.assignee;
    if (updates.due_date !== undefined) payload.due_date = updates.due_date;
    if (updates.column_id !== undefined) payload.column_id = updates.column_id;
    if (updates.order !== undefined) payload.order = updates.order;

    const { data, error } = await supabase
      .from("tasks")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTaskBatch(batch: updateTaskBatchInput) {
    const updates = batch.map(({ id, updates }) => ({
      id,
      updated_at: new Date().toISOString(),
      ...(updates.column_id !== undefined && { column_id: updates.column_id }),
      ...(updates.order !== undefined && { order: updates.order }),
      ...(updates.title !== undefined && { title: updates.title }),
      ...(updates.priority !== undefined && { priority: updates.priority }),
      ...(updates.assignee !== undefined && { assignee: updates.assignee }),
    }));

    const { data, error } = await supabase
      .from("tasks")
      .upsert(updates as TaskInsert[])
      .select();

    if (error) throw error;
    return data;
  },

  async deleteTask(id: string, user_id?: string) {
    const { data, error } = await supabase
      .from("tasks")
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: user_id ?? null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
