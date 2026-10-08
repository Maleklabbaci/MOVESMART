import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Download,
  RefreshCw,
  Trash2,
  ChevronDown,
  CalendarClock,
  StickyNote,
  FilterX,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { adminError } from "../../content/api";
import { downloadCsv } from "../../lib/csv";
import {
  contactFiltersActive,
  emptyContactFilters,
  formatReminder,
  isReminderOverdue,
  parseContactRecords,
  parseSubscriberRecords,
  reminderToIso,
  requestCsvRows,
  sanitizeSearchTerm,
  type ContactFilters,
  type ContactRecord as Contact,
  type ContactStatus,
  type SubscriberRecord as Subscriber,
} from "../../lib/adminMessages";

const PAGE_SIZE = 50;
/** Upper bound for a filtered CSV export; keeps a browser tab responsive. */
const EXPORT_LIMIT = 5_000;
const EXPORT_PAGE = 500;

interface FollowUpResult {
  id: string;
  status: ContactStatus;
  notes: string;
  reminder_at: string | null;
  updated_at: string;
}

export default function AdminMessages({
  mode,
  preset = null,
}: {
  mode: "requests" | "subscribers";
  preset?: { filters: ContactFilters; nonce: number } | null;
}) {
  const [requests, setRequests] = useState<Contact[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filters, setFilters] = useState<ContactFilters>(
    preset?.filters ?? emptyContactFilters,
  );
  const [search, setSearch] = useState(filters.search);
  const [supportsFollowUp, setSupportsFollowUp] = useState<boolean | null>(
    null,
  );
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [reminderDraft, setReminderDraft] = useState<Record<string, string>>(
    {},
  );
  const readVersion = useRef(0);
  const readRequest = useRef<AbortController | null>(null);
  const mutationLock = useRef(false);
  const table =
    mode === "requests" ? "contact_requests" : "newsletter_subscriptions";
  const loaded = mode === "requests" ? requests.length : subscribers.length;

  // Debounce the search box: each keystroke must not become a database query.
  useEffect(() => {
    const timer = setTimeout(
      () => setFilters((current) => ({ ...current, search })),
      350,
    );
    return () => clearTimeout(timer);
  }, [search]);

  // The dashboard can jump to a pre-filtered list (for example overdue reminders).
  const presetNonce = preset?.nonce ?? 0;
  useEffect(() => {
    if (!preset) return;
    setFilters(preset.filters);
    setSearch(preset.filters.search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetNonce]);

  // Detects the follow-up columns of the second migration without failing the panel.
  useEffect(() => {
    if (mode !== "requests") return;
    let cancelled = false;
    void supabase
      .from("contact_requests")
      .select("reminder_at, notes")
      .limit(1)
      .then(({ error: failure }) => {
        if (!cancelled) setSupportsFollowUp(!failure);
      });
    return () => {
      cancelled = true;
    };
  }, [mode]);

  const queryKey = `${filters.status}|${filters.service}|${filters.reminder}|${sanitizeSearchTerm(filters.search)}`;

  const buildQuery = useCallback(
    (from: number, to: number) => {
      const term = sanitizeSearchTerm(filters.search);
      const now = new Date().toISOString();
      let query = supabase.from(table).select("*", { count: "exact" });
      if (mode === "requests") {
        if (filters.status !== "all")
          query = query.eq("status", filters.status);
        if (filters.service !== "all")
          query = query.eq("service", filters.service);
        if (term)
          query = query.or(
            `name.ilike.*${term}*,email.ilike.*${term}*,phone.ilike.*${term}*,message.ilike.*${term}*`,
          );
        if (filters.reminder === "overdue")
          query = query
            .not("reminder_at", "is", null)
            .lte("reminder_at", now)
            .neq("status", "archived");
        else if (filters.reminder === "upcoming")
          query = query
            .not("reminder_at", "is", null)
            .gt("reminder_at", now)
            .neq("status", "archived");
        else if (filters.reminder === "none")
          query = query.is("reminder_at", null);
      }
      return query
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .range(from, to);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, mode, queryKey],
  );

  const load = useCallback(
    async (offset = 0) => {
      if (mutationLock.current) return;
      const version = ++readVersion.current;
      readRequest.current?.abort();
      const controller = new AbortController();
      readRequest.current = controller;
      setLoading(true);
      setError("");
      try {
        const {
          data,
          error: failure,
          count: total,
        } = await buildQuery(offset, offset + PAGE_SIZE - 1).abortSignal(
          controller.signal,
        );
        if (failure) throw failure;
        if (version !== readVersion.current) return;
        if (mode === "requests") {
          const rows = parseContactRecords(data || []);
          setRequests((current) =>
            offset
              ? [
                  ...new Map(
                    [...current, ...rows].map((item) => [item.id, item]),
                  ).values(),
                ]
              : rows,
          );
        } else {
          const rows = parseSubscriberRecords(data || []);
          setSubscribers((current) =>
            offset
              ? [
                  ...new Map(
                    [...current, ...rows].map((item) => [item.id, item]),
                  ).values(),
                ]
              : rows,
          );
        }
        setCount(total ?? 0);
      } catch (failure) {
        if (version === readVersion.current) setError(adminError(failure));
      } finally {
        if (version === readVersion.current) {
          readRequest.current = null;
          setLoading(false);
        }
      }
    },
    [buildQuery, mode],
  );

  useEffect(() => {
    void load();
    return () => {
      ++readVersion.current;
      readRequest.current?.abort();
      readRequest.current = null;
    };
  }, [load]);

  async function updateStatus(id: string, status: ContactStatus) {
    if (mutationLock.current || readRequest.current) return;
    mutationLock.current = true;
    setBusy(id);
    setError("");
    try {
      if (supportsFollowUp === false) return await legacyUpdate(id, { status });
      const result = await followUp(id, { status });
      applyFollowUp(result);
    } catch (failure) {
      setError(adminError(failure));
    } finally {
      mutationLock.current = false;
      setBusy(null);
    }
  }

  async function legacyUpdate(id: string, payload: Record<string, unknown>) {
    const { data, error: failure } = await supabase
      .from(table)
      .update(payload)
      .eq("id", id)
      .select("id")
      .single();
    if (failure) throw failure;
    if (data?.id !== id) throw new Error("Modification non confirmée.");
    setRequests((current) =>
      current.map((item) =>
        item.id === id ? ({ ...item, ...payload } as Contact) : item,
      ),
    );
  }

  async function followUp(
    id: string,
    payload: {
      status?: ContactStatus;
      notes?: string;
      reminder_at?: string | null;
      clear_reminder?: boolean;
    },
  ): Promise<FollowUpResult> {
    const { data, error: failure } = await supabase.rpc(
      "update_contact_follow_up",
      {
        p_id: id,
        p_status: payload.status ?? null,
        p_notes: payload.notes ?? null,
        p_reminder_at: payload.reminder_at ?? null,
        p_clear_reminder: payload.clear_reminder ?? false,
      },
    );
    if (failure) throw failure;
    if (!data || typeof data !== "object" || data.id !== id)
      throw new Error("Modification non confirmée.");
    return data as FollowUpResult;
  }

  function applyFollowUp(result: FollowUpResult) {
    setRequests((current) =>
      current.map((item) =>
        item.id === result.id
          ? {
              ...item,
              status: result.status,
              notes: result.notes ?? "",
              reminder_at: result.reminder_at,
              updated_at: result.updated_at,
            }
          : item,
      ),
    );
    setNotesDraft((current) => ({
      ...current,
      [result.id]: result.notes ?? "",
    }));
    setReminderDraft((current) => ({
      ...current,
      [result.id]: formatReminder(result.reminder_at),
    }));
  }

  async function saveNotes(item: Contact) {
    if (mutationLock.current || readRequest.current) return;
    mutationLock.current = true;
    setBusy(item.id);
    setError("");
    try {
      const result = await followUp(item.id, {
        notes: notesDraft[item.id] ?? item.notes,
      });
      applyFollowUp(result);
      setNotice("Note interne enregistrée. Elle reste privée.");
    } catch (failure) {
      setError(adminError(failure));
    } finally {
      mutationLock.current = false;
      setBusy(null);
    }
  }

  async function saveReminder(item: Contact, value: string | null) {
    if (mutationLock.current || readRequest.current) return;
    mutationLock.current = true;
    setBusy(item.id);
    setError("");
    try {
      const iso = value ? reminderToIso(value) : null;
      if (value && !iso) throw new Error("Date de relance invalide.");
      const result = await followUp(
        item.id,
        iso ? { reminder_at: iso } : { clear_reminder: true },
      );
      applyFollowUp(result);
      setNotice(
        iso
          ? "Relance planifiée. Elle apparaîtra sur le tableau de bord."
          : "Relance retirée.",
      );
    } catch (failure) {
      setError(adminError(failure));
    } finally {
      mutationLock.current = false;
      setBusy(null);
    }
  }

  async function remove(id: string) {
    if (
      mutationLock.current ||
      readRequest.current ||
      !window.confirm("Supprimer définitivement ces données personnelles ?")
    )
      return;
    mutationLock.current = true;
    setBusy(id);
    setError("");
    try {
      const { data, error: failure } = await supabase
        .from(table)
        .delete()
        .eq("id", id)
        .select("id");
      if (failure) throw failure;
      if (!Array.isArray(data) || data.length !== 1 || data[0]?.id !== id)
        throw new Error("Suppression non confirmée.");
      setRequests((current) => current.filter((item) => item.id !== id));
      setSubscribers((current) => current.filter((item) => item.id !== id));
      setCount((value) => Math.max(0, value - 1));
    } catch (failure) {
      setError(adminError(failure));
    } finally {
      mutationLock.current = false;
      setBusy(null);
    }
  }

  async function toggleSubscriber(id: string, active: boolean) {
    if (mutationLock.current || readRequest.current) return;
    mutationLock.current = true;
    setBusy(id);
    setError("");
    try {
      const { data, error: failure } = await supabase
        .from("newsletter_subscriptions")
        .update({ active })
        .eq("id", id)
        .select("id")
        .single();
      if (failure) throw failure;
      if (data?.id !== id) throw new Error("Modification non confirmée.");
      setSubscribers((current) =>
        current.map((item) => (item.id === id ? { ...item, active } : item)),
      );
    } catch (failure) {
      setError(adminError(failure));
    } finally {
      mutationLock.current = false;
      setBusy(null);
    }
  }

  /**
   * Exports the complete filtered selection, not just the page currently on screen,
   * by walking the filtered query in batches.
   */
  async function exportRows() {
    setError("");
    setNotice("");
    if (mode === "subscribers") {
      downloadCsv("movesmart-subscribers.csv", [
        ["Email", "Actif", "Consentement", "Date"],
        ...subscribers.map((item) => [
          item.email,
          item.active ? "Oui" : "Non",
          item.consent_at,
          item.created_at,
        ]),
      ]);
      return;
    }
    setExporting(true);
    try {
      const rows: Contact[] = [];
      for (let offset = 0; offset < EXPORT_LIMIT; offset += EXPORT_PAGE) {
        const { data, error: failure } = await buildQuery(
          offset,
          offset + EXPORT_PAGE - 1,
        );
        if (failure) throw failure;
        const page = parseContactRecords(data || []);
        rows.push(...page);
        if (page.length < EXPORT_PAGE) break;
      }
      downloadCsv("movesmart-requests.csv", requestCsvRows(rows));
      setNotice(
        count > rows.length
          ? `${rows.length} demande(s) exportée(s) sur ${count}. Affinez les filtres pour exporter le reste (limite ${EXPORT_LIMIT}).`
          : `${rows.length} demande(s) exportée(s) avec les filtres actuels.`,
      );
    } catch (failure) {
      setError(adminError(failure));
    } finally {
      setExporting(false);
    }
  }

  const activeFilters = useMemo(() => contactFiltersActive(filters), [filters]);
  const overdueCount = useMemo(
    () => requests.filter((item) => isReminderOverdue(item)).length,
    [requests],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {mode === "requests" ? "Demandes clients" : "Newsletter"}
          </h1>
          <p className="text-xs text-zinc-500 mt-2">
            {count} élément(s) · accès réservé aux administrateurs
            {mode === "requests" && supportsFollowUp === false
              ? " · migration 2 non appliquée : relances et notes indisponibles"
              : ""}
          </p>
        </div>
        <div className="flex gap-2 self-start">
          <button
            className="admin-button"
            onClick={() => void load()}
            disabled={loading || Boolean(busy)}
          >
            <RefreshCw size={14} />
            Actualiser
          </button>
          <button
            className="admin-button"
            onClick={() => void exportRows()}
            disabled={!loaded || exporting}
          >
            <Download size={14} />
            {mode === "requests"
              ? `Exporter (${count})`
              : `Exporter (${loaded})`}
          </button>
        </div>
      </div>
      <div className="admin-notice">
        {mode === "requests"
          ? "Ces demandes ont été enregistrées par le formulaire du site. Aucun email automatique n’est envoyé : contactez les clients depuis les coordonnées ci-dessous. Les notes internes et les dates de relance ne sont jamais affichées sur le site public."
          : "Les inscriptions et consentements sont enregistrés ici. L’envoi des newsletters / le double opt-in nécessitent un service email à configurer. Désactivez ou supprimez une adresse sur demande."}
      </div>
      {error && (
        <p className="admin-notice admin-error" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="admin-notice admin-success" role="status">
          {notice}
        </p>
      )}
      {mode === "requests" && supportsFollowUp === false && (
        <p className="admin-notice">
          Le suivi des demandes (date de relance, notes internes) nécessite la
          migration <code>202610080002_admin_dashboard_analytics.sql</code>. Le
          site public et les statuts continuent de fonctionner sans elle.
        </p>
      )}
      {mode === "requests" ? (
        <>
          <div className="admin-card space-y-5">
            <div className="flex flex-wrap items-end gap-4">
              <div className="min-w-[180px] flex-1">
                <label className="admin-label" htmlFor="request-search">
                  Rechercher
                </label>
                <input
                  id="request-search"
                  className="admin-input"
                  type="search"
                  value={search}
                  placeholder="Nom, email, téléphone, message"
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <div>
                <label className="admin-label" htmlFor="request-status">
                  Statut
                </label>
                <select
                  id="request-status"
                  className="admin-input w-auto"
                  value={filters.status}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      status: event.target.value as ContactFilters["status"],
                    }))
                  }
                >
                  <option value="all">Tous</option>
                  <option value="new">Nouveau</option>
                  <option value="contacted">Contacté</option>
                  <option value="archived">Archivé</option>
                </select>
              </div>
              <div>
                <label className="admin-label" htmlFor="request-service">
                  Service
                </label>
                <select
                  id="request-service"
                  className="admin-input w-auto"
                  value={filters.service}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      service: event.target.value as ContactFilters["service"],
                    }))
                  }
                >
                  <option value="all">Tous</option>
                  <option value="realEstate">Immobilier</option>
                  <option value="businessSetup">Création d’entreprise</option>
                </select>
              </div>
              <div>
                <label className="admin-label" htmlFor="request-reminder">
                  Relance
                </label>
                <select
                  id="request-reminder"
                  className="admin-input w-auto"
                  value={filters.reminder}
                  disabled={supportsFollowUp === false}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      reminder: event.target
                        .value as ContactFilters["reminder"],
                    }))
                  }
                >
                  <option value="all">Toutes</option>
                  <option value="overdue">Échues</option>
                  <option value="upcoming">À venir</option>
                  <option value="none">Sans relance</option>
                </select>
              </div>
              <button
                className="admin-button"
                disabled={!activeFilters}
                onClick={() => {
                  setFilters(emptyContactFilters);
                  setSearch("");
                }}
              >
                <FilterX size={14} />
                Réinitialiser
              </button>
            </div>
            <p className="text-[11px] text-zinc-500">
              {activeFilters
                ? "Filtres appliqués à la liste et à l’export CSV."
                : "Sans filtre : toutes les demandes, les plus récentes d’abord."}
              {filters.reminder === "overdue" && overdueCount
                ? ` · ${overdueCount} relance(s) échue(s) dans cette page.`
                : ""}
            </p>
          </div>
          <div className="space-y-3">
            {requests.map((item) => {
              const overdue = isReminderOverdue(item);
              return (
                <article key={item.id} className="admin-card">
                  <div className="flex flex-col sm:flex-row gap-5 sm:items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold flex flex-wrap items-center gap-3">
                        {item.name}
                        <span
                          className={`text-[10px] rounded px-2 py-1 ${item.status === "new" ? "text-amber-300 bg-amber-300/10" : "text-zinc-400 bg-white/5"}`}
                        >
                          {item.status === "new"
                            ? "Nouveau"
                            : item.status === "contacted"
                              ? "Contacté"
                              : "Archivé"}
                        </span>
                        {item.reminder_at && (
                          <span
                            className={`text-[10px] rounded px-2 py-1 flex items-center gap-1 ${overdue ? "text-red-300 bg-red-400/10" : "text-zinc-400 bg-white/5"}`}
                          >
                            <CalendarClock size={11} />
                            {overdue ? "Relance échue" : "Relance"}{" "}
                            {new Date(item.reminder_at).toLocaleString("fr")}
                          </span>
                        )}
                        {item.notes && (
                          <span
                            className="text-[10px] rounded px-2 py-1 text-zinc-400 bg-white/5 flex items-center gap-1"
                            title="Note interne privée"
                          >
                            <StickyNote size={11} />
                            Note interne
                          </span>
                        )}
                      </p>
                      <div className="text-xs text-zinc-400 flex flex-wrap gap-x-5 gap-y-2 mt-3">
                        <a
                          className="hover:text-amber-300 break-all"
                          href={`mailto:${encodeURIComponent(item.email)}`}
                        >
                          {item.email}
                        </a>
                        <a
                          className="hover:text-amber-300"
                          href={`tel:${item.phone}`}
                        >
                          {item.phone}
                        </a>
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-3">
                        {item.service === "realEstate"
                          ? "Immobilier"
                          : "Création d’entreprise"}{" "}
                        · {new Date(item.created_at).toLocaleString("fr")}
                        {item.updated_at
                          ? ` · suivi ${new Date(item.updated_at).toLocaleString("fr")}`
                          : ""}
                      </p>
                    </div>
                    <div className="flex gap-3 items-center">
                      <label className="sr-only" htmlFor={`status-${item.id}`}>
                        Statut de {item.name}
                      </label>
                      <select
                        id={`status-${item.id}`}
                        className="admin-input w-auto text-xs"
                        value={item.status}
                        disabled={loading || Boolean(busy)}
                        onChange={(event) =>
                          void updateStatus(
                            item.id,
                            event.target.value as ContactStatus,
                          )
                        }
                      >
                        <option value="new">Nouveau</option>
                        <option value="contacted">Contacté</option>
                        <option value="archived">Archivé</option>
                      </select>
                      <button
                        className="p-2 text-zinc-500 hover:text-red-300"
                        disabled={loading || Boolean(busy)}
                        aria-label={`Supprimer la demande de ${item.name}`}
                        onClick={() => void remove(item.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                      <button
                        className="p-2 text-zinc-400"
                        aria-label={`Détails de ${item.name}`}
                        aria-expanded={expanded === item.id}
                        onClick={() =>
                          setExpanded(expanded === item.id ? null : item.id)
                        }
                      >
                        <ChevronDown size={15} />
                      </button>
                    </div>
                  </div>
                  {expanded === item.id && (
                    <div className="mt-6 pt-5 border-t border-white/5 text-xs space-y-4 text-zinc-400">
                      <p>
                        <strong>Services :</strong> {item.options.join(", ")}
                      </p>
                      {Object.entries(item.details)
                        .filter(([, value]) => value)
                        .map(([key, value]) => (
                          <p
                            key={key}
                            className="whitespace-pre-line break-words"
                          >
                            <strong>{key} :</strong> {value}
                          </p>
                        ))}
                      {item.message && (
                        <p className="whitespace-pre-line break-words">
                          <strong>Message :</strong> {item.message}
                        </p>
                      )}
                      <div className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-3">
                          <label
                            className="admin-label"
                            htmlFor={`reminder-${item.id}`}
                          >
                            Date de relance
                          </label>
                          <input
                            id={`reminder-${item.id}`}
                            className="admin-input"
                            type="datetime-local"
                            disabled={supportsFollowUp === false}
                            value={
                              reminderDraft[item.id] ??
                              formatReminder(item.reminder_at)
                            }
                            onChange={(event) =>
                              setReminderDraft((current) => ({
                                ...current,
                                [item.id]: event.target.value,
                              }))
                            }
                          />
                          <div className="flex gap-2">
                            <button
                              className="admin-button"
                              disabled={
                                supportsFollowUp === false || Boolean(busy)
                              }
                              onClick={() =>
                                void saveReminder(
                                  item,
                                  reminderDraft[item.id] ??
                                    formatReminder(item.reminder_at),
                                )
                              }
                            >
                              <CalendarClock size={13} />
                              Planifier la relance
                            </button>
                            {item.reminder_at && (
                              <button
                                className="admin-button"
                                disabled={Boolean(busy)}
                                onClick={() => void saveReminder(item, null)}
                              >
                                Retirer
                              </button>
                            )}
                          </div>
                          <p className="text-[10px] text-zinc-500">
                            Fuseau du navigateur. Une relance échue apparaît sur
                            le tableau de bord.
                          </p>
                        </div>
                        <div className="space-y-3">
                          <label
                            className="admin-label"
                            htmlFor={`notes-${item.id}`}
                          >
                            Notes internes (privées)
                          </label>
                          <textarea
                            id={`notes-${item.id}`}
                            className="admin-input min-h-[96px]"
                            maxLength={4000}
                            disabled={supportsFollowUp === false}
                            value={notesDraft[item.id] ?? item.notes}
                            placeholder="Visible uniquement par les administrateurs."
                            onChange={(event) =>
                              setNotesDraft((current) => ({
                                ...current,
                                [item.id]: event.target.value,
                              }))
                            }
                          />
                          <button
                            className="admin-button"
                            disabled={
                              supportsFollowUp === false || Boolean(busy)
                            }
                            onClick={() => void saveNotes(item)}
                          >
                            <StickyNote size={13} />
                            Enregistrer la note
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </>
      ) : (
        <div className="admin-card overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-zinc-500 text-start border-b border-white/5">
                <th className="text-start py-3">Email</th>
                <th className="text-start py-3">Inscription</th>
                <th className="text-end py-3">Gestion</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((item) => (
                <tr key={item.id} className="border-b border-white/5">
                  <td className="py-4 break-all">
                    <a href={`mailto:${encodeURIComponent(item.email)}`}>
                      {item.email}
                    </a>
                    <p className="text-[10px] text-zinc-500 mt-2">
                      {item.active ? "Actif" : "Désinscrit"}
                    </p>
                  </td>
                  <td className="py-4 text-zinc-500">
                    {new Date(item.created_at).toLocaleDateString("fr")}
                  </td>
                  <td className="py-4">
                    <div className="flex gap-3 justify-end">
                      <button
                        className="text-zinc-400 hover:text-white"
                        disabled={loading || Boolean(busy) || !item.active}
                        title={
                          !item.active
                            ? "Une nouvelle inscription consentie doit passer par le formulaire public."
                            : undefined
                        }
                        onClick={() => void toggleSubscriber(item.id, false)}
                      >
                        {item.active ? "Désinscrire" : "Désinscrit"}
                      </button>
                      <button
                        className="p-2 text-zinc-500 hover:text-red-300"
                        disabled={loading || Boolean(busy)}
                        aria-label={`Supprimer ${item.email}`}
                        onClick={() => void remove(item.id)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {loading && (
        <p className="text-center text-xs text-zinc-500 py-8" role="status">
          Chargement…
        </p>
      )}
      {!loading && !loaded && (
        <div className="admin-card py-16 text-center text-sm text-zinc-500">
          {error
            ? "Chargement impossible."
            : activeFilters
              ? "Aucune demande ne correspond à ces filtres."
              : "Aucune donnée pour le moment."}
        </div>
      )}
      {loaded < count && (
        <button
          className="admin-button"
          disabled={loading || Boolean(busy)}
          onClick={() => void load(loaded)}
        >
          Charger plus ({loaded}/{count})
        </button>
      )}
    </div>
  );
}
