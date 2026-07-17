/** @format */

import { db } from "../dexie-db";
import type { Column, ColumnInput } from "../schemas/index";

export const ColumnService = {
  async getColumns(projectId: string): Promise<Column[]> {
    return db.columns.filter((col) => col.projectId === projectId).toArray();
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
};
