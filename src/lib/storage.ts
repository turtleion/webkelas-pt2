import { supabase } from "./supabase";

export const GALLERY_BUCKET = "gallery";
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export interface UploadResult {
  imageUrl: string;
  storagePath: string;
}

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return "Tipe file tidak didukung. Harap gunakan format JPEG, PNG, WebP, atau GIF.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "Ukuran file terlalu besar. Maksimal ukuran file adalah 5MB.";
  }
  return null;
}

export async function uploadGalleryImage(file: File): Promise<UploadResult> {
  const validationError = validateImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
  const storagePath = `photos/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(GALLERY_BUCKET)
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Gagal mengunggah foto ke storage: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(GALLERY_BUCKET)
    .getPublicUrl(storagePath);

  return {
    imageUrl: publicUrlData.publicUrl,
    storagePath,
  };
}

export async function deleteGalleryImage(storagePath: string): Promise<void> {
  if (!storagePath) return;

  const { error } = await supabase.storage
    .from(GALLERY_BUCKET)
    .remove([storagePath]);

  if (error) {
    console.error("Gagal menghapus file storage:", error);
  }
}
