import { supabase } from "./supabase";
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const formats: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
export function validateImage(
  file: Pick<File, "size" | "type">,
): string | null {
  if (!formats[file.type])
    return "Format non accepté. Utilisez JPG, PNG, WEBP ou AVIF (pas de SVG).";
  if (file.size === 0) return "Ce fichier est vide.";
  if (file.size > MAX_IMAGE_BYTES) return "Cette image dépasse 5 Mo.";
  return null;
}
export async function uploadImage(
  file: File,
  folder: "cms" | "listings" = "cms",
): Promise<string> {
  const validation = validateImage(file);
  if (validation) throw new Error(validation);
  const path = `${folder}/${crypto.randomUUID()}.${formats[file.type]}`;
  const { error } = await supabase.storage
    .from("photos")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  return supabase.storage.from("photos").getPublicUrl(path).data.publicUrl;
}
