/** @format */

import { supabase } from "@/lib/supabase";
import type { ProjectMemberDetail } from "../schemas";

export const ProjectMemberService = {
  // 1. Adicionar usuário diretamente pelo E-mail
  async addMemberByEmail(
    projectId: string,
    email: string,
    role: "editor" | "viewer" = "viewer",
  ) {
    const { data, error } = await supabase.rpc("add_project_member_by_email", {
      p_project_id: projectId,
      p_email: email,
      p_role: role,
    });

    if (error) {
      if (error.message.includes("duplicate key") || error.code === "23505") {
        throw new Error("Este usuário já faz parte deste projeto.");
      }
      throw new Error(error.message);
    }

    return data;
  },

  // 2. Listar todos os membros de um projeto com dados do perfil
  async getProjectMembers(projectId: string): Promise<ProjectMemberDetail[]> {
    const { data, error } = await supabase
      .from("project_members")
      .select(
        `
        id,
        project_id,
        user_id,
        role,
        joined_at,
        profiles (
          name,
          email,
          avatar_url
        )
      `,
      )
      .eq("project_id", projectId);

    if (error) throw error;

    return (data || []).map((member: any) => ({
      id: member.id,
      userId: member.user_id,
      projectId: member.project_id,
      role: member.role,
      joinedAt: member.joined_at,
      user: {
        name: member.profiles?.name ?? "Usuário Sem Nome",
        email: member.profiles?.email ?? "",
        avatarUrl: member.profiles?.avatar_url,
      },
    }));
  },

  // 3. Alterar a permissão de um membro existente (viewer <-> editor)
  async updateMemberRole(memberId: string, role: "editor" | "viewer") {
    const { data, error } = await supabase
      .from("project_members")
      .update({ role })
      .eq("id", memberId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 4. Remover um membro do projeto
  async removeMember(memberId: string) {
    const { error } = await supabase
      .from("project_members")
      .delete()
      .eq("id", memberId);

    if (error) throw error;
  },
};
