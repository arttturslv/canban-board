/** @format */

export interface Column {
  id: string;
  projectId: string;
  title: string;
  order: number;
  visibility: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ColumnInput = Omit<
  Column,
  "id" | "visibility" | "order" | "createdAt" | "updatedAt"
>;

export type ColumnUpdate = Omit<Column, "id" | "projectId" | "createdAt">;
