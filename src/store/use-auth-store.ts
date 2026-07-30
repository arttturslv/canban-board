/** @format */

// store/useAuthStore.ts
import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import type { ProfileUser } from "@/db/schemas";
import { AuthService } from "@/db/services/auth.service";

interface AuthState {
  user: User | null;
  profile: ProfileUser | null;
  setUser: (user: User | null) => void;
  setProfile: (profile: ProfileUser | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  logout: () => {
    set({ user: null, profile: null });
    AuthService.signOut();
  },
}));
