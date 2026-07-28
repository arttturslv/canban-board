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

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "low":
      return "bg-blue-300";
    case "medium":
      return "bg-yellow-300";
    case "high":
      return "bg-red-300";
    case "urgent":
      return "bg-red-600";
    default:
      return "bg-white-300";
  }
};
