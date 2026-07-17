/** @format */

export interface User {
  id: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  provider: "github" | "google";
  createAt: string;
}

export interface UserSettings {
  userId: string;
  theme: "dark" | "light";
  language: "pt-BR" | "en-US";
  notificationsEnabled: boolean;
}
