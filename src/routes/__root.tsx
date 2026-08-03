/** @format */

import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import type { User } from "@supabase/supabase-js";

interface MyRouterContext {
  user: User | null;
}
export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Toaster className="bg-[#211E21]! text-white" />
      <Outlet />
    </>
  );
}
