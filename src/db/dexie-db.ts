/** @format */

import { Dexie, type Table } from "dexie";
import type {
  Column,
  Comment,
  Task,
  Profile,
  ProfileSettings,
  Project,
  ProjectMembers,
} from "./schemas";

class KanbanDatabase extends Dexie {
  tasks!: Table<Task>;
  columns!: Table<Column>;
  comments!: Table<Comment>;
  profiles!: Table<Profile>;
  profileSettings!: Table<ProfileSettings>;
  projectMembers!: Table<ProjectMembers>;
  project!: Table<Project>;

  constructor() {
    super("KanbanLocalDB");

    this.version(1).stores({
      tasks: "id, columnId, projectId, [projectId+columnId], assignee",
      columns: "id, projectId",
      comments: "id, taskId, userId",
      profiles: "id, email",
      projectMembers: "id, projectId, userId",
      profileSettings: "userId",
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
