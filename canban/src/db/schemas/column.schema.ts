/** @format */

export interface Column {
  id: string;
  projectId: string;
  title: string;
  order: number;
  visibility: boolean;
  updatedAt: string;
}

export type ColumnInput = Omit<Column, "id" | "visibility">;

export type ColumnUpdate = Omit<Column, "id" | "projectId">;
