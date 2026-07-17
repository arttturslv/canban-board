/** @format */

import { Dexie, type Table } from "dexie";
import type {
  Column,
  Comment,
  Task,
  User,
  UserSettings,
  Project,
  ProjectMembers,
} from "./schema";

class KanbanDatabase extends Dexie {
  tasks!: Table<Task>;
  columns!: Table<Column>;
  comments!: Table<Comment>;
  users!: Table<User>;
  userSettings!: Table<UserSettings>;
  projectMembers!: Table<ProjectMembers>;
  project!: Table<Project>;

  constructor() {
    super("KanbanLocalDB");

    this.version(1).stores({
      tasks: "id, columnId, projectId, [projectId+columnId], assignee",
      columns: "id, projectId",
      comments: "id, taskId, userId",
      users: "id",
      projectMembers: "id, projectId, userId",
      userSettings: "userId",
      project: "id",
    });
  }
}

export const db = new KanbanDatabase();
