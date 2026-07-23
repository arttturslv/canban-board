/** @format */

import { supabase } from "@/lib/supabase";

/** @format */
import { db } from "../dexie-db";
import type { Profile, ProfileSettings } from "../schemas";

export const AuthService = {
  async onboardUser({
    profile,
    profileSettings,
  }: {
    profile: Profile;
    profileSettings: ProfileSettings;
  }) {
    await db
      .transaction("rw", [db.profileSettings, db.profiles], async () => {
        await db.profileSettings.put(profileSettings);
        await db.profiles.put(profile);
      })
      .catch((_e) => {
        return { id: null, error: "Database transaction error" };
      });

    return { id: profile.id, error: null };
  },

  async signInWithEmail({ email }: { email: string }) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: "https://example.com/welcome",
      },
    });

    const user = data.user as any;
    const userId = (user.id as string) || null;

    return { userId, error };
  },
};
