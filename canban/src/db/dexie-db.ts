/** @format */

import { Dexie, type Table } from "dexie";
import type { Column, Comment, Task, User } from "./schema";

class KanbanDatabase extends Dexie {
  tasks!: Table<Task>;
  columns!: Table<Column>;
  comments!: Table<Comment>;
  users!: Table<User>;

  constructor() {
    super("KanbanLocalDB");

    this.version(1).stores({
      tasks: "id, columnId, projectId, [projectId+columnId], assignee",
      columns: "id, projectId",
      comments: "id, taskId, userId",
      users: "id",
    });
  }
}

export const db = new KanbanDatabase();
