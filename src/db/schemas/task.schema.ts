/** @format */

export interface Task {
  id: string;
  columnId: string;
  projectId: string;
  order: number;

  title: string;
  description: string | null;
  priority: "low" | "medium" | "high" | "urgent";
  tags: string[];
  assignee: string | null;
  dueDate: string | null;

  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy?: string;
  deletedBy?: string;
  deletedAt?: string;
}

export type TaskResponse = Omit<
  Task,
  "createAt" | "createdBy" | "updatedBy" | "updatedAt"
> & {
  commentsCount: number;
};

export type TaskInput = Omit<
  Task,
  | "id"
  | "updatedAt"
  | "createdAt"
  | "updatedBy"
  | "deletedBy"
  | "deletedAt"
  | "assignee"
  | "description"
  | "dueDate"
  | "priority"
  | "tags"
  | "order"
> &
  Partial<
    Pick<
      Task,
      "assignee" | "description" | "dueDate" | "priority" | "tags" | "order"
    >
  >;
export type updateTaskBatchInput = {
  id: string;
  updates: Partial<TaskInput>;
}[];

export interface taskForm {
  title: string;
  tag?: string;
  dueDate?: string;
  priority?: string;
  assignee?: string;
  description?: string;
}
