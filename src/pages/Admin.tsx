import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import {
  LayoutDashboard,
  Gauge,
  Building2,
  MessageSquare,
  Mail,
  Images,
  LogOut,
  ExternalLink,
  Eye,
  EyeOff,
  LockKeyhole,
  ArrowRight,
  LoaderCircle,
  Check,
  Copy,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useSiteContent } from "../content/SiteContentProvider";
import { adminError } from "../content/api";
import type { ContactFilters } from "../lib/adminMessages";
import type { AdminTab as Tab } from "../components/admin/tabs";
import setupSql from "../../supabase/migrations/202610080001_admin_cms.sql?raw";
import dashboardSql from "../../supabase/migrations/202610080002_admin_dashboard_analytics.sql?raw";
const AdminDashboard = lazy(() => import("../components/admin/AdminDashboard"));
const ContentEditor = lazy(() => import("../components/admin/ContentEditor"));
const AdminListings = lazy(() => import("../components/admin/AdminListings"));
const AdminMessages = lazy(() => import("../components/admin/AdminMessages"));
const MediaLibrary = lazy(() => import("../components/admin/MediaLibrary"));
const tabs = [
  { id: "dashboard" as const, label: "Tableau de bord", icon: Gauge },
  { id: "content" as const, label: "Contenus du site", icon: LayoutDashboard },
  { id: "listings" as const, label: "Biens immobiliers", icon: Building2 },
  { id: "media" as const, label: "Médiathèque", icon: Images },
  { id: "requests" as const, label: "Demandes clients", icon: MessageSquare },
  { id: "subscribers" as const, label: "Newsletter", icon: Mail },
];

