/** @format */

import { supabase } from "@/lib/supabase";
import { compressImage } from "@/lib/utils";

export interface CompressAndStoreResult {
  publicUrl: string | undefined;
  error: string | undefined;
}

export const StorageService = {
  async compressAndStoreImage({
    bucket,
    file,
    userId,
  }: {
    bucket: string;
    file: File;
    userId: string;
  }): Promise<CompressAndStoreResult> {
    const fileExt = file.name.split(".").pop();

    if (!fileExt || !["png", "jpg", "jpeg"].includes(fileExt)) {
      return { publicUrl: undefined, error: "Arquivo não suportado." };
    }

    const compressedFile = await compressImage(file);
    const fileName = `public/${userId}/${Date.now()}.webp`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, compressedFile, {
        contentType: compressedFile.type,
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      return { publicUrl: undefined, error: error.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { publicUrl: publicUrlData.publicUrl, error: undefined };
  },
};
