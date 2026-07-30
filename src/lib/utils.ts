/** @format */

import type { priority } from "@/db/schemas";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import imageCompression from "browser-image-compression";

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

export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    fileType: "image/webp",
  };

  try {
    const compressedFile = await imageCompression(file, options);

    return new File([compressedFile], file.name, {
      type: compressedFile.type,
    });
  } catch (error) {
    console.error("Erro ao comprimir imagem, usando original:", error);
    return file;
  }
}
