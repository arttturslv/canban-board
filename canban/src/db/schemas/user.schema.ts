/** @format */
export type AuthProviderType = "magiclink" | "github" | "google";

export interface Profile {
  id: string;
  email: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  provider: AuthProviderType;
  createdAt: string;
}

export interface ProfileSettings {
  userId: string;
  theme: "dark" | "light";
  language: "pt-BR" | "en-US";
  notificationsEnabled: boolean;
}
