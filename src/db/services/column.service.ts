/** @format */

import { supabase } from "@/lib/supabase";
import type {
  Column,
  ColumnInput,
  ColumnInsert,
  ColumnUpdate,
} from "../schemas/index";

export const ColumnService = {
  async getColumnById(column_id: string): Promise<Column | undefined> {
    const { data, error } = await supabase
      .from("columns")
      .select("*")
      .eq("id", column_id)
      .maybeSingle();

    if (error) {
      console.error("Erro ao buscar coluna por ID:", error);
      return undefined;
    }

    if (!data) return undefined;

    return {
      id: data.id,
      project_id: data.project_id,
      title: data.title,
      order: data.order,
      visibility: data.visibility,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  },

  async getColumns(project_id: string): Promise<Column[]> {
    const { data, error } = await supabase
      .from("columns")
      .select("*")
      .eq("project_id", project_id)
      .order("order", { ascending: true });

    if (error) {
      console.error("Erro ao buscar colunas do projeto:", error);
      throw error;
    }

    return (data || []).map((col) => ({
      id: col.id,
      project_id: col.project_id,
      title: col.title,
      order: col.order,
      visibility: col.visibility,
      created_at: col.created_at,
      updated_at: col.updated_at,
    }));
  },

  async createColumn(column: ColumnInput): Promise<Column> {
    const { data: maxColumn } = await supabase
      .from("columns")
      .select("order")
      .eq("project_id", column.project_id)
      .order("order", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextOrder = (maxColumn?.order ?? 0) + 1;

    const newColumnPayload: ColumnInsert = {
      project_id: column.project_id,
      title: column.title,
      order: nextOrder,
      visibility: true,
    };

    const { data, error } = await supabase
      .from("columns")
      .insert(newColumnPayload)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      project_id: data.project_id,
      title: data.title,
      order: data.order,
      visibility: data.visibility,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  },

  async updateColumn(id: string, updates: Partial<ColumnUpdate>) {
    const payload: ColumnUpdate = {
      updated_at: new Date().toISOString(),
    };

    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.order !== undefined) payload.order = updates.order;
    if (updates.visibility !== undefined)
      payload.visibility = updates.visibility;

    const { data, error } = await supabase
      .from("columns")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteColumn(id: string) {
    const { error } = await supabase.from("columns").delete().eq("id", id);

    if (error) throw error;
  },
};
