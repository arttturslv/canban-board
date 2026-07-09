/** @format */

import { map } from "lodash";
import { db } from "./dexie-db";
import type {
  Column,
  ColumnInput,
  CommentInput,
  Task,
  TaskInput,
  TaskResponse,
} from "./schema";

export const KanbanService = {
  async getTasksWithProps(): Promise<TaskResponse[]> {
    const tasksPromise = db.tasks.filter((task) => !task.deletedAt).toArray();
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

    const nextOrder = tasksInColumn.length > 0 ? tasksInColumn.length + 1 : 1;

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

  async deleteTask(id: string) {
    const taskUpdated: Partial<Task> = {
      deletedAt: new Date().toISOString(),
      //deletedBy via header? todo
    };
    return await db.tasks.update(id, taskUpdated);
  },

  async createColumns(column: ColumnInput) {
    const collumnsLength = (await db.columns.toArray()).length;

    const newCollumn: Column = {
      id: crypto.randomUUID(),
      visibility: true,
      order: collumnsLength + 1,
      ...column,
    };

    return await db.columns.add(newCollumn);
  },

  async seedColumns() {
    const columnsCount = await db.columns.count();

    if (columnsCount === 0) {
      await db.columns.bulkAdd([
        {
          id: crypto.randomUUID(),
          order: 0,
          projectId: "project-1",
          title: "To Do",
          visibility: true,
        },
        {
          id: crypto.randomUUID(),
          order: 1,
          projectId: "project-1",
          title: "Doing",
          visibility: true,
        },
        {
          id: crypto.randomUUID(),
          order: 2,
          projectId: "project-1",
          title: "Done",
          visibility: true,
        },
        {
          id: crypto.randomUUID(),
          order: 3,
          projectId: "project-1",
          title: "Aborted",
          visibility: true,
        },
      ]);
    }
  },

  async getUser() {
    return db.users.toArray();
  },

  async getComments() {
    return db.comments.toArray();
  },

  async createComment(comment: CommentInput) {
    const newCommment = {
      id: crypto.randomUUID(),
      ...comment,
      reactions: [],
      readByIds: [],
    };

    await db.comments.add(newCommment);
  },
};
