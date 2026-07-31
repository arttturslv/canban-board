/** @format */

import { OnboardingModal } from "@/components/onboarding-dialog";
import { AuthService } from "@/db/services/auth.service";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/use-auth-store";
import React, { useEffect, useState } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setProfile } = useAuthStore();
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        await syncUserProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setNeedsProfileSetup(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const syncUserProfile = async (user_id: string) => {
    try {
      const { data: profileUser, error } =
        await AuthService.getCurrentUserProfile(user_id);

      if (error || !profileUser) {
        console.error("Erro ao carregar perfil do Supabase:", error);
        return;
      }

      setProfile(profileUser);

      const isDefaultName =
        profileUser.name === profileUser.email || !profileUser.name;

      if (isDefaultName) {
        setNeedsProfileSetup(true);
      } else {
        setNeedsProfileSetup(false);
      }
    } catch (err) {
      console.error("Falha na sincronização do perfil:", err);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <>
      {children}

      <OnboardingModal
        onSuccess={() => {
          setNeedsProfileSetup(false);
          const currentUser = useAuthStore.getState().user;
          if (currentUser) syncUserProfile(currentUser.id);
        }}
        show={needsProfileSetup}
      />
    </>
  );
}
