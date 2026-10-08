import { useCallback, useEffect, useRef, useState } from "react";
import {
  Activity,
  BarChart3,
  BellRing,
  Building2,
  CalendarClock,
  CircleAlert,
  Globe,
  Images,
  Inbox,
  LayoutDashboard,
  Mail,
  MessagesSquare,
  Newspaper,
  RefreshCw,
  ShieldCheck,
  Timer,
  Users,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { adminError } from "../../content/api";
import {
  isReminderOverdue,
  parseAnalyticsSummary,
  parseDashboardPayload,
  type AnalyticsSummary,
  type ContactFilters,
  type DashboardPayload,
} from "../../lib/adminMessages";
import { RETENTION_DAYS } from "../../lib/analytics";
import type { AdminTab } from "./tabs";

const PERIODS = [7, 30, 90] as const;
type Period = (typeof PERIODS)[number];

/** Missing-RPC codes: the second migration has not been applied to this project yet. */
const MISSING_ROUTINE = ["PGRST202", "42883", "PGRST205", "42P01"];

function isMissingRoutine(error: unknown): boolean {
  const failure = error as { code?: string } | undefined;
  return MISSING_ROUTINE.includes(failure?.code ?? "");
}

function since(value: string | null | undefined, now: number): string {
  if (!value) return "—";
  const moment = Date.parse(value);
  if (!Number.isFinite(moment)) return "—";
  const seconds = Math.max(0, Math.round((now - moment) / 1000));
  if (seconds < 60) return "à l’instant";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `il y a ${hours} h`;
  return `il y a ${Math.round(hours / 24)} j`;
}

function moment(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString("fr", { dateStyle: "short", timeStyle: "short" });
}

interface FallbackCounters {
  total: number;
  by_status: { new: number; contacted: number; archived: number };
  subscribers_total: number;
  subscribers_active: number;
  last_request_at: string | null;
  recent: DashboardPayload["recent"];
}

export default function AdminDashboard({
  active,
  onNavigate,
  onOpenRequests,
}: {
  active: boolean;
  onNavigate: (tab: AdminTab) => void;
  onOpenRequests: (filters: ContactFilters) => void;
}) {
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [fallback, setFallback] = useState<FallbackCounters | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [analyticsState, setAnalyticsState] = useState<
    "loading" | "ready" | "missing" | "error"
  >("loading");
  const [period, setPeriod] = useState<Period>(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadedAt, setLoadedAt] = useState<number>(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const readVersion = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const loadDashboard = useCallback(async () => {
    try {
      const { data, error: failure } = await supabase.rpc(
        "contact_requests_dashboard",
        { p_recent: 5 },
      );
      if (failure) throw failure;
      return parseDashboardPayload(data);
    } catch (failure) {
      if (!isMissingRoutine(failure)) throw failure;
      // Degraded mode: the first migration is installed, so exact counters are still
      // available through PostgREST even without the dashboard function.
      const head = async (
        build: () => PromiseLike<{ count: number | null; error: unknown }>,
      ) => {
        const { count, error: countError } = await build();
        if (countError) throw countError;
        return count ?? 0;
      };
      const statusCount = (status: string) =>
        head(() =>
          supabase
            .from("contact_requests")
            .select("id", { count: "exact", head: true })
            .eq("status", status),
        );
      const [total, newCount, contacted, archived, subscribersTotal, active_] =
        await Promise.all([
          head(() =>
            supabase
              .from("contact_requests")
              .select("id", { count: "exact", head: true }),
          ),
          statusCount("new"),
          statusCount("contacted"),
          statusCount("archived"),
          head(() =>
            supabase
              .from("newsletter_subscriptions")
              .select("id", { count: "exact", head: true }),
          ),
          head(() =>
            supabase
              .from("newsletter_subscriptions")
              .select("id", { count: "exact", head: true })
              .eq("active", true),
          ),
        ]);
      const { data: rows, error: recentError } = await supabase
        .from("contact_requests")
        .select("id, name, service, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      if (recentError) throw recentError;
      const recent = (rows ?? []) as {
        id: string;
        name: string;
        service: string;
        status: string;
        created_at: string;
      }[];
      setFallback({
        total,
        by_status: { new: newCount, contacted, archived },
        subscribers_total: subscribersTotal,
        subscribers_active: active_,
        last_request_at: recent[0]?.created_at ?? null,
        recent: recent.map((row) => ({
          id: row.id,
          name: row.name,
          service: row.service as DashboardPayload["recent"][number]["service"],
          status: row.status as DashboardPayload["recent"][number]["status"],
          created_at: row.created_at,
          reminder_at: null,
          has_notes: false,
        })),
      });
      return null;
    }
  }, []);

  const loadAnalytics = useCallback(async () => {
    try {
      const { data, error: failure } = await supabase.rpc("analytics_summary", {
        p_days: period,
      });
      if (failure) throw failure;
      return parseAnalyticsSummary(data);
    } catch (failure) {
      if (isMissingRoutine(failure)) {
        setAnalyticsState("missing");
        return null;
      }
      setAnalyticsState("error");
      setAnalytics(null);
      setError(adminError(failure));
      return null;
    }
  }, [period]);

  const load = useCallback(async () => {
    const version = ++readVersion.current;
    setLoading(true);
    setError("");
    const [counters, stats] = await Promise.allSettled([
      loadDashboard(),
      loadAnalytics(),
    ]);
    if (version !== readVersion.current) return;
    if (counters.status === "fulfilled") {
      const payload = counters.value;
      setDashboard(payload);
      if (payload) setFallback(null);
    } else setError(adminError(counters.reason));
    if (stats.status === "fulfilled" && stats.value) {
      setAnalytics(stats.value);
      setAnalyticsState("ready");
    }
    setLoadedAt(Date.now());
    setLoading(false);
  }, [loadDashboard, loadAnalytics]);

  useEffect(() => {
    if (active) void load();
  }, [active, load]);

  const counters: {
    total: number;
    byStatus: { new: number; contacted: number; archived: number };
    overdue: number;
    dueSoon: number;
    untouchedNew: number;
    subscribers: number;
    subscribersActive: number;
    recent: DashboardPayload["recent"];
    generatedAt: string | null;
    lastRequestAt: string | null;
    oldestNewAt: string | null;
    exact: boolean;
  } = dashboard
    ? {
        total: dashboard.total,
        byStatus: dashboard.by_status,
        overdue: dashboard.overdue,
        dueSoon: dashboard.due_soon,
        untouchedNew: dashboard.untouched_new,
        subscribers: dashboard.subscribers_total,
        subscribersActive: dashboard.subscribers_active,
        recent: dashboard.recent,
        generatedAt: dashboard.generated_at,
        lastRequestAt: dashboard.last_request_at ?? null,
        oldestNewAt: dashboard.oldest_new_at ?? null,
        exact: true,
      }
    : {
        total: fallback?.total ?? 0,
        byStatus: fallback?.by_status ?? { new: 0, contacted: 0, archived: 0 },
        overdue: 0,
        dueSoon: 0,
        untouchedNew: 0,
        subscribers: fallback?.subscribers_total ?? 0,
        subscribersActive: fallback?.subscribers_active ?? 0,
        recent: fallback?.recent ?? [],
        generatedAt: null,
        lastRequestAt: fallback?.last_request_at ?? null,
        oldestNewAt: null,
        exact: Boolean(fallback),
      };

  const cards = [
    {
      label: "Demandes enregistrées",
      value: counters.total,
      hint: "Total exact, compté par la base",
      icon: Inbox,
    },
    {
      label: "Nouvelles",
      value: counters.byStatus.new,
      hint:
        counters.untouchedNew > 0
          ? `${counters.untouchedNew} sans premier contact depuis 7 j ou plus`
          : "Statut « nouveau »",
      icon: BellRing,
    },
    {
      label: "Contactées",
      value: counters.byStatus.contacted,
      hint: "Statut « contacté »",
      icon: MessagesSquare,
    },
    {
      label: "Archivées",
      value: counters.byStatus.archived,
      hint: "Statut « archivé »",
      icon: Inbox,
    },
    {
      label: "Relances échues",
      value: counters.overdue,
      hint: "Date de relance dépassée, non archivée",
      icon: CalendarClock,
      alert: counters.overdue > 0,
    },
    {
      label: "Relances à venir",
      value: counters.dueSoon,
      hint: "Dans les 7 prochains jours",
      icon: Timer,
    },
    {
      label: "Abonnés newsletter",
      value: counters.subscribers,
      hint: `${counters.subscribersActive} actif(s)`,
      icon: Mail,
    },
    {
      label: "Pages vues (période)",
      value: analytics ? analytics.totals.pageviews : "—",
      hint: analytics
        ? `sur ${analytics.days} jours, après consentement`
        : "Statistiques indisponibles",
      icon: Activity,
    },
  ];

  const shortcuts: {
    label: string;
    hint: string;
    icon: typeof Inbox;
    run: () => void;
  }[] = [
    {
      label:
        counters.overdue > 0
          ? `Traiter ${counters.overdue} relance(s) échue(s)`
          : "Voir les demandes clients",
      hint:
        counters.overdue > 0
          ? "Ouvre la liste filtrée sur les relances échues"
          : "Filtres, statuts, notes internes et export CSV",
      icon: CalendarClock,
      run: () =>
        counters.overdue > 0
          ? onOpenRequests({
              status: "all",
              service: "all",
              reminder: "overdue",
              search: "",
            })
          : onNavigate("requests"),
    },
    {
      label: "Ouvrir les contenus du site",
      hint: "Textes FR/EN/AR, images, articles",
      icon: LayoutDashboard,
      run: () => onNavigate("content"),
    },
    {
      label: "Gérer les biens immobiliers",
      hint: "Annonces et galeries jusqu’à 30 photos",
      icon: Building2,
      run: () => onNavigate("listings"),
    },
    {
      label: "Ouvrir la médiathèque",
      hint: "Importer des photos depuis l’appareil",
      icon: Images,
      run: () => onNavigate("media"),
    },
    {
      label: "Gérer la newsletter",
      hint: "Abonnements et consentements",
      icon: Mail,
      run: () => onNavigate("subscribers"),
    },
    {
      label: "Voir le site public",
      hint: "Ouvre le site dans un nouvel onglet",
      icon: Newspaper,
      run: () => window.open("/", "_blank", "noopener,noreferrer"),
    },
  ];

  const dailyMax = analytics
    ? Math.max(1, ...analytics.daily.map((day) => day.pageviews))
    : 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Vue d’ensemble</h1>
          <p className="text-xs text-zinc-500 mt-2">
            Accueil de l’administration · compteurs calculés par le serveur
          </p>
        </div>
        <button
          className="admin-button self-start"
          onClick={() => void load()}
          disabled={loading}
        >
          <RefreshCw size={14} />
          {loading ? "Actualisation…" : "Actualiser"}
        </button>
      </div>

      {error && (
        <p className="admin-notice admin-error" role="alert">
          {error}
        </p>
      )}
      {!dashboard && fallback && (
        <p className="admin-notice">
          La migration <code>202610080002_admin_dashboard_analytics.sql</code>{" "}
          n’est pas appliquée sur ce projet : les totaux exacts et les demandes
          récentes s’affichent, mais les relances, notes internes et
          statistiques de fréquentation restent indisponibles.
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="admin-card">
            <div className="flex items-start justify-between gap-3">
              <p className="text-[10px] uppercase tracking-[.14em] text-zinc-500">
                {card.label}
              </p>
              <card.icon
                size={16}
                className={card.alert ? "text-red-300" : "text-[#d4af37]"}
              />
            </div>
            <p
              className={`text-3xl font-semibold mt-4 ${card.alert ? "text-red-300" : ""}`}
            >
              {card.value}
            </p>
            <p className="text-[10px] text-zinc-500 mt-3">{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="admin-card space-y-4">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Timer size={15} className="text-[#d4af37]" />
            Fraîcheur des données
          </h2>
          <dl className="text-xs space-y-3">
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Compteurs serveur</dt>
              <dd>
                {counters.exact ? (
                  <>
                    {moment(counters.generatedAt)} ·{" "}
                    <span className="text-zinc-500">
                      {since(counters.generatedAt, now)}
                    </span>
                  </>
                ) : (
                  "calculés par le navigateur (migration 2 absente)"
                )}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Dernière demande reçue</dt>
              <dd>
                {moment(counters.lastRequestAt)} ·{" "}
                <span className="text-zinc-500">
                  {since(counters.lastRequestAt, now)}
                </span>
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Plus ancienne demande nouvelle</dt>
              <dd>
                {moment(counters.oldestNewAt)} ·{" "}
                <span className="text-zinc-500">
                  {since(counters.oldestNewAt, now)}
                </span>
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Dernière actualisation</dt>
              <dd>{since(new Date(loadedAt).toISOString(), now)}</dd>
            </div>
          </dl>
          <p className="text-[10px] text-zinc-500">
            Les totaux ci-dessus proviennent d’un comptage en base : ils restent
            exacts même si la liste n’affiche que 50 demandes à la fois.
          </p>
        </div>

        <div className="admin-card space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Inbox size={15} className="text-[#d4af37]" />
              Demandes récentes
            </h2>
            <button
              className="admin-button"
              onClick={() => onNavigate("requests")}
            >
              Tout voir
            </button>
          </div>
          {counters.recent.length ? (
            <ul className="text-xs space-y-3">
              {counters.recent.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3 last:border-0 last:pb-0"
                >
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-zinc-500">
                    {item.service === "realEstate"
                      ? "Immobilier"
                      : "Création d’entreprise"}{" "}
                    · {moment(item.created_at)}
                  </span>
                  <span className="flex items-center gap-2 text-[10px]">
                    <span className="rounded px-2 py-1 text-zinc-400 bg-white/5">
                      {item.status === "new"
                        ? "Nouveau"
                        : item.status === "contacted"
                          ? "Contacté"
                          : "Archivé"}
                    </span>
                    {item.reminder_at && (
                      <span
                        className={`rounded px-2 py-1 ${isReminderOverdue(item, now) ? "text-red-300 bg-red-400/10" : "text-zinc-400 bg-white/5"}`}
                      >
                        {isReminderOverdue(item, now)
                          ? "Relance échue"
                          : "Relance"}
                      </span>
                    )}
                    {item.has_notes && (
                      <span className="rounded px-2 py-1 text-zinc-400 bg-white/5">
                        Note interne
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-zinc-500">
              Aucune demande enregistrée pour le moment.
            </p>
          )}
        </div>
      </div>

      <div className="admin-card space-y-4">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <LayoutDashboard size={15} className="text-[#d4af37]" />
          Raccourcis
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {shortcuts.map((shortcut) => (
            <button
              key={shortcut.label}
              className="text-start p-4 rounded-lg border border-white/5 hover:bg-white/[.03] transition-colors"
              onClick={shortcut.run}
            >
              <span className="flex items-center gap-2 text-xs font-semibold">
                <shortcut.icon size={14} className="text-[#d4af37]" />
                {shortcut.label}
              </span>
              <span className="block text-[10px] text-zinc-500 mt-2">
                {shortcut.hint}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="admin-card space-y-5">
        <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <BarChart3 size={15} className="text-[#d4af37]" />
            Fréquentation du site public
          </h2>
          <div
            className="flex gap-2"
            role="group"
            aria-label="Période analysée"
          >
            {PERIODS.map((value) => (
              <button
                key={value}
                className={`admin-button ${period === value ? "admin-button-primary" : ""}`}
                aria-pressed={period === value}
                onClick={() => setPeriod(value)}
              >
                {value} j
              </button>
            ))}
          </div>
        </div>
        <div className="admin-notice flex gap-3">
          <ShieldCheck size={15} className="shrink-0 mt-0.5 text-[#d4af37]" />
          <span>
            Mesure uniquement après consentement explicite du visiteur. Aucune
            adresse IP, aucun cookie, aucune empreinte numérique, aucune donnée
            transmise à un tiers : seuls chemin de page, famille de navigateur,
            identifiant de session aléatoire et horodatage sont enregistrés,
            puis supprimés automatiquement après {RETENTION_DAYS} jours.
          </span>
        </div>
        {analyticsState === "missing" && (
          <p className="admin-notice">
            Les statistiques nécessitent la migration{" "}
            <code>202610080002_admin_dashboard_analytics.sql</code>. Elle n’a
            pas encore été appliquée à ce projet : rien n’est mesuré et aucun
            chiffre n’est inventé.
          </p>
        )}
        {analyticsState === "error" && (
          <p className="admin-notice admin-error" role="alert">
            Statistiques momentanément indisponibles.
          </p>
        )}
        {analytics ? (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Pages vues",
                  value: analytics.totals.pageviews,
                  icon: Activity,
                },
                {
                  label: "Sessions distinctes",
                  value: analytics.totals.sessions,
                  icon: Users,
                },
                {
                  label: "Pages distinctes",
                  value: analytics.totals.pages,
                  icon: Globe,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-white/5 p-4"
                >
                  <p className="text-[10px] uppercase tracking-[.12em] text-zinc-500 flex items-center gap-2">
                    <stat.icon size={12} /> {stat.label}
                  </p>
                  <p className="text-2xl font-semibold mt-3">{stat.value}</p>
                </div>
              ))}
            </div>
            {analytics.daily.length > 0 && (
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-[.12em] text-zinc-500">
                  Pages vues par jour
                </p>
                <div
                  className="flex items-end gap-1 h-24"
                  role="img"
                  aria-label="Pages vues par jour"
                >
                  {analytics.daily.map((day) => (
                    <div
                      key={day.day}
                      className="flex-1 rounded-t"
                      style={{
                        height: `${Math.max(4, Math.round((day.pageviews / dailyMax) * 100))}%`,
                        background: "#d4af3766",
                      }}
                      title={`${day.day} · ${day.pageviews} page(s) vue(s) · ${day.sessions} session(s)`}
                    />
                  ))}
                </div>
              </div>
            )}
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="overflow-x-auto">
                <p className="text-[10px] uppercase tracking-[.12em] text-zinc-500 mb-3">
                  Navigateurs
                </p>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-zinc-500 text-start border-b border-white/5">
                      <th className="text-start py-2">Navigateur</th>
                      <th className="text-end py-2">Pages vues</th>
                      <th className="text-end py-2">Sessions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.browsers.map((browser) => (
                      <tr
                        key={browser.browser}
                        className="border-b border-white/5"
                      >
                        <td className="py-2">{browser.browser}</td>
                        <td className="py-2 text-end">{browser.pageviews}</td>
                        <td className="py-2 text-end">{browser.sessions}</td>
                      </tr>
                    ))}
                    {!analytics.browsers.length && (
                      <tr>
                        <td className="py-3 text-zinc-500" colSpan={3}>
                          Aucun consentement enregistré sur la période.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="overflow-x-auto">
                <p className="text-[10px] uppercase tracking-[.12em] text-zinc-500 mb-3">
                  Pages les plus consultées
                </p>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-zinc-500 text-start border-b border-white/5">
                      <th className="text-start py-2">Chemin</th>
                      <th className="text-end py-2">Pages vues</th>
                      <th className="text-end py-2">Sessions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.top_pages.map((page) => (
                      <tr key={page.path} className="border-b border-white/5">
                        <td className="py-2 break-all">{page.path}</td>
                        <td className="py-2 text-end">{page.pageviews}</td>
                        <td className="py-2 text-end">{page.sessions}</td>
                      </tr>
                    ))}
                    {!analytics.top_pages.length && (
                      <tr>
                        <td className="py-3 text-zinc-500" colSpan={3}>
                          Aucune page mesurée sur la période.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="text-[10px] text-zinc-500 space-y-2">
              <p>
                Première mesure : {moment(analytics.first_recorded_at)} ·
                dernière mesure : {moment(analytics.last_recorded_at)}{" "}
                (conservation {analytics.retention_days} jours).
              </p>
              <p className="flex gap-2">
                <CircleAlert size={12} className="shrink-0 mt-0.5" />
                <span>
                  <strong>Pourquoi ces chiffres sous-comptent :</strong> seuls
                  les visiteurs qui ont accepté sont mesurés, et un signal « Do
                  Not Track » / « Global Privacy Control » désactive toujours la
                  mesure ; les bloqueurs de scripts, un JavaScript désactivé ou
                  une requête en échec ne sont pas comptés ; la page affichée
                  avant le choix n’est jamais enregistrée ; effacer le stockage
                  du navigateur crée une nouvelle session, ce qui surestime les
                  sessions et interdit tout comptage de « visiteurs uniques » —
                  les sessions distinctes en sont une approximation
                  volontairement imprécise.
                </span>
              </p>
            </div>
          </>
        ) : (
          analyticsState !== "error" && (
            <p className="text-xs text-zinc-500">
              Aucune mesure disponible. Les chiffres apparaîtront après le
              premier consentement explicite d’un visiteur.
            </p>
          )
        )}
      </div>
    </div>
  );
}
