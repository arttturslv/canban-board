/** @format */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen.ts";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "./provider/auth-provider.tsx";
import { useAuthStore } from "./store/use-auth-store.ts";

const queryClient = new QueryClient();
const router = createRouter({
  routeTree,
  context: {
    user: null!,
  },
})

export function AuthRouterProvider() {
  const { user } = useAuthStore()

  return <RouterProvider router={router} context={{ user }} />
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthRouterProvider />
        <Analytics />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export {}
