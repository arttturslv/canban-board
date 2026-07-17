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
  avatarUrl: string | null;
  provider: "github" | "google";
  createAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMembers {
  id: string;
  projectId: string;
  userId: string;
  role: "owner" | "editor" | "viewer";
  joinedAt: string;
}

export interface UserSettings {
  userId: string;
  theme: "dark" | "light";
  language: "pt-BR" | "en-US";
  notificationsEnabled: boolean;
}

export type taskPriority = "low" | "medium" | "high" | "urgent";
