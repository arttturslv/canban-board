/** @format */
export type AuthProviderType = "magiclink" | "github" | "google";

export interface Profile {
  id: string;
  email: string;
  name: string;
  bornDate?: string;
  avatarUrl: string | null;
  provider: AuthProviderType;
  createdAt: string;
}

export type ProfileInput = Omit<Profile, "avatarUrl"> & {
  avatarFile?: FileList;
};

export interface ProfileSettings {
  userId: string;
  theme: "dark" | "light";
  language: "pt-BR" | "en-US";
  notificationsEnabled: boolean;
}
