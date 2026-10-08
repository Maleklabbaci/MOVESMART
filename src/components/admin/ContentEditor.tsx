import { useCallback, useEffect, useRef, useState } from "react";
import {
  Save,
  Eye,
  Send,
  Search,
  Globe,
  ArrowUp,
  ArrowDown,
  Download,
  Upload,
  History,
  RotateCcw,
  X,
  LoaderCircle,
} from "lucide-react";
import { z } from "zod";
import { supabase } from "../../lib/supabase";
import { useSiteContent } from "../../content/SiteContentProvider";
import {
  adminError,
  loadDraftContent,
  loadPublishedContent,
  publishDraftContent,
  saveDraftContent,
} from "../../content/api";
import { textFields, type EditorGroup } from "../../content/fields";
import { hydrateContent, localize, moveItem } from "../../content/utils";
import {
  siteContentSchema,
  type CmsArticle,
  type CmsFaq,
  type CmsTestimonial,
  type Language,
  type LocalizedText,
  type SiteContent,
} from "../../content/types";
import { TextField, LocalField, ImageField } from "./EditorFields";
import { CollectionEditor } from "./CollectionEditor";
import { useModalDialog } from "./useModalDialog";

type Section = EditorGroup | "testimonials" | "articles";
const sections: { id: Section; name: string; description: string }[] = [
  {
    id: "general",
    name: "Identité & coordonnées",
    description: "Logo, contacts, réseaux sociaux et textes de l’interface.",
  },
  {
    id: "home",
    name: "Accueil",
    description: "Bannière, textes, statistiques et sections de votre accueil.",
  },
  {
    id: "about",
    name: "À propos",
    description: "Présentation, image et arguments commerciaux.",
  },
  {
    id: "contact",
    name: "Contact",
    description: "Présentation et libellés du formulaire de demande.",
  },
  {
    id: "listings",
    name: "Catalogue",
    description:
      "Textes des pages de biens. Les annonces se gèrent dans « Biens immobiliers ».",
  },
  {
    id: "blog",
    name: "Page journal",
    description: "Présentation du journal et inscription à la newsletter.",
  },
  {
    id: "articles",
    name: "Articles",
    description: "Articles, photos et contenus dans les trois langues.",
  },
  {
    id: "faq",
    name: "FAQ",
    description: "Questions, réponses et ordre d’affichage.",
  },
  {
    id: "testimonials",
    name: "Témoignages",
    description:
      "N’utilisez que des avis réels dont vous avez l’autorisation de publication.",
  },
  {
    id: "privacy",
    name: "Confidentialité",
    description:
      "Adaptez ce texte à votre activité, votre durée de conservation et vos obligations légales.",
  },
];
const homeNames = {
  hero: "Bannière principale",
  stats: "Statistiques",
  services: "Services",
  why: "Pourquoi MoveSmart",
  testimonials: "Témoignages",
  faq: "FAQ",
  cta: "Appel à l’action",
};
const blankText = (): LocalizedText => ({ fr: "", en: "", ar: "" });
const newFaq = (): CmsFaq => ({
  id: crypto.randomUUID(),
  question: blankText(),
  answer: blankText(),
});
const newTestimonial = (): CmsTestimonial => ({
  id: crypto.randomUUID(),
  name: blankText(),
  role: blankText(),
  location: blankText(),
  text: blankText(),
  rating: 5,
  image: "",
});
const newArticle = (): CmsArticle => ({
  id: crypto.randomUUID(),
  title: blankText(),
  excerpt: blankText(),
  content: blankText(),
  category: blankText(),
  alt: blankText(),
  author: "",
  image: "",
  visible: false,
  publishedAt: new Date().toISOString().slice(0, 10),
});
const revisionSchema = z.object({
  id: z.number().int().positive(),
  content: z.unknown(),
  revision: z.number().int().nonnegative(),
  created_at: z.iso.datetime({ offset: true }),
});
type Revision = z.infer<typeof revisionSchema>;