export default function Admin() {
  const { content } = useSiteContent();
  const [user, setUser] = useState<User | null>(null);
  const [phase, setPhase] = useState<
    "checking" | "allowed" | "denied" | "setup" | "error" | "login"
  >("checking");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [visited, setVisited] = useState<Set<Tab>>(
    () => new Set<Tab>(["dashboard"]),
  );
  const [requestPreset, setRequestPreset] = useState<{
    filters: ContactFilters;
    nonce: number;
  } | null>(null);
  const [contentDirty, setContentDirty] = useState(false);
  const [listingDirty, setListingDirty] = useState(false);
  const [copied, setCopied] = useState(false);
  const checkVersion = useRef(0);
  const allowedId = useRef<string | null>(null);
  const mounted = useRef(true);
  const onContentDirty = useCallback(
    (value: boolean) => setContentDirty(value),
    [],
  );
  const onListingDirty = useCallback(
    (value: boolean) => setListingDirty(value),
    [],
  );
  const openRequests = useCallback((filters: ContactFilters) => {
    setRequestPreset({ filters, nonce: Date.now() });
    setTab("requests");
    setVisited((current) => new Set([...current, "requests"]));
  }, []);
  const authorize = useCallback(async (next: User | null, force = false) => {
    const version = ++checkVersion.current;
    if (!mounted.current) return;
    setUser(next);
    if (!next) {
      allowedId.current = null;
      setPhase("login");
      return;
    }
    if (!force && allowedId.current === next.id) return;
    setPhase("checking");
    setError("");
    try {
      const { data, error: failure } = await supabase.rpc("is_cms_admin");
      if (version !== checkVersion.current || !mounted.current) return;
      if (failure) {
        allowedId.current = null;
        setError(adminError(failure));
        setPhase(
          ["PGRST202", "PGRST205", "42883", "42P01"].includes(failure.code)
            ? "setup"
            : "error",
        );
        return;
      }
      allowedId.current = data === true ? next.id : null;
      setPhase(data === true ? "allowed" : "denied");
    } catch (failure) {
      if (mounted.current && version === checkVersion.current) {
        setError(adminError(failure));
        setPhase("error");
      }
    }
  }, []);
  useEffect(() => {
    mounted.current = true;
    void supabase.auth
      .getSession()
      .then(({ data, error: failure }) => {
        if (failure) throw failure;
        return authorize(data.session?.user ?? null);
      })
      .catch((failure) => {
        if (mounted.current) {
          setPhase("error");
          setError(adminError(failure));
        }
      });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void authorize(session?.user ?? null);
    });
    return () => {
      mounted.current = false;
      checkVersion.current++;
      subscription.unsubscribe();
    };
  }, [authorize]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (contentDirty || listingDirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [contentDirty, listingDirty]);
  async function login(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const { error: failure } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (failure) throw failure;
      setPassword("");
    } catch {
      setError(
        "Connexion impossible. Vérifiez vos identifiants et votre connexion, puis réessayez.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    if (
      busy ||
      ((contentDirty || listingDirty) &&
        !window.confirm(
          "Des changements ne sont pas enregistrés. Quitter tout de même ?",
        ))
    )
      return;
    setBusy(true);
    setError("");
    try {
      const { error: failure } = await supabase.auth.signOut({
        scope: "local",
      });
      if (failure) throw failure;
      allowedId.current = null;
      setUser(null);
      setPhase("login");
      setContentDirty(false);
      setListingDirty(false);
    } catch (failure) {
      setError(adminError(failure));
    } finally {
      setBusy(false);
    }
  }
  const logo = (
    <img
      src={content.images.logo.url}
      alt={content.settings.brand}
      className="h-7 max-w-[110px] object-contain"
    />
  );
  if (phase === "checking")
    return (
      <div
        lang="fr"
        className="admin-shell min-h-screen grid place-items-center"
        dir="ltr"
      >
        <div
          className="flex items-center gap-3 text-sm text-zinc-500"
          role="status"
        >
          <LoaderCircle size={20} className="animate-spin text-[#d4af37]" />
          Vérification de votre accès…
        </div>
      </div>
    );
  if (phase === "login")
    return (
      <div
        lang="fr"
        className="admin-shell min-h-screen flex items-center justify-center p-6"
        dir="ltr"
      >
        <div className="w-full max-w-md">
          <a href="/" className="inline-block mb-10">
            {logo}
          </a>
          <div className="admin-card p-7 sm:p-9">
            <div className="w-10 h-10 rounded-xl bg-[#d4af3712] text-[#d4af37] flex items-center justify-center mb-6">
              <LockKeyhole size={20} />
            </div>
            <h1 className="text-2xl font-semibold mb-3">Votre espace admin</h1>
            <p className="text-sm text-zinc-500 leading-relaxed mb-8">
              Les contenus, images et demandes clients. Un seul endroit pour
              gérer votre site.
            </p>
            {error && (
              <p className="admin-notice admin-error mb-5" role="alert">
                {error}
              </p>
            )}
            <form onSubmit={(event) => void login(event)} className="space-y-5">
              <div>
                <label htmlFor="admin-email" className="admin-label">
                  Email
                </label>
                <input
                  id="admin-email"
                  className="admin-input"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="votre@email.com"
                />
              </div>
              <div>
                <label htmlFor="admin-password" className="admin-label">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="admin-password"
                    className="admin-input pe-12"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute end-3 top-3 text-zinc-500"
                    aria-label={
                      showPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="admin-button admin-button-primary w-full py-3"
                disabled={busy}
              >
                {busy ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <ArrowRight size={16} />
                )}
                Se connecter
              </button>
            </form>
          </div>
          <p className="text-xs text-zinc-600 mt-6 flex items-center justify-center gap-2">
            <ShieldCheck size={13} />
            Accès réservé aux comptes autorisés
          </p>
        </div>
      </div>
    );
  if (phase !== "allowed")
    return (
      <div
        lang="fr"
        className="admin-shell min-h-screen flex justify-center p-6 pt-20"
        dir="ltr"
      >
        <div className="w-full max-w-2xl space-y-6">
          <a href="/" className="inline-block mb-6">
            {logo}
          </a>
          <div className="admin-card space-y-5">
            <h1 className="text-2xl font-semibold">
              {phase === "setup"
                ? "Une dernière étape de configuration"
                : phase === "denied"
                  ? "Accès non autorisé"
                  : "Connexion au CMS indisponible"}
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {phase === "denied"
                ? "Ce compte est connecté, mais il n’est pas administrateur. Le propriétaire du projet doit l’autoriser dans la table cms_administrators."
                : error}
            </p>
            {phase === "setup" && (
              <>
                <ol className="text-sm text-zinc-400 list-decimal ps-5 space-y-3">
                  <li>
                    Le propriétaire ouvre le SQL Editor du projet Supabase.
                  </li>
                  <li>Il exécute la migration et autorise votre compte.</li>
                  <li>Revenez ici et cliquez sur « Vérifier mon accès ».</li>
                </ol>
                <p className="text-xs text-zinc-500">
                  Le bouton copie les deux schémas SQL (CMS puis tableau de
                  bord, relances et statistiques) et l’autorisation du compte
                  actuellement connecté. Il n’exécute rien sur le serveur. Guide
                  complet : docs/ADMIN_CMS.md.
                </p>
                <button
                  className="admin-button"
                  onClick={() => {
                    const grant =
                      user && /^[a-f0-9-]{36}$/i.test(user.id)
                        ? `\n-- Authorise the currently signed-in account after reviewing its identity.\ninsert into public.cms_administrators (user_id) values ('${user.id}') on conflict do nothing;\n`
                        : "";
                    // Both migrations: the second one adds the dashboard, private
                    // follow-up fields and consent-based audience measurement.
                    void navigator.clipboard
                      .writeText(setupSql + "\n\n" + dashboardSql + grant)
                      .then(() => setCopied(true))
                      .catch(() =>
                        setError(
                          "Copie indisponible. Ouvrez les fichiers supabase/migrations/202610080001_admin_cms.sql puis 202610080002_admin_dashboard_analytics.sql dans le dépôt.",
                        ),
                      );
                  }}
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? "SQL copié" : "Copier le SQL de configuration"}
                </button>
              </>
            )}
            <p className="text-xs text-zinc-500 break-all">
              Compte : {user?.email || "non connecté"}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                className="admin-button admin-button-primary"
                onClick={() => {
                  if (user) void authorize(user, true);
                  else
                    void supabase.auth
                      .getSession()
                      .then(({ data }) =>
                        authorize(data.session?.user ?? null, true),
                      );
                }}
              >
                Vérifier mon accès
              </button>
              <button
                className="admin-button"
                disabled={busy}
                onClick={() => void logout()}
              >
                Déconnexion
              </button>
              <a className="admin-button" href="/">
                Retour au site
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  return (
    <div
      lang="fr"
      className="admin-shell min-h-screen flex flex-col lg:flex-row"
      dir="ltr"
    >
      <aside className="lg:w-64 lg:fixed lg:inset-y-0 border-b lg:border-b-0 lg:border-r border-white/5 bg-[#0d0e11] flex flex-col z-20">
        <div className="px-6 py-7 flex items-center gap-3">
          {logo}
          <span className="text-[9px] uppercase tracking-widest px-2 py-1 border border-[#d4af3730] text-[#d4af37] rounded">
            Admin
          </span>
        </div>
        <div className="hidden lg:block px-7 text-[9px] uppercase tracking-[.18em] text-zinc-600 mb-4">
          Votre espace de gestion
        </div>
        <nav className="flex lg:flex-col overflow-x-auto px-3 lg:px-4 gap-1 pb-4 lg:pb-0">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setTab(item.id);
                setVisited((current) => new Set([...current, item.id]));
              }}
              className={`flex items-center gap-3 text-start shrink-0 px-4 py-3 rounded-lg text-xs transition-colors ${tab === item.id ? "bg-[#d4af3710] text-[#e4cd84]" : "text-zinc-500 hover:bg-white/[.03] hover:text-zinc-200"}`}
              aria-current={tab === item.id ? "page" : undefined}
            >
              <item.icon size={17} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="hidden lg:block mt-auto px-6 py-6 border-t border-white/5">
          <a
            className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white"
            href="/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink size={14} />
            Voir le site public
          </a>
          <p className="mt-5 text-[10px] text-zinc-600">
            {content.settings.name}
          </p>
        </div>
      </aside>
      <div className="lg:ms-64 flex-1 min-w-0">
        <header className="h-20 border-b border-white/5 px-5 sm:px-8 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-[.16em] text-zinc-500">
              Administration
            </span>
            <p className="text-xs text-zinc-400 mt-1">
              {content.settings.brand}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="lg:hidden text-zinc-500"
              aria-label="Voir le site"
            >
              <ExternalLink size={16} />
            </a>
            <span className="text-[11px] text-zinc-500 hidden sm:inline break-all">
              {user?.email}
            </span>
            <button
              className="admin-button"
              disabled={busy}
              onClick={() => void logout()}
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </header>
        <div className="p-4 sm:p-8 max-w-[1440px] mx-auto">
          {error && (
            <p className="admin-notice admin-error mb-6" role="alert">
              {error}
            </p>
          )}
          <Suspense
            fallback={
              <p className="text-sm text-zinc-500 py-12" role="status">
                Chargement de l’espace…
              </p>
            }
          >
            {visited.has("dashboard") && (
              <section hidden={tab !== "dashboard"}>
                <AdminDashboard
                  active={tab === "dashboard"}
                  onNavigate={(next) => {
                    setTab(next);
                    setVisited((current) => new Set([...current, next]));
                  }}
                  onOpenRequests={openRequests}
                />
              </section>
            )}
            {visited.has("content") && (
              <section hidden={tab !== "content"}>
                <ContentEditor
                  active={tab === "content"}
                  onUnsavedChange={onContentDirty}
                />
              </section>
            )}
            {visited.has("listings") && (
              <section hidden={tab !== "listings"}>
                <AdminListings
                  active={tab === "listings"}
                  onUnsavedChange={onListingDirty}
                />
              </section>
            )}
            {visited.has("requests") && (
              <section hidden={tab !== "requests"}>
                <AdminMessages mode="requests" preset={requestPreset} />
              </section>
            )}
            {visited.has("subscribers") && (
              <section hidden={tab !== "subscribers"}>
                <AdminMessages mode="subscribers" />
              </section>
            )}
            {visited.has("media") && (
              <section hidden={tab !== "media"}>
                <MediaLibrary />
              </section>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
