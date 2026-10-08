import { useCallback, useEffect, useRef, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Upload,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Search,
  LoaderCircle,
} from "lucide-react";
import { z } from "zod";
import { supabase } from "../../lib/supabase";
import { uploadImage } from "../../lib/images";
import {
  listingPayloadSchema,
  listingSchema,
  listingTypes,
  listingTypeKey,
  parseListings,
  type Listing,
} from "../../lib/listings";
import { adminError } from "../../content/api";
import { moveItem } from "../../content/utils";
import { SiteImage } from "../SiteImage";
import { TextField } from "./EditorFields";
import { useSiteContent } from "../../content/SiteContentProvider";
import { useModalDialog } from "./useModalDialog";

const empty = {
  title: "",
  type: "Apartment" as Listing["type"],
  location: "",
  price: "",
  beds: "0",
  baths: "0",
  area: "",
  description: "",
};
export default function AdminListings({
  onUnsavedChange,
  active = true,
}: {
  onUnsavedChange?: (value: boolean) => void;
  active?: boolean;
}) {
  const { content } = useSiteContent();
  const typeLabel = (type: Listing["type"]) =>
    content.translations.fr[listingTypeKey(type)] || type;
  const [listings, setListings] = useState<Listing[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(empty);
  const [images, setImages] = useState<string[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const file = useRef<HTMLInputElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const lock = useRef(false);
  const baseline = useRef("");
  const load = useCallback(async (offset = 0) => {
    setLoading(true);
    setError("");
    try {
      const {
        data,
        error: failure,
        count: total,
      } = await supabase
        .from("listings")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + 49);
      if (failure) throw failure;
      const rows = parseListings(data || []);
      setListings((current) => (offset ? [...current, ...rows] : rows));
      setCount(total ?? rows.length);
    } catch (failure) {
      setError(adminError(failure));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  const dirty = open && JSON.stringify({ form, images }) !== baseline.current;
  useEffect(() => {
    onUnsavedChange?.(dirty || saving || uploading);
    return () => onUnsavedChange?.(false);
  }, [dirty, saving, uploading, onUnsavedChange]);
  function closeForm() {
    if (lock.current || uploading) return;
    if (dirty && !window.confirm("Abandonner les modifications de ce bien ?"))
      return;
    setOpen(false);
  }
  useModalDialog(open && active, dialog, closeForm);
  function openForm(listing?: Listing) {
    if (lock.current || uploading) return;
    const nextForm = listing
      ? {
          title: listing.title,
          type: listing.type,
          location: listing.location,
          price: String(listing.price),
          beds: String(listing.beds),
          baths: String(listing.baths),
          area: String(listing.area),
          description: listing.description,
        }
      : empty;
    const nextImages = listing?.images || [];
    baseline.current = JSON.stringify({ form: nextForm, images: nextImages });
    setForm(nextForm);
    setImages(nextImages);
    setEditing(listing?.id || null);
    setFormError("");
    setOpen(true);
  }
  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (lock.current || uploading) return;
    lock.current = true;
    setSaving(true);
    setFormError("");
    try {
      const payload = listingPayloadSchema.parse({ ...form, images });
      const request = editing
        ? supabase.from("listings").update(payload).eq("id", editing)
        : supabase.from("listings").insert(payload);
      const { data, error: failure } = await request.select("*").single();
      if (failure) throw failure;
      const saved = listingSchema.parse(data);
      setListings((current) =>
        editing
          ? current.map((item) => (item.id === editing ? saved : item))
          : [saved, ...current],
      );
      if (!editing) setCount((current) => current + 1);
      setMessage(editing ? "Bien modifié." : "Bien ajouté.");
      setOpen(false);
    } catch (failure) {
      setFormError(
        failure instanceof z.ZodError
          ? "Vérifiez le titre, la localisation, les nombres (positifs) et les images. Les chambres/salles de bain doivent être des entiers."
          : adminError(failure),
      );
    } finally {
      lock.current = false;
      setSaving(false);
    }
  }
  async function remove(id: string) {
    if (lock.current || !window.confirm("Supprimer définitivement ce bien ?"))
      return;
    lock.current = true;
    setDeleting(id);
    setError("");
    try {
      const { data, error: failure } = await supabase
        .from("listings")
        .delete()
        .eq("id", id)
        .select("id");
      if (failure) throw failure;
      if (data?.length !== 1)
        throw new Error(
          "Suppression non confirmée. Le bien existe peut-être encore ou vos droits ont changé.",
        );
      setListings((current) => current.filter((item) => item.id !== id));
      setCount((current) => Math.max(0, current - 1));
      setMessage("Bien supprimé.");
    } catch (failure) {
      setError(adminError(failure));
    } finally {
      lock.current = false;
      setDeleting(null);
    }
  }
  async function upload(files: File[]) {
    if (!files.length || uploading) return;
    setUploading(true);
    setFormError("");
    const uploaded: string[] = [];
    const failures: string[] = [];
    for (const image of files.slice(0, Math.max(0, 30 - images.length))) {
      try {
        uploaded.push(await uploadImage(image, "listings"));
      } catch (failure) {
        failures.push(`${image.name} : ${adminError(failure)}`);
      }
    }
    setImages((current) => [...current, ...uploaded]);
    if (failures.length) setFormError(failures.join(" · "));
    setUploading(false);
    if (file.current) file.current.value = "";
  }
  const visible = listings.filter((item) =>
    `${item.title} ${item.location}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Biens immobiliers</h1>
          <p className="text-xs text-zinc-500 mt-2">
            {count} bien(s) · modifications visibles immédiatement
          </p>
        </div>
        <button
          className="admin-button admin-button-primary self-start"
          onClick={() => openForm()}
        >
          <Plus size={16} />
          Ajouter un bien
        </button>
      </div>
      {error && (
        <div className="admin-notice admin-error" role="alert">
          {error}
          <button className="ms-3 underline" onClick={() => void load()}>
            Réessayer
          </button>
        </div>
      )}
      {message && (
        <p className="admin-notice admin-success" role="status">
          {message}
        </p>
      )}
      <div className="relative max-w-lg">
        <Search size={15} className="absolute start-3 top-3.5 text-zinc-500" />
        <input
          className="admin-input ps-10"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Rechercher un bien"
          placeholder="Rechercher parmi les biens chargés…"
        />
      </div>
      <div className="admin-card p-0 overflow-x-auto">
        <table className="w-full text-sm min-w-[650px]">
          <thead className="text-[10px] uppercase tracking-wider text-zinc-500 border-b border-white/5">
            <tr>
              <th className="px-5 py-4 text-start">Bien</th>
              <th className="px-5 py-4 text-start">Type</th>
              <th className="px-5 py-4 text-start">Prix (AED)</th>
              <th className="px-5 py-4 text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((listing) => (
              <tr
                key={listing.id}
                className="border-b border-white/5 last:border-0"
              >
                <td className="px-5 py-5">
                  <div className="flex gap-4 items-center">
                    <SiteImage
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-14 h-14 object-cover rounded-lg shrink-0"
                      loading="lazy"
                    />
                    <div>
                      <p className="font-medium">{listing.title}</p>
                      <p className="text-xs text-zinc-500 mt-2">
                        {listing.location}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 text-xs text-zinc-400">
                  {typeLabel(listing.type)}
                </td>
                <td className="px-5 tabular-nums text-xs">
                  {listing.price.toLocaleString("fr")}
                </td>
                <td className="px-5">
                  <div className="flex justify-end gap-2">
                    <a
                      className="p-2 text-zinc-500 hover:text-white"
                      href={`/listings/${listing.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Voir ${listing.title}`}
                    >
                      <ExternalLink size={15} />
                    </a>
                    <button
                      className="p-2 text-zinc-500 hover:text-amber-300"
                      onClick={() => openForm(listing)}
                      aria-label={`Modifier ${listing.title}`}
                      disabled={Boolean(deleting)}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      className="p-2 text-zinc-500 hover:text-red-300"
                      onClick={() => void remove(listing.id)}
                      aria-label={`Supprimer ${listing.title}`}
                      disabled={Boolean(deleting)}
                    >
                      {deleting === listing.id ? (
                        <LoaderCircle className="animate-spin" size={15} />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && (
          <p role="status" className="py-12 text-center text-xs text-zinc-500">
            Chargement…
          </p>
        )}
        {!loading && !visible.length && (
          <div className="py-16 px-6 text-center text-zinc-500 text-sm">
            {error
              ? "Les données n’ont pas pu être chargées."
              : "Aucun bien pour le moment."}
          </div>
        )}
      </div>
      {listings.length < count && (
        <button
          className="admin-button"
          disabled={loading}
          onClick={() => void load(listings.length)}
        >
          Charger plus de biens ({listings.length}/{count})
        </button>
      )}
      {open && active && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-3 sm:p-6">
          <div
            ref={dialog}
            tabIndex={-1}
            className="admin-card w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label={editing ? "Modifier un bien" : "Ajouter un bien"}
          >
            <div className="flex justify-between gap-4 items-center mb-6">
              <h2 className="text-lg font-semibold">
                {editing ? "Modifier un bien" : "Ajouter un bien"}
              </h2>
              <button
                className="p-2 text-zinc-500"
                aria-label="Fermer le formulaire"
                disabled={saving || uploading}
                onClick={closeForm}
              >
                <X size={18} />
              </button>
            </div>
            {formError && (
              <div className="admin-notice admin-error mb-5" role="alert">
                {formError}
              </div>
            )}
            <form onSubmit={(event) => void save(event)}>
              <fieldset disabled={saving || uploading} className="space-y-5">
                <TextField
                  label="Titre"
                  value={form.title}
                  onChange={(title) =>
                    setForm((current) => ({ ...current, title }))
                  }
                />
                <div className="grid sm:grid-cols-2 gap-5">
                  <label className="admin-label">
                    Type
                    <select
                      className="admin-input mt-2"
                      value={form.type}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          type: event.target.value as Listing["type"],
                        }))
                      }
                    >
                      {listingTypes.map((type) => (
                        <option key={type} value={type}>
                          {typeLabel(type)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <TextField
                    label="Localisation"
                    value={form.location}
                    onChange={(location) =>
                      setForm((current) => ({ ...current, location }))
                    }
                  />
                  <TextField
                    label="Prix (AED)"
                    type="number"
                    min={0}
                    max={1_000_000_000}
                    step="any"
                    value={form.price}
                    onChange={(price) =>
                      setForm((current) => ({ ...current, price }))
                    }
                  />
                  <TextField
                    label="Surface (sqft)"
                    type="number"
                    min={0}
                    max={10_000_000}
                    step="any"
                    value={form.area}
                    onChange={(area) =>
                      setForm((current) => ({ ...current, area }))
                    }
                  />
                  <TextField
                    label="Chambres"
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={form.beds}
                    onChange={(beds) =>
                      setForm((current) => ({ ...current, beds }))
                    }
                  />
                  <TextField
                    label="Salles de bain"
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={form.baths}
                    onChange={(baths) =>
                      setForm((current) => ({ ...current, baths }))
                    }
                  />
                </div>
                <TextField
                  label="Description"
                  value={form.description}
                  multiline
                  onChange={(description) =>
                    setForm((current) => ({ ...current, description }))
                  }
                />
                <div>
                  <span className="admin-label">
                    Photos · la première est la couverture
                  </span>
                  <button
                    type="button"
                    className="admin-button"
                    disabled={images.length >= 30}
                    onClick={() => file.current?.click()}
                  >
                    <Upload size={15} />
                    Importer des photos
                  </button>
                  <p className="text-[11px] text-zinc-500 mt-2">
                    JPG, PNG, WEBP, AVIF · 5 Mo / image · 30 photos maximum
                  </p>
                  <input
                    ref={file}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    multiple
                    className="hidden"
                    aria-label="Importer les photos du bien"
                    onChange={(event) =>
                      void upload(Array.from(event.target.files || []))
                    }
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    {images.map((url, index) => (
                      <div
                        key={url + index}
                        className="rounded-lg overflow-hidden border border-white/10"
                      >
                        <SiteImage
                          src={url}
                          alt={`Photo ${index + 1}`}
                          className="aspect-square w-full object-cover"
                        />
                        <div className="flex items-center justify-center gap-1 bg-black/30 p-1">
                          <button
                            type="button"
                            className="p-2 text-zinc-400 disabled:opacity-20"
                            disabled={index === 0}
                            aria-label="Avancer la photo"
                            onClick={() =>
                              setImages(moveItem(images, index, index - 1))
                            }
                          >
                            <ArrowLeft size={12} />
                          </button>
                          <button
                            type="button"
                            className="p-2 text-zinc-400 disabled:opacity-20"
                            disabled={index === images.length - 1}
                            aria-label="Reculer la photo"
                            onClick={() =>
                              setImages(moveItem(images, index, index + 1))
                            }
                          >
                            <ArrowRight size={12} />
                          </button>
                          <button
                            type="button"
                            className="p-2 text-zinc-400 hover:text-red-300"
                            aria-label="Retirer la photo du bien"
                            onClick={() =>
                              setImages(
                                images.filter(
                                  (_, position) => position !== index,
                                ),
                              )
                            }
                          >
                            <X size={12} />
                          </button>
                        </div>
                        {index === 0 && (
                          <p className="text-[9px] text-center py-1 text-[#d4af37]">
                            COUVERTURE
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </fieldset>
              <div className="flex justify-end gap-3 mt-7 pt-5 border-t border-white/5">
                <button
                  type="button"
                  className="admin-button"
                  disabled={saving || uploading}
                  onClick={closeForm}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="admin-button admin-button-primary"
                  disabled={saving || uploading}
                >
                  {saving || uploading ? (
                    <LoaderCircle size={15} className="animate-spin" />
                  ) : (
                    <Save size={15} />
                  )}
                  {uploading
                    ? "Images en cours…"
                    : saving
                      ? "Enregistrement…"
                      : "Enregistrer le bien"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
