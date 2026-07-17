/** @format */

export interface Column {
  id: string;
  projectId: string;
  title: string;
  order: number;
  visibility: boolean;
}

export type ColumnInput = Omit<Column, "id" | "order" | "visibility">;
