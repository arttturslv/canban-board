/** @format */

import { useQuery } from "@tanstack/react-query";
import { AppInitializerService } from "@/db/services";

export function useAppInit(supabaseUser: any) {
  const currentUserId = supabaseUser?.id || "local-user";

  return useQuery({
    queryKey: ["app-init", currentUserId],
    queryFn: () => AppInitializerService.ensureBasicStructure(currentUserId),
    staleTime: Infinity,
  });
}
