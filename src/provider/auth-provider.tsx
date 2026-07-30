/** @format */

import { OnboardingModal } from "@/components/onboarding-dialog";
import { db } from "@/db/dexie-db";
import type { ProfileUser } from "@/db/schemas";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/use-auth-store";
import React, { useEffect, useState } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setProfile } = useAuthStore();
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        console.log("HERE");
        await loadOrCreateProfile(session.user);
      } else {
        console.log("NOW HERE");

        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadOrCreateProfile = async (authUser: any) => {
    let localProfile = await db.profiles.get(authUser.id);
    let localProfileSettings = await db.profileSettings.get(authUser.id);

    if (!localProfile || !localProfile.name) {
      console.log("NEEDS TO CREATE");
      setNeedsProfileSetup(true);
    } else {
      console.log("DONT NEED TO CREATE");

      const profileUser: ProfileUser = {
        ...localProfile,
        system: localProfileSettings,
      };

      setProfile(profileUser);
      setNeedsProfileSetup(false);
    }
  };

  return (
    <>
      {children}

      <OnboardingModal
        onSuccess={() => setNeedsProfileSetup(false)}
        show={needsProfileSetup}
      />
    </>
  );
}