export default function ContentEditor({
  onUnsavedChange,
  active = true,
}: {
  onUnsavedChange?: (value: boolean) => void;
  active?: boolean;
}) {
  const { refresh } = useSiteContent();
  const [draft, setDraft] = useState<SiteContent | null>(null);
  const [draftRevision, setDraftRevision] = useState(0);
  const [publishedRevision, setPublishedRevision] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [uploads, setUploads] = useState(0);
  const uploadBusy = useCallback(
    (active: boolean) =>
      setUploads((value) => Math.max(0, value + (active ? 1 : -1))),
    [],
  );
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [section, setSection] = useState<Section>("general");
  const [language, setLanguage] = useState<Language>("fr");
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<Revision[] | null>(null);
  const [historyBusy, setHistoryBusy] = useState(false);
  const importInput = useRef<HTMLInputElement>(null);
  const actionLock = useRef(false);
  const historyDialog = useRef<HTMLDivElement>(null);
  const historyTrigger = useRef<HTMLElement | null>(null);
  useModalDialog(
    Boolean(history) && active,
    historyDialog,
    () => setHistory(null),
    historyTrigger,
  );
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [published, saved] = await Promise.all([
        loadPublishedContent(),
        loadDraftContent(),
      ]);
      setDraft(saved?.content ?? published.content);
      setDraftRevision(saved?.revision ?? 0);
      setPublishedRevision(published.revision);
      setDirty(false);
    } catch (failure) {
      setError(adminError(failure));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty || uploads) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, uploads]);
  useEffect(() => {
    onUnsavedChange?.(dirty || uploads > 0);
    return () => onUnsavedChange?.(false);
  }, [dirty, uploads, onUnsavedChange]);
  function change(next: SiteContent) {
    setDraft(next);
    setDirty(true);
    setMessage("");
  }
  async function action(kind: "save" | "publish" | "preview") {
    if (!draft || actionLock.current || uploads) return;
    if (
      kind === "publish" &&
      !window.confirm(
        "Publier ce contenu ? Il remplacera la version actuellement visible par les visiteurs.",
      )
    )
      return;
    // Open synchronously so browser popup blockers do not prevent the preview after saving.
    const previewWindow =
      kind === "preview" ? window.open("about:blank", "_blank") : null;
    if (previewWindow) previewWindow.opener = null;
    actionLock.current = true;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const valid = siteContentSchema.parse(draft);
      let revision = draftRevision;
      if (dirty || revision === 0 || kind === "save") {
        const saved = await saveDraftContent(valid, revision);
        revision = saved.revision;
        setDraftRevision(revision);
        setDraft(saved.content);
        setDirty(false);
      }
      if (kind === "publish") {
        const published = await publishDraftContent(
          revision,
          publishedRevision,
        );
        setPublishedRevision(published.revision);
        await refresh();
        setMessage(
          "Contenu publié. Les visiteurs voient maintenant cette version.",
        );
      } else if (kind === "preview") {
        const url = new URL("/?preview=draft", window.location.origin).href;
        if (previewWindow) previewWindow.location.href = url;
        setMessage(
          previewWindow
            ? "Aperçu ouvert dans un nouvel onglet."
            : "Aperçu bloqué par le navigateur. Autorisez les fenêtres ou ouvrez /?preview=draft.",
        );
      } else setMessage("Brouillon enregistré. Le site public n’a pas changé.");
    } catch (failure) {
      previewWindow?.close();
      setError(
        failure instanceof z.ZodError
          ? failure.issues
              .slice(0, 4)
              .map(
                (issue) =>
                  `${issue.path.join(" › ") || "Contenu"} : ${issue.message}`,
              )
              .join(" · ")
          : adminError(failure),
      );
    } finally {
      setBusy(false);
      actionLock.current = false;
    }
  }
  async function openHistory(trigger: HTMLElement) {
    historyTrigger.current = trigger;
    setHistoryBusy(true);
    setError("");
    try {
      const { data, error: failure } = await supabase
        .from("site_content_revisions")
        .select("id, content, revision, created_at")
        .order("id", { ascending: false })
        .limit(30);
      if (failure) throw failure;
      setHistory(z.array(revisionSchema).parse(data || []));
    } catch (failure) {
      setError(adminError(failure));
    } finally {
      setHistoryBusy(false);
    }
  }
  function exportContent() {
    if (!draft) return;
    const blob = new Blob([JSON.stringify(draft)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `movesmart-content-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }
  async function importContent(file?: File) {
    if (!file) return;
    setError("");
    try {
      if (file.size > 1_000_000) throw new Error("Le fichier dépasse 1 Mo.");
      const next = hydrateContent(JSON.parse(await file.text()));
      if (
        window.confirm(
          "Remplacer votre brouillon local par ce fichier ? Rien ne sera publié automatiquement.",
        )
      )
        change(next);
    } catch (failure) {
      setError(adminError(failure));
    } finally {
      if (importInput.current) importInput.current.value = "";
    }
  }
  if (loading)
    return (
      <div className="admin-card flex items-center gap-3 text-sm text-zinc-400">
        <LoaderCircle className="animate-spin" size={18} />
        Chargement des contenus…
      </div>
    );
  if (!draft)
    return (
      <div className="admin-card space-y-4">
        <p className="admin-notice admin-error" role="alert">
          {error}
        </p>
        <button className="admin-button" onClick={() => void load()}>
          Réessayer
        </button>
      </div>
    );
  const page = sections.find((item) => item.id === section)!;
  const filteredFields = textFields.filter(
    (field) =>
      field.group === section &&
      `${field.label} ${field.key} ${draft.translations[language][field.key]}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const updateText = (key: string, value: string) =>
    change({
      ...draft,
      translations: {
        ...draft.translations,
        [language]: { ...draft.translations[language], [key]: value },
      },
    });
  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Contenus du site
          </h1>
          <p className="text-xs text-zinc-500 mt-2 flex items-center gap-2">
            <span
              className={`h-1.5 w-1.5 rounded-full ${dirty ? "bg-amber-400" : "bg-emerald-400"}`}
            />
            {dirty ? "Modifications non enregistrées" : "Brouillon à jour"} ·
            version publique {publishedRevision}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="admin-button"
            disabled={busy || uploads > 0}
            onClick={() => void action("preview")}
          >
            <Eye size={15} />
            Aperçu
          </button>
          <button
            className="admin-button"
            disabled={busy || uploads > 0}
            onClick={() => void action("save")}
          >
            <Save size={15} />
            Enregistrer le brouillon
          </button>
          <button
            className="admin-button admin-button-primary"
            disabled={busy || uploads > 0}
            onClick={() => void action("publish")}
          >
            {busy ? (
              <LoaderCircle size={15} className="animate-spin" />
            ) : (
              <Send size={15} />
            )}
            Publier
          </button>
        </div>
      </div>
      <div className="admin-notice">
        <strong>Vous gardez la main, sans toucher au code.</strong> Modifiez une
        page, vérifiez son aperçu puis publiez. Les langues s’éditent séparément
        ; il n’y a pas de traduction automatique.
      </div>
      {error && (
        <div className="admin-notice admin-error" role="alert">
          {error}
          <button
            className="ms-3 underline"
            onClick={() => {
              if (
                !dirty ||
                window.confirm(
                  "Recharger et abandonner vos changements non enregistrés ?",
                )
              )
                void load();
            }}
          >
            Recharger la dernière version
          </button>
        </div>
      )}
      {message && (
        <div className="admin-notice admin-success" role="status">
          {message}
        </div>
      )}
      <div className="grid grid-cols-1 xl:grid-cols-[200px_minmax(0,1fr)] gap-6">
        <div className="min-w-0">
          <div className="flex xl:flex-col gap-1 overflow-x-auto pb-2 xl:pb-0">
            {sections.map((item) => (
              <button
                key={item.id}
                className={`text-start shrink-0 rounded-lg px-4 py-3 text-xs transition-colors ${item.id === section ? "bg-[#d4af3712] text-[#e4cd84] border border-[#d4af3720]" : "text-zinc-500 hover:text-zinc-200 border border-transparent"}`}
                onClick={() => {
                  setSection(item.id);
                  setQuery("");
                }}
              >
                {item.name}
              </button>
            ))}
          </div>
          <div className="hidden xl:block border-t border-white/5 mt-6 pt-6 space-y-3">
            <button
              className="text-xs text-zinc-500 hover:text-white flex gap-2 items-center"
              onClick={exportContent}
            >
              <Download size={13} />
              Exporter le brouillon
            </button>
            <button
              className="text-xs text-zinc-500 hover:text-white flex gap-2 items-center"
              disabled={busy || uploads > 0}
              onClick={() => importInput.current?.click()}
            >
              <Upload size={13} />
              Importer un fichier JSON
            </button>
            <button
              className="text-xs text-zinc-500 hover:text-white flex gap-2 items-center"
              disabled={historyBusy}
              onClick={(event) => void openHistory(event.currentTarget)}
            >
              <History size={13} />
              Historique des publications
            </button>
          </div>
        </div>
        <div className="min-w-0 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-medium">{page.name}</h2>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed max-w-lg">
                {page.description}
              </p>
            </div>
            <div
              className="inline-flex self-start p-1 bg-[#111317] border border-white/10 rounded-lg"
              aria-label="Langue du contenu"
            >
              {(["fr", "en", "ar"] as const).map((code) => (
                <button
                  key={code}
                  aria-pressed={language === code}
                  className={`px-4 py-2 text-xs rounded-md ${language === code ? "bg-white/10 text-white" : "text-zinc-500"}`}
                  onClick={() => setLanguage(code)}
                >
                  {code === "ar" ? "العربية" : code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <fieldset
            disabled={busy || uploads > 0}
            className="space-y-6 min-w-0"
            dir={language === "ar" ? "rtl" : "ltr"}
          >
            {section === "general" && (
              <>
                <div className="admin-card grid md:grid-cols-2 gap-6">
                  <TextField
                    label="Nom de marque"
                    value={draft.settings.brand}
                    onChange={(brand) =>
                      change({
                        ...draft,
                        settings: { ...draft.settings, brand },
                      })
                    }
                  />
                  <TextField
                    label="Nom de l’entreprise"
                    value={draft.settings.name}
                    onChange={(name) =>
                      change({
                        ...draft,
                        settings: { ...draft.settings, name },
                      })
                    }
                  />
                  <TextField
                    label="Email de contact"
                    type="email"
                    value={draft.settings.email}
                    onChange={(email) =>
                      change({
                        ...draft,
                        settings: { ...draft.settings, email },
                      })
                    }
                  />
                  <TextField
                    label="WhatsApp"
                    value={draft.settings.whatsapp}
                    hint="Format international sans espaces : +971569130632"
                    onChange={(whatsapp) =>
                      change({
                        ...draft,
                        settings: { ...draft.settings, whatsapp },
                      })
                    }
                  />
                  <TextField
                    label="Localisation"
                    value={draft.settings.location}
                    onChange={(location) =>
                      change({
                        ...draft,
                        settings: { ...draft.settings, location },
                      })
                    }
                  />
                  {(["instagram", "linkedin", "facebook"] as const).map(
                    (network) => (
                      <TextField
                        key={network}
                        label={
                          network.charAt(0).toUpperCase() + network.slice(1)
                        }
                        value={draft.settings.social[network]}
                        onChange={(url) =>
                          change({
                            ...draft,
                            settings: {
                              ...draft.settings,
                              social: {
                                ...draft.settings.social,
                                [network]: url,
                              },
                            },
                          })
                        }
                      />
                    ),
                  )}
                </div>
                <div className="admin-card space-y-5">
                  <ImageField
                    label="Logo"
                    url={draft.images.logo.url}
                    onUploading={uploadBusy}
                    onChange={(url) =>
                      change({
                        ...draft,
                        images: {
                          ...draft.images,
                          logo: { ...draft.images.logo, url },
                        },
                      })
                    }
                  />
                  <label className="flex items-start gap-3 text-xs leading-relaxed">
                    <input
                      type="checkbox"
                      className="accent-[#d4af37] mt-1"
                      checked={draft.settings.logoMonochrome}
                      onChange={(event) =>
                        change({
                          ...draft,
                          settings: {
                            ...draft.settings,
                            logoMonochrome: event.target.checked,
                          },
                        })
                      }
                    />
                    Adapter un logo blanc monochrome au mode clair. Décocher
                    pour conserver les couleurs d’un logo.
                  </label>
                  <LocalField
                    label="Texte alternatif du logo"
                    language={language}
                    value={draft.images.logo.alt}
                    onChange={(alt) =>
                      change({
                        ...draft,
                        images: {
                          ...draft.images,
                          logo: { ...draft.images.logo, alt },
                        },
                      })
                    }
                  />
                </div>
              </>
            )}
            {(section === "home" || section === "about") && (
              <div className="admin-card space-y-5">
                <ImageField
                  label={
                    section === "home"
                      ? "Image de la bannière"
                      : "Image de présentation"
                  }
                  url={
                    draft.images[section === "home" ? "homeHero" : "aboutHero"]
                      .url
                  }
                  onUploading={uploadBusy}
                  onChange={(url) => {
                    const key = section === "home" ? "homeHero" : "aboutHero";
                    change({
                      ...draft,
                      images: {
                        ...draft.images,
                        [key]: { ...draft.images[key], url },
                      },
                    });
                  }}
                />
                <LocalField
                  label="Description de l’image (accessibilité)"
                  language={language}
                  value={
                    draft.images[section === "home" ? "homeHero" : "aboutHero"]
                      .alt
                  }
                  onChange={(alt) => {
                    const key = section === "home" ? "homeHero" : "aboutHero";
                    change({
                      ...draft,
                      images: {
                        ...draft.images,
                        [key]: { ...draft.images[key], alt },
                      },
                    });
                  }}
                />
              </div>
            )}
            {section === "home" && (
              <div className="admin-card">
                <h3 className="text-sm font-medium mb-5">
                  Ordre et visibilité des sections
                </h3>
                <div className="space-y-2">
                  {draft.homeOrder.map((id, index) => (
                    <div
                      key={id}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white/[.02]"
                    >
                      <label className="flex items-center gap-3 text-xs">
                        <input
                          type="checkbox"
                          checked={draft.visibleSections[id]}
                          onChange={(event) =>
                            change({
                              ...draft,
                              visibleSections: {
                                ...draft.visibleSections,
                                [id]: event.target.checked,
                              },
                            })
                          }
                          className="accent-[#d4af37]"
                        />
                        {homeNames[id]}
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="p-1 text-zinc-500 disabled:opacity-20"
                          aria-label={`Monter ${homeNames[id]}`}
                          disabled={index === 0}
                          onClick={() =>
                            change({
                              ...draft,
                              homeOrder: moveItem(
                                draft.homeOrder,
                                index,
                                index - 1,
                              ),
                            })
                          }
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          className="p-1 text-zinc-500 disabled:opacity-20"
                          aria-label={`Descendre ${homeNames[id]}`}
                          disabled={index === draft.homeOrder.length - 1}
                          onClick={() =>
                            change({
                              ...draft,
                              homeOrder: moveItem(
                                draft.homeOrder,
                                index,
                                index + 1,
                              ),
                            })
                          }
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-zinc-500 mt-5">
                  Les statistiques et promesses commerciales doivent être
                  vérifiées avant publication. Les rendements ne sont pas
                  garantis.
                </p>
              </div>
            )}
            {section === "faq" && (
              <CollectionEditor
                items={draft.faq}
                onChange={(faq) => change({ ...draft, faq })}
                createItem={newFaq}
                title={(item) => localize(item.question, language)}
                noun="une question"
                render={(item, update) => (
                  <>
                    <LocalField
                      label="Question"
                      language={language}
                      value={item.question}
                      onChange={(question) => update({ ...item, question })}
                    />
                    <LocalField
                      label="Réponse"
                      language={language}
                      value={item.answer}
                      multiline
                      onChange={(answer) => update({ ...item, answer })}
                    />
                  </>
                )}
              />
            )}
            {section === "testimonials" && (
              <CollectionEditor
                items={draft.testimonials}
                onChange={(testimonials) => change({ ...draft, testimonials })}
                createItem={newTestimonial}
                title={(item) => localize(item.name, language)}
                noun="un témoignage"
                render={(item, update) => (
                  <>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <LocalField
                        label="Nom du client"
                        language={language}
                        value={item.name}
                        onChange={(name) => update({ ...item, name })}
                      />
                      <LocalField
                        label="Profession / profil"
                        language={language}
                        value={item.role}
                        onChange={(role) => update({ ...item, role })}
                      />
                      <LocalField
                        label="Pays / ville"
                        language={language}
                        value={item.location}
                        onChange={(location) => update({ ...item, location })}
                      />
                      <TextField
                        label="Note (1 à 5)"
                        type="number"
                        min={1}
                        max={5}
                        step={1}
                        value={String(item.rating)}
                        onChange={(rating) =>
                          update({ ...item, rating: Number(rating) })
                        }
                      />
                    </div>
                    <LocalField
                      label="Témoignage"
                      language={language}
                      value={item.text}
                      multiline
                      onChange={(text) => update({ ...item, text })}
                    />
                    <ImageField
                      label="Photo du client (facultative)"
                      url={item.image}
                      onUploading={uploadBusy}
                      onChange={(image) => update({ ...item, image })}
                    />
                  </>
                )}
              />
            )}
            {section === "articles" && (
              <CollectionEditor
                items={draft.articles}
                onChange={(articles) => change({ ...draft, articles })}
                createItem={newArticle}
                title={(item) =>
                  `${item.visible ? "" : "Non affiché · "}${localize(item.title, language)}`
                }
                noun="un article"
                render={(item, update) => (
                  <>
                    <label className="flex gap-3 items-center text-xs">
                      <input
                        type="checkbox"
                        checked={item.visible}
                        onChange={(event) =>
                          update({ ...item, visible: event.target.checked })
                        }
                        className="accent-[#d4af37]"
                      />
                      Afficher cet article après publication du site
                    </label>
                    <LocalField
                      label="Titre"
                      language={language}
                      value={item.title}
                      onChange={(title) => update({ ...item, title })}
                    />
                    <div className="grid sm:grid-cols-2 gap-5">
                      <label className="admin-label">
                        Identifiant de l’URL
                        <input
                          className="admin-input mt-2"
                          defaultValue={item.id}
                          onBlur={(event) => {
                            const id = event.target.value.trim();
                            if (id !== item.id) update({ ...item, id });
                          }}
                        />
                        <span className="text-[11px] text-zinc-500 mt-2 block">
                          Lettres, chiffres, tirets. Changer cette valeur change
                          l’adresse de l’article.
                        </span>
                      </label>
                      <TextField
                        label="Auteur"
                        value={item.author}
                        onChange={(author) => update({ ...item, author })}
                      />
                      <TextField
                        label="Date"
                        type="date"
                        value={item.publishedAt}
                        onChange={(publishedAt) =>
                          update({ ...item, publishedAt })
                        }
                      />
                      <LocalField
                        label="Catégorie"
                        language={language}
                        value={item.category}
                        onChange={(category) => update({ ...item, category })}
                      />
                    </div>
                    <LocalField
                      label="Résumé"
                      language={language}
                      value={item.excerpt}
                      multiline
                      onChange={(excerpt) => update({ ...item, excerpt })}
                    />
                    <LocalField
                      label="Article (texte, paragraphes séparés par une ligne vide)"
                      language={language}
                      value={item.content}
                      multiline
                      rows={12}
                      onChange={(content) => update({ ...item, content })}
                    />
                    <ImageField
                      label="Photo de l’article"
                      url={item.image}
                      onUploading={uploadBusy}
                      onChange={(image) => update({ ...item, image })}
                    />
                    <LocalField
                      label="Description de la photo"
                      language={language}
                      value={item.alt}
                      onChange={(alt) => update({ ...item, alt })}
                    />
                  </>
                )}
              />
            )}
            {!["articles", "testimonials"].includes(section) && (
              <div className="admin-card space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-5">
                  <Globe size={17} className="text-[#d4af37]" />
                  <h3 className="text-sm font-medium">
                    Textes · {language.toUpperCase()}
                  </h3>
                </div>
                <div className="relative">
                  <Search
                    size={15}
                    className="absolute left-3 top-3.5 text-zinc-500"
                  />
                  <input
                    className="admin-input ps-10"
                    aria-label="Rechercher un texte"
                    placeholder="Rechercher un titre, un texte…"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>
                {filteredFields.map((field) => (
                  <TextField
                    key={field.key}
                    label={
                      field.label.length > 80
                        ? field.label.slice(0, 77) + "…"
                        : field.label
                    }
                    value={draft.translations[language][field.key] ?? ""}
                    multiline={field.multiline}
                    onChange={(value) => updateText(field.key, value)}
                  />
                ))}
                {filteredFields.length === 0 && (
                  <p className="text-sm text-zinc-500">Aucun texte trouvé.</p>
                )}
              </div>
            )}
          </fieldset>
          <div className="xl:hidden flex flex-wrap gap-4 text-xs text-zinc-500">
            <button onClick={exportContent}>Exporter</button>
            <button
              disabled={busy || uploads > 0}
              onClick={() => importInput.current?.click()}
            >
              Importer JSON
            </button>
            <button
              disabled={historyBusy}
              onClick={(event) => void openHistory(event.currentTarget)}
            >
              Historique
            </button>
          </div>
        </div>
      </div>
      <input
        ref={importInput}
        type="file"
        accept="application/json,.json"
        className="hidden"
        aria-label="Importer un contenu JSON"
        onChange={(event) => void importContent(event.target.files?.[0])}
      />
      {history && active && (
        <div className="fixed inset-0 bg-black/80 z-[100] grid place-items-center p-4">
          <div
            ref={historyDialog}
            tabIndex={-1}
            className="admin-card w-full max-w-lg max-h-[80vh] overflow-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Historique des publications"
          >
            <div className="flex justify-between gap-4 mb-6">
              <h2 className="font-semibold">Historique des publications</h2>
              <button
                aria-label="Fermer l’historique"
                onClick={() => setHistory(null)}
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-zinc-500 mb-6">
              Une restauration charge une ancienne version dans votre brouillon.
              Vous devez ensuite l’enregistrer et la publier.
            </p>
            {history.length === 0 && (
              <p className="text-sm text-zinc-500">
                Aucune publication pour le moment.
              </p>
            )}
            {history.map((record) => (
              <div
                key={record.id}
                className="py-4 border-t border-white/5 flex justify-between gap-4 items-center"
              >
                <div className="text-xs">
                  <span>Version {record.revision}</span>
                  <p className="text-zinc-500 mt-2">
                    {new Date(record.created_at).toLocaleString("fr")}
                  </p>
                </div>
                <button
                  className="admin-button"
                  aria-label={`Restaurer la version ${record.revision}`}
                  onClick={() => {
                    if (
                      !dirty ||
                      window.confirm(
                        "Remplacer vos modifications locales par cette version ?",
                      )
                    ) {
                      try {
                        change(hydrateContent(record.content));
                        setHistory(null);
                      } catch (failure) {
                        setError(adminError(failure));
                      }
                    }
                  }}
                >
                  <RotateCcw size={13} />
                  Restaurer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
