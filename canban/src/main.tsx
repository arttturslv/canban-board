/** @format */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen.ts";
import { Analytics } from "@vercel/analytics/react";

const queryClient = new QueryClient();
const router = createRouter({ routeTree });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Analytics />
    </QueryClientProvider>
  </StrictMode>,
);
