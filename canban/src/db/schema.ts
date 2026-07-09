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

export interface Column {
  id: string;
  projectId: string;
  title: string;
  order: number;
  visibility: boolean;
}

export type ColumnInput = Omit<Column, "id" | "order" | "visibility">;

export interface Comment {
  id: string;
  projectId: string;
  taskId: string;

  content: string;
  attachments: string[];

  reactions: CommentReaction[];
  readByIds: string[];
  createdAt: string;
  createdBy: string;
}

export type CommentInput = Omit<Comment, "reactions" | "readByIds" | "id">;

export type CommentReactionInput = {
  commentId: string;
  userId: string;
  reaction: string;
};

export interface CommentReaction {
  userId: string;
  reaction: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string | null;
}

export type taskPriority = "low" | "medium" | "high" | "urgent";
