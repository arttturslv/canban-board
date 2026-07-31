/** @format */

import { supabase } from "@/lib/supabase";
import type {
  Project,
  ProjectInput,
  ProjectInsert,
  ProjectUpdate,
} from "../schemas/index";
import { useAuthStore } from "@/store/use-auth-store";

export const ProjectService = {
  async getProjectById(project_id: string): Promise<Project | undefined> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", project_id)
      .maybeSingle();

    if (error) {
      console.error("Erro ao buscar projeto por ID:", error);
      return undefined;
    }

    if (!data) return undefined;

    return {
      id: data.id,
      name: data.name,
      description: data.description ?? null,
      is_public: data.is_public,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  },

  async getProjects(): Promise<Project[]> {
    const user = useAuthStore.getState().user;
    const user_id = user?.id ?? null;

    if (!user_id) {
      throw new Error("Sessão expirada ou usuário não autenticado.");
    }

    const { data, error } = await supabase
      .from("projects")
      .select("*, project_members!inner(user_id)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar projetos do usuário:", error);
      throw error;
    }

    return data || [];
  },

  async createProject(user_id: string, project: ProjectInput): Promise<string> {
    const projectPayload: ProjectInsert = {
      name: project.name,
      description: project.description ?? null,
      is_public: project.is_public ?? false,
    };

    const { data: newProject, error: projectError } = await supabase
      .from("projects")
      .insert(projectPayload)
      .select("id")
      .single();

    if (projectError) throw projectError;

    const { error: memberError } = await supabase
      .from("project_members")
      .insert({
        project_id: newProject.id,
        user_id: user_id,
        role: "owner",
      });

    if (memberError) {
      console.error("Erro ao associar o criador ao projeto:", memberError);
      throw memberError;
    }

    return newProject.id;
  },

  async updateProject(id: string, updates: Partial<ProjectInput>) {
    const payload: ProjectUpdate = {
      updated_at: new Date().toISOString(),
    };

    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.description !== undefined)
      payload.description = updates.description;
    if (updates.is_public !== undefined) payload.is_public = updates.is_public;

    const { data, error } = await supabase
      .from("projects")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
