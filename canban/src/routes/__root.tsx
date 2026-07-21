/** @format */

import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Analytics />
      <Toaster />
      <Outlet />
    </>
  );
}
