import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { defaultContent } from "./defaults";
import { loadDraftContent, loadPublishedContent } from "./api";
import { normalizeLanguage } from "./utils";
import type { Language, SiteContent } from "./types";

interface ContentContextValue {
  content: SiteContent;
  language: Language;
  preview: boolean;
  previewRequested: boolean;
  refresh: () => Promise<void>;
}
const ContentContext = createContext<ContentContextValue | null>(null);
export function SiteContentProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const { search } = useLocation();
  const wantsPreview = new URLSearchParams(search).get("preview") === "draft";
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [preview, setPreview] = useState(false);
  const [generation, setGeneration] = useState(0);
  // Only published data goes in this cache. A failed preview must never reuse a draft.
  const publishedCache = useRef(defaultContent);
  const previewUserId = useRef<string | null>(null);
  const requestVersion = useRef(0);
  const refresh = useCallback(async () => {
    setGeneration((value) => value + 1);
  }, []);
  useEffect(() => {
    let cancelled = false;
    let authTimer: ReturnType<typeof setTimeout> | undefined;
    const apply = (next: SiteContent, isPreview: boolean) => {
      for (const language of ["fr", "en", "ar"] as const)
        i18n.addResourceBundle(
          language,
          "translation",
          next.translations[language],
          false,
          true,
        );
      setContent(next);
      setPreview(isPreview);
    };
    previewUserId.current = null;
    apply(publishedCache.current, false);
    async function authorizedDraft() {
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const userId = data.session?.user.id;
      if (!userId) return null;
      const { data: isAdmin, error } = await supabase.rpc("is_cms_admin");
      if (error) throw error;
      if (isAdmin !== true) return null;
      const draft = await loadDraftContent();
      return draft ? { content: draft.content, userId } : null;
    }
    async function load() {
      const version = ++requestVersion.current;
      // These failures are independent: an unavailable admin RPC must not replace
      // successfully loaded public copy with defaults, or reveal cached draft copy.
      const [published, draft] = await Promise.allSettled([
        loadPublishedContent(),
        wantsPreview ? authorizedDraft() : Promise.resolve(null),
      ]);
      if (cancelled || version !== requestVersion.current) return;
      if (published.status === "fulfilled")
        publishedCache.current = published.value.content;
      const allowedDraft = draft.status === "fulfilled" ? draft.value : null;
      previewUserId.current = allowedDraft?.userId ?? null;
      apply(
        allowedDraft?.content ?? publishedCache.current,
        Boolean(allowedDraft),
      );
      // If the CMS has not been installed yet, the original defaults keep the
      // public site available. Transient failures keep the last published version.
    }
    void load();
    const onFocus = () => {
      void load();
    };
    window.addEventListener("focus", onFocus);
    const subscription = wantsPreview
      ? supabase.auth.onAuthStateChange((event, session) => {
          if (event === "INITIAL_SESSION") return;
          // Invalidate any in-flight draft read and immediately remove private copy
          // when signing out or switching accounts, including in another browser tab.
          ++requestVersion.current;
          if (
            !session ||
            (previewUserId.current && session.user.id !== previewUserId.current)
          ) {
            previewUserId.current = null;
            apply(publishedCache.current, false);
          }
          // Do not await an Auth method from inside an Auth event callback.
          clearTimeout(authTimer);
          authTimer = setTimeout(() => {
            if (!cancelled) void load();
          }, 0);
        }).data.subscription
      : null;
    return () => {
      cancelled = true;
      ++requestVersion.current;
      clearTimeout(authTimer);
      window.removeEventListener("focus", onFocus);
      subscription?.unsubscribe();
    };
  }, [wantsPreview, generation, i18n]);
  return (
    <ContentContext.Provider
      value={{
        content,
        language: normalizeLanguage(i18n.resolvedLanguage || i18n.language),
        preview,
        previewRequested: wantsPreview,
        refresh,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}
export function useSiteContent(): ContentContextValue {
  const value = useContext(ContentContext);
  if (!value) throw new Error("useSiteContent requires SiteContentProvider");
  return value;
}
