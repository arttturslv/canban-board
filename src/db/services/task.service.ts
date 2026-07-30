/** @format */

import { map } from "lodash";
import { db } from "../dexie-db";
import type {
  Task,
  TaskInput,
  TaskResponse,
  updateTaskBatchInput,
} from "../schemas/index";

export const TaskService = {
  async getTaskById(taskId: string): Promise<Task | undefined> {
    return db.tasks.where("id").equals(taskId).first();
  },

  async getTasksWithProps(projectId: string): Promise<TaskResponse[]> {
    const tasksPromise = db.tasks
      .filter((task) => !task.deletedAt && task.projectId === projectId)
      .toArray();
    const commentsPromise = db.comments.toArray();

    const [tasks, comments] = await Promise.all([
      tasksPromise,
      commentsPromise,
    ]);

    const commentsCount = new Map<string, number>();

    for (const comment of comments) {
      commentsCount.set(
        comment.taskId,
        (commentsCount.get(comment.taskId) ?? 0) + 1,
      );
    }

    return map(tasks, (task) => ({
      ...task,
      commentsCount: commentsCount.get(task.id) ?? 0,
    }));
  },

  async addTask(task: TaskInput) {
    const tasksInColumn = await db.tasks
      .where("[projectId+columnId]")
      .equals([task.projectId, task.columnId])
      .toArray();

    const maxOrder = tasksInColumn.reduce(
      (max, t) => (t.order > max ? t.order : max),
      -100,
    );
    const nextOrder = maxOrder + 100;

    const newTask: Task = {
      id: crypto.randomUUID(),

      ...task,
      tags: task.tags ?? [],
      assignee: task.assignee ?? null,
      dueDate: task.dueDate ?? null,
      description: task.description ?? "",
      createdAt: new Date().toISOString(),
      priority: task.priority || "low",
      updatedAt: new Date().toISOString(),
      updatedBy: task.createdBy,
      order: nextOrder,
    };

    await db.tasks.add(newTask);
  },

  async updateTask(id: string, updates: Partial<TaskInput>) {
    const taskUpdated: Partial<Task> = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return await db.tasks.update(id, taskUpdated);
  },

  async updateTaskBatch(batch: updateTaskBatchInput) {
    return await db.tasks.bulkUpdate(
      batch.map(({ id, updates }) => ({
        key: id,
        changes: {
          ...updates,
          updatedAt: new Date().toISOString(),
        },
      })),
    );
  },

  async deleteTask(id: string) {
    const taskUpdated: Partial<Task> = {
      deletedAt: new Date().toISOString(),
      //deletedBy via header? todo
    };
    return await db.tasks.update(id, taskUpdated);
  },
};
