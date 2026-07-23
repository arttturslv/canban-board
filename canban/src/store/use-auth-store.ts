/** @format */

// store/useAuthStore.ts
import { create } from "zustand";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  profile: { name?: string } | null;
  setUser: (user: User | null) => void;
  setProfile: (profile: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  logout: () => set({ user: null, profile: null }),
}));
