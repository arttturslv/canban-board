/** @format */

import { supabase } from "@/lib/supabase";
import type { ProfileUpdate, ProfileUser } from "../schemas";

export const AuthService = {
  /**
   * Envia o link de login (Magic Link).
   */
  async signInWithEmail({ email }: { email: string }) {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://canban.artttur.com";

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${origin}/kanban`,
      },
    });

    return { data, error };
  },

  /**
   * Busca os dados consolidados do perfil e configurações do usuário logado.
   */
  async getCurrentUserProfile(
    user_id: string,
  ): Promise<{ data: ProfileUser | null; error: any }> {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
        *,
        system:profile_settings!user_id(theme_dark, language, notifications_enabled)
      `,
      )
      .eq("id", user_id)
      .maybeSingle();

    if (error) return { data: null, error };
    if (!data) return { data: null, error: null };

    // Formatando o retorno para corresponder à interface ProfileUser
    const profileUser: ProfileUser = {
      id: data.id,
      email: data.email,
      name: data.name,
      born_date: data.born_date,
      avatar_url: data.avatar_url,
      created_at: data.created_at,
      updated_at: data.updated_at,
      system: Array.isArray(data.system) ? data.system[0] : data.system,
    };

    return { data: profileUser, error: null };
  },

  /**
   * Atualiza informações do Perfil e Configurações no Supabase.
   */
  async updateUser({
    user_id,
    profile,
  }: {
    user_id: string;
    profile: ProfileUpdate;
  }) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        name: profile.name,
        avatar_url: profile.avatar_url,
        born_date: profile.born_date,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user_id);

    if (profileError) return { data: null, error: profileError.message };

    const { error: settingsError } = await supabase
      .from("profile_settings")
      .update({
        language: profile.language,
        notifications_enabled: profile.notifications_enabled,
        theme_dark: profile.theme_dark,
      })
      .eq("user_id", user_id);

    if (settingsError) return { data: null, error: settingsError.message };

    return this.getCurrentUserProfile(user_id);
  },

  async signOut() {
    return await supabase.auth.signOut();
  },
};
