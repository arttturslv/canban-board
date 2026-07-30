/** @format */
import { db } from "../dexie-db";

export const AppInitializerService = {
  async ensureBasicStructure(currentUserId: string) {
    const hasSettings = await db.profileSettings.get(currentUserId);

    if (!hasSettings) {
      console.log("Primeira execução detectada. Criando estrutura básica...");

      const defaultProjectId = crypto.randomUUID();
      const memberId = crypto.randomUUID();
      const currentDate = new Date().toISOString();

      await db
        .transaction(
          "rw",
          [db.profileSettings, db.project, db.projectMembers, db.columns],
          async () => {
            await db.profileSettings.add({
              userId: currentUserId,
              themeDark: true,
              language: "pt-BR",
              notificationsEnabled: false,
            });

            await db.project.add({
              id: defaultProjectId,
              name: "Meu Primeiro Quadro",
              description: "Este é o seu Kanban inicial local!",
              isPublic: false,
              createdAt: currentDate,
              updatedAt: currentDate,
            });

            await db.projectMembers.add({
              id: memberId,
              projectId: defaultProjectId,
              userId: currentUserId,
              role: "owner",
              joinedAt: currentDate,
            });

            const defaultColumns = [
              {
                id: crypto.randomUUID(),
                projectId: defaultProjectId,
                title: "🚀 Todo",
                order: 1,
                visibility: true,
                createdAt: currentDate,
                updatedAt: currentDate,
              },
              {
                id: crypto.randomUUID(),
                projectId: defaultProjectId,
                title: "⏳ Doing",
                order: 2,
                visibility: true,
                createdAt: currentDate,
                updatedAt: currentDate,
              },
              {
                id: crypto.randomUUID(),
                projectId: defaultProjectId,
                title: "✅ Done",
                order: 3,
                visibility: true,
                createdAt: currentDate,
                updatedAt: currentDate,
              },
            ];

            await db.columns.bulkAdd(defaultColumns);
          },
        )
        .catch((e) => console.log(e));

      return { isFirstTime: true, defaultProjectId };
    }

    const mainMemberShip = await db.projectMembers
      .where("userId")
      .equals(currentUserId)
      .first();
    return { isFirstTime: false, defaultProjectId: mainMemberShip?.projectId };
  },
};
