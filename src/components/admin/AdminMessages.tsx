import { useCallback, useEffect, useRef, useState } from "react";
import { Download, RefreshCw, Trash2, ChevronDown } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { adminError } from "../../content/api";
import { downloadCsv } from "../../lib/csv";
import {
  parseContactRecords,
  parseSubscriberRecords,
  type ContactRecord as Contact,
  type SubscriberRecord as Subscriber,
} from "../../lib/adminMessages";
export default function AdminMessages({
  mode,
}: {
  mode: "requests" | "subscribers";
}) {
  const [requests, setRequests] = useState<Contact[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const readVersion = useRef(0);
  const readRequest = useRef<AbortController | null>(null);
  const mutationLock = useRef(false);
  const table =
    mode === "requests" ? "contact_requests" : "newsletter_subscriptions";
  const loaded = mode === "requests" ? requests.length : subscribers.length;
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
        } = await supabase
          .from(table)
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false })
          .order("id", { ascending: false })
          .range(offset, offset + 49)
          .abortSignal(controller.signal);
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
    [table, mode],
  );
  useEffect(() => {
    void load();
    return () => {
      ++readVersion.current;
      readRequest.current?.abort();
      readRequest.current = null;
    };
  }, [load]);
  async function update(
    id: string,
    payload: { status?: Contact["status"]; active?: boolean },
  ) {
    if (mutationLock.current || readRequest.current) return;
    mutationLock.current = true;
    setBusy(id);
    setError("");
    try {
      const { data, error: failure } = await supabase
        .from(table)
        .update(payload)
        .eq("id", id)
        .select("id")
        .single();
      if (failure) throw failure;
      if (data?.id !== id) throw new Error("Modification non confirmée.");
      if (mode === "requests")
        setRequests((current) =>
          current.map((item) =>
            item.id === id ? { ...item, status: payload.status! } : item,
          ),
        );
      else
        setSubscribers((current) =>
          current.map((item) =>
            item.id === id ? { ...item, active: payload.active! } : item,
          ),
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
  function exportRows() {
    downloadCsv(
      `movesmart-${mode}.csv`,
      mode === "requests"
        ? [
            [
              "Nom",
              "Email",
              "Téléphone",
              "Service",
              "Options",
              "Détails",
              "Message",
              "Statut",
              "Consentement déclaré",
              "Date",
            ],
            ...requests.map((item) => [
              item.name,
              item.email,
              item.phone,
              item.service,
              item.options.join("; "),
              JSON.stringify(item.details),
              item.message,
              item.status,
              item.consent_at ?? "",
              item.created_at,
            ]),
          ]
        : [
            ["Email", "Actif", "Consentement", "Date"],
            ...subscribers.map((item) => [
              item.email,
              item.active ? "Oui" : "Non",
              item.consent_at,
              item.created_at,
            ]),
          ],
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {mode === "requests" ? "Demandes clients" : "Newsletter"}
          </h1>
          <p className="text-xs text-zinc-500 mt-2">
            {count} élément(s) · accès réservé aux administrateurs
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
            onClick={exportRows}
            disabled={!loaded}
          >
            <Download size={14} />
            Exporter ({loaded})
          </button>
        </div>
      </div>
      <div className="admin-notice">
        {mode === "requests"
          ? "Ces demandes ont été enregistrées par le formulaire du site. Aucun email automatique n’est envoyé : contactez les clients depuis les coordonnées ci-dessous."
          : "Les inscriptions et consentements sont enregistrés ici. L’envoi des newsletters / le double opt-in nécessitent un service email à configurer. Désactivez ou supprimez une adresse sur demande."}
      </div>
      {error && (
        <p className="admin-notice admin-error" role="alert">
          {error}
        </p>
      )}
      {mode === "requests" ? (
        <div className="space-y-3">
          {requests.map((item) => (
            <article key={item.id} className="admin-card">
              <div className="flex flex-col sm:flex-row gap-5 sm:items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">
                    {item.name}
                    <span
                      className={`ms-3 text-[10px] rounded px-2 py-1 ${item.status === "new" ? "text-amber-300 bg-amber-300/10" : "text-zinc-400 bg-white/5"}`}
                    >
                      {item.status === "new"
                        ? "Nouveau"
                        : item.status === "contacted"
                          ? "Contacté"
                          : "Archivé"}
                    </span>
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
                      void update(item.id, {
                        status: event.target.value as Contact["status"],
                      })
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
                      <p key={key} className="whitespace-pre-line break-words">
                        <strong>{key} :</strong> {value}
                      </p>
                    ))}
                  {item.message && (
                    <p className="whitespace-pre-line break-words">
                      <strong>Message :</strong> {item.message}
                    </p>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
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
                        onClick={() => void update(item.id, { active: false })}
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
          {error ? "Chargement impossible." : "Aucune donnée pour le moment."}
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
