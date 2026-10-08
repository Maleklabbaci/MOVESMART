import { z } from "zod";
import { supabase } from "../lib/supabase";
import { hydrateContent } from "./utils";
import { siteContentSchema, type SiteContent } from "./types";

export interface ContentRecord {
  content: SiteContent;
  revision: number;
  updatedAt: string | null;
}
export function adminError(error: unknown): string {
  if (error instanceof z.ZodError)
    return "Les données reçues ont un format invalide. Vérifiez le schéma ou les contenus dans Supabase.";
  const failure = error as { code?: string; message?: string } | undefined;
  if (failure?.code === "40001")
    return "Ce contenu a changé dans un autre onglet. Rechargez avant de réessayer ; vos modifications n’ont pas été écrasées.";
  if (["PGRST202", "PGRST205", "42P01", "42883"].includes(failure?.code || ""))
    return "Le CMS n’est pas encore configuré dans Supabase. Appliquez la migration décrite dans docs/ADMIN_CMS.md.";
  if (failure?.code === "42501")
    return "Accès refusé. Vérifiez les droits administrateur et les règles RLS.";
  if (failure?.code === "23505") return "Cet identifiant existe déjà.";
  return (
    failure?.message ||
    "Opération impossible. Vérifiez la connexion et réessayez."
  );
}
export async function loadPublishedContent(): Promise<ContentRecord> {
  const { data, error } = await supabase
    .from("site_content")
    .select("content, revision, published_at")
    .eq("id", "main")
    .maybeSingle();
  if (error) throw error;
  return {
    content: hydrateContent(data?.content ?? {}),
    revision: data?.revision ?? 0,
    updatedAt: data?.published_at ?? null,
  };
}
export async function loadDraftContent(): Promise<ContentRecord | null> {
  const { data, error } = await supabase
    .from("site_content_drafts")
    .select("content, revision, updated_at")
    .eq("id", "main")
    .maybeSingle();
  if (error) throw error;
  return data
    ? {
        content: hydrateContent(data.content),
        revision: data.revision,
        updatedAt: data.updated_at,
      }
    : null;
}
export async function saveDraftContent(
  content: SiteContent,
  revision: number,
): Promise<ContentRecord> {
  const validated = siteContentSchema.parse(content);
  const { data, error } = await supabase.rpc("save_site_draft", {
    p_content: validated,
    p_expected_revision: revision,
  });
  if (error) throw error;
  if (!data || typeof data.revision !== "number")
    throw new Error("Le brouillon n’a pas été confirmé par le serveur.");
  return {
    content: validated,
    revision: data.revision,
    updatedAt: data.updated_at,
  };
}
export async function publishDraftContent(
  draftRevision: number,
  publishedRevision: number,
): Promise<ContentRecord> {
  const { data, error } = await supabase.rpc("publish_site_content", {
    p_expected_draft_revision: draftRevision,
    p_expected_published_revision: publishedRevision,
  });
  if (error) throw error;
  if (!data || typeof data.revision !== "number")
    throw new Error("La publication n’a pas été confirmée par le serveur.");
  return {
    content: hydrateContent(data.content),
    revision: data.revision,
    updatedAt: data.published_at,
  };
}
