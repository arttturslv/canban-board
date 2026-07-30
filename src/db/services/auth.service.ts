/** @format */

import { supabase } from "@/lib/supabase";

/** @format */
import { db } from "../dexie-db";
import type {
  Profile,
  ProfileInput,
  ProfileSettings,
  ProfileUpdate,
  ProfileUser,
} from "../schemas";

export const AuthService = {
  async onboardUser({
    profile,
    profileSettings,
  }: {
    profile: ProfileInput;
    profileSettings: ProfileSettings;
  }) {
    const newProfile: Profile = {
      ...profile,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    await db
      .transaction("rw", [db.profileSettings, db.profiles], async () => {
        await db.profileSettings.put(profileSettings);
        await db.profiles.put(newProfile);
      })
      .catch((_e) => {
        return { id: null, data: null, error: "Database transaction error" };
      });

    const profileResult = await db.profiles.get(profile.id);
    const settingsResult = await db.profileSettings.get(profile.id);

    if (!profileResult || !settingsResult) {
      return { id: profile.id, data: null, error: "Profile not found" };
    }

    const profileUser: ProfileUser = {
      ...profileResult,
      system: settingsResult,
    };

    return { id: profile.id, data: profileUser, error: null };
  },

  async signInWithEmail({ email }: { email: string }) {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://canban.artttur.com";

    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${origin}/kanban`,
      },
    });

    const user = data?.user as any;
    const userId = (user?.id as string) || null;

    return { userId, error };
  },

  async signOut() {
    await supabase.auth.signOut();
  },

  async updateUser({
    userId,
    profile,
  }: {
    userId: string;
    profile: ProfileUpdate;
  }) {
    const updatedProfile: Partial<Profile> = {
      avatarUrl: profile.avatarUrl,
      bornDate: profile.bornDate,
      name: profile.name,
      updatedAt: new Date().toISOString(),
    };

    const updatedProfileSettings: Partial<ProfileSettings> = {
      language: profile.language,
      notificationsEnabled: profile.notificationsEnabled,
      themeDark: profile.themeDark,
    };

    await db
      .transaction("rw", [db.profileSettings, db.profiles], async () => {
        await db.profileSettings.update(userId, updatedProfileSettings);
        await db.profiles.update(userId, updatedProfile);
      })
      .catch((_e) => {
        return { id: userId, data: null, error: "Database transaction error" };
      });

    const profileResult = await db.profiles.get(userId);
    const settingsResult = await db.profileSettings.get(userId);

    if (!profileResult || !settingsResult) {
      return { id: userId, data: null, error: "Profile not found" };
    }

    const profileUser: ProfileUser = {
      ...profileResult,
      system: settingsResult,
    };

    return { id: userId, data: profileUser, error: null };
  },
};
