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
  updatedAt: string;
}

export interface ProfileSettings {
  userId: string;
  themeDark: boolean;
  language: "pt-BR" | "en-US";
  notificationsEnabled: boolean;
}

export type ProfileUser = Profile & {
  system?: Omit<ProfileSettings, "userId">;
};

export type ProfileUpdate = Omit<
  Profile,
  "provider" | "createdAt" | "email" | "createdAt" | "updatedAt" | "id"
> &
  Omit<ProfileSettings, "userId">;

export type ProfileInput = Omit<Profile, "createdAt" | "updatedAt">;
