/** @format */

export interface Project {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProjectInput = Omit<Project, "id" | "updatedAt" | "createdAt">;

export interface ProjectMembers {
  id: string;
  projectId: string;
  userId: string;
  role: "owner" | "editor" | "viewer";
  joinedAt: string;
}
