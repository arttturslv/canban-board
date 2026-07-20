/** @format */

import { db } from "../dexie-db";
import type { Column, ColumnInput, ColumnUpdate } from "../schemas/index";

export const ColumnService = {
  async getColumnById(columnId: string): Promise<Column | undefined> {
    return db.columns.where("id").equals(columnId).first();
  },

  async getColumns(projectId: string): Promise<Column[]> {
    return db.columns.filter((col) => col.projectId === projectId).toArray();
  },

  async createColumns(column: ColumnInput) {
    const collumnsLength = (await db.columns.toArray()).length;

    const newCollumn: Column = {
      id: crypto.randomUUID(),
      visibility: true,
      ...column,
      order: collumnsLength + 1,
      updatedAt: new Date().toISOString(),
    };

    return await db.columns.add(newCollumn);
  },

  async updateColumn(id: string, updates: Partial<ColumnUpdate>) {
    const columnUpdated: Partial<Column> = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return await db.columns.update(id, columnUpdated);
  },
};
