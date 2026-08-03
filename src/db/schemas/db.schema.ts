/** @format */

import type { Database } from "@/lib/database.types";

// Tipos extraídos direto da tabela do Supabase
export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];
export type TaskUpdate = Database["public"]["Tables"]["tasks"]["Update"];
export type TaskInput = Omit<
  Task,
  | "id"
  | "updated_at"
  | "created_at"
  | "created_by"
  | "updated_by"
  | "deleted_by"
  | "deleted_at"
  | "order"
> & { order?: number };

export type updateTaskBatchInput = {
  id: string;
  updates: Partial<TaskInput>;
}[];
export type taskForm = Pick<
  Task,
  "title" | "tags" | "due_date" | "priority" | "assignee" | "description"
>;
export type TaskResponse = Task & {
  commentsCount: number;
};

export type Column = Database["public"]["Tables"]["columns"]["Row"];
export type ColumnInsert = Database["public"]["Tables"]["columns"]["Insert"];
export type ColumnUpdate = Database["public"]["Tables"]["columns"]["Update"];
export type ColumnInput = Omit<
  Column,
  "id" | "visibility" | "order" | "created_at" | "updated_at"
>;

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
export type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];
export type ProjectInput = Omit<Project, "id" | "updated_at" | "created_at">;

export type ProjectMember =
  Database["public"]["Tables"]["project_members"]["Row"];

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Omit<
  Profile,
  "provider" | "created_at" | "email" | "created_at" | "updated_at" | "id"
> &
  Omit<ProfileSettings, "user_id">;
export type ProfileSettings =
  Database["public"]["Tables"]["profile_settings"]["Row"];
export type ProfileUser = Profile & {
  system?: Omit<ProfileSettings, "user_id">;
};
export type ProfileInput = Omit<Profile, "created_at" | "updated_at">;

export type Comment = Database["public"]["Tables"]["comments"]["Row"];
export type CommentInput = Omit<Comment, "reactions" | "readByIds" | "id">;
export type CommentReactionInput = {
  commentId: string;
  user_id: string;
  reaction: string;
};
export interface CommentReaction {
  user_id: string;
  reaction: string;
}
export type CommentAgregated = Comment & {
  author: {
    id: string;
    avatar_url: string | null;
    name: string | null;
  };
};

export type ProjectMemberRole =
  Database["public"]["Enums"]["user_role"] | "owner" | "editor" | "viewer";

export interface ProjectMemberDetail {
  id: string; // ID da tabela project_members
  userId: string;
  projectId: string;
  role: string;
  joinedAt: string;
  user: {
    name: string | null;
    email: string | null;
    avatarUrl?: string | null;
  };
}
