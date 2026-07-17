/** @format */

import type { priority } from "@/db/schemas";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const tags = [
  "UI/UX",
  "Backend",
  "Frontend",
  "IA",
  "Database",
  "RH",
  "Client",
  "Pesquisa",
];

export const priorities: priority[] = ["low", "medium", "high", "urgent"];
