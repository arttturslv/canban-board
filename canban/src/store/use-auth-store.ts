/** @format */

// store/useAuthStore.ts
import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/db/schemas";
import { AuthService } from "@/db/services/auth.service";

interface AuthState {
  user: User | null;
  profile: Profile | null;
  setUser: (user: User | null) => void;
  setProfile: (profile: any) => void;
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
