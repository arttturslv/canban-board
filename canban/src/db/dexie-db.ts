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
} from "./schemas";

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

    this.on("versionchange", () => {
      db.close();
      window.location.reload();
    });

    this.on("blocked", () => {
      alert(
        "Por favor, feche outras abas deste aplicativo para que os dados sejam atualizados em segurança.",
      );
    });
  }
}

export const db = new KanbanDatabase();
