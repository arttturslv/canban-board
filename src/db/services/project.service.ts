/** @format */

import { db } from "../dexie-db";
import type { Project, ProjectInput } from "../schemas/index";

export const ProjectService = {
  async getProjectById(projectId: string): Promise<Project | undefined> {
    return db.project.where("id").equals(projectId).first();
  },

  async getProjects(): Promise<Project[]> {
    return db.project.toArray();
  },

  async createProject(userId: string, project: Project) {
    const defaultProjectId = crypto.randomUUID();
    const memberId = crypto.randomUUID();

    await db
      .transaction("rw", [db.project, db.projectMembers], async () => {
        await db.project.add({
          ...project,
          id: defaultProjectId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        await db.projectMembers.add({
          id: memberId,
          projectId: defaultProjectId,
          userId: userId,
          role: "owner",
          joinedAt: new Date().toISOString(),
        });
      })
      .catch((e) => console.log(e));

    return defaultProjectId;
  },

  async updateProject(id: string, updates: Partial<ProjectInput>) {
    const projectUpdated: Partial<Project> = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return await db.project.update(id, projectUpdated);
  },
};
