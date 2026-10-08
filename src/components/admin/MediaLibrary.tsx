import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, Copy, RefreshCw } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { uploadImage } from "../../lib/images";
import { adminError } from "../../content/api";
import { SiteImage } from "../SiteImage";
interface Media {
  name: string;
  url: string;
  size: number;
}
export default function MediaLibrary() {
  const [images, setImages] = useState<Media[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const load = useCallback(async (offset = 0) => {
    setLoading(true);
    setError("");
    try {
      const { data, error: failure } = await supabase.storage
        .from("photos")
        .list("cms", {
          limit: 50,
          offset,
          sortBy: { column: "created_at", order: "desc" },
        });
      if (failure) throw failure;
      const rows = (data || [])
        .filter((item) => item.id)
        .map((item) => ({
          name: item.name,
          url: supabase.storage.from("photos").getPublicUrl("cms/" + item.name)
            .data.publicUrl,
          size: item.metadata?.size || 0,
        }));
      setImages((current) => (offset ? [...current, ...rows] : rows));
      setHasMore(data?.length === 50);
    } catch (failure) {
      setError(adminError(failure));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  async function upload(files: File[]) {
    if (uploading || !files.length) return;
    setUploading(true);
    setError("");
    const failures: string[] = [];
    let success = 0;
    for (const file of files.slice(0, 20)) {
      try {
        await uploadImage(file);
        success++;
      } catch (failure) {
        failures.push(`${file.name} : ${adminError(failure)}`);
      }
    }
    await load();
    if (failures.length) setError(failures.join(" · "));
    if (success)
      setMessage(
        `${success} image(s) importée(s). Copiez leur URL pour les utiliser dans une page.`,
      );
    setUploading(false);
    if (input.current) input.current.value = "";
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Médiathèque</h1>
          <p className="text-xs text-zinc-500 mt-2">
            Images des pages du site · les galeries des biens se gèrent dans les
            annonces
          </p>
        </div>
        <div className="flex gap-2 self-start">
          <button
            className="admin-button"
            disabled={loading || uploading}
            onClick={() => void load()}
          >
            <RefreshCw size={14} />
            Actualiser
          </button>
          <button
            className="admin-button admin-button-primary"
            disabled={uploading}
            onClick={() => input.current?.click()}
          >
            <Upload size={14} />
            {uploading ? "Importation…" : "Importer des images"}
          </button>
        </div>
      </div>
      <div className="admin-notice">
        JPG, PNG, WEBP, AVIF · 5 Mo maximum par image · 20 images par import.
        Ces fichiers sont publics dès l’import : aucun document confidentiel.
        Retirer une image d’une page ne supprime pas le fichier partagé : cela
        évite de casser d’autres pages qui l’utilisent.
      </div>
      <input
        ref={input}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        aria-label="Importer des images dans la médiathèque"
        onChange={(event) => void upload(Array.from(event.target.files || []))}
      />
      {error && (
        <div className="admin-notice admin-error" role="alert">
          {error}
        </div>
      )}
      {message && (
        <div className="admin-notice admin-success" role="status">
          {message}
        </div>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {images.map((image) => (
          <article key={image.name} className="admin-card p-3">
            <SiteImage
              src={image.url}
              alt="Image de la médiathèque"
              className="aspect-[4/3] w-full object-cover rounded-lg"
              loading="lazy"
            />
            <p className="text-[10px] text-zinc-500 my-3">
              {Math.round(image.size / 1024)} Ko
            </p>
            <button
              className="admin-button w-full"
              onClick={() => {
                void navigator.clipboard
                  .writeText(image.url)
                  .then(() =>
                    setMessage(
                      "URL copiée. Collez-la dans le champ image d’une page.",
                    ),
                  )
                  .catch(() =>
                    setError(
                      "La copie est indisponible. Ouvrez l’image et copiez son adresse.",
                    ),
                  );
              }}
            >
              <Copy size={13} />
              Copier l’URL
            </button>
            <a
              className="text-[10px] text-zinc-500 hover:text-white block mt-3 text-center"
              href={image.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ouvrir l’image
            </a>
          </article>
        ))}
      </div>
      {loading && (
        <p className="text-xs text-zinc-500 text-center py-8" role="status">
          Chargement des images…
        </p>
      )}
      {!loading && !images.length && (
        <div className="admin-card text-sm text-center text-zinc-500 py-16">
          {error
            ? "Chargement impossible."
            : "Vos nouvelles images apparaîtront ici. Les images externes existantes restent disponibles dans les pages."}
        </div>
      )}
      {hasMore && (
        <button
          className="admin-button"
          disabled={loading}
          onClick={() => void load(images.length)}
        >
          Charger plus d’images
        </button>
      )}
    </div>
  );
}
