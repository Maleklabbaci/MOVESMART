import { useId, useRef, useState, type HTMLInputTypeAttribute } from "react";
import { Upload, ImageIcon, LoaderCircle } from "lucide-react";
import { uploadImage } from "../../lib/images";
import { adminError } from "../../content/api";
import { SiteImage } from "../SiteImage";
import type { Language, LocalizedText } from "../../content/types";

export function TextField({
  label,
  value,
  onChange,
  multiline = false,
  type = "text",
  hint,
  rows = 4,
  min,
  max,
  step,
  lang,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  type?: HTMLInputTypeAttribute;
  hint?: string;
  rows?: number;
  min?: number;
  max?: number;
  step?: number | "any";
  lang?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="admin-label">
        {label}
      </label>
      {multiline ? (
        <textarea
          lang={lang}
          id={id}
          className="admin-input resize-y"
          rows={rows}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          lang={lang}
          id={id}
          type={type}
          min={min}
          max={max}
          step={step}
          className="admin-input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {hint && (
        <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">{hint}</p>
      )}
    </div>
  );
}
export function LocalField({
  label,
  value,
  language,
  onChange,
  multiline,
  rows,
}: {
  label: string;
  value: LocalizedText;
  language: Language;
  onChange: (value: LocalizedText) => void;
  multiline?: boolean;
  rows?: number;
}) {
  return (
    <TextField
      lang={language}
      label={label}
      value={value[language]}
      onChange={(text) => onChange({ ...value, [language]: text })}
      multiline={multiline}
      rows={rows}
    />
  );
}
export function ImageField({
  label,
  url,
  onChange,
  onUploading,
  folder = "cms",
}: {
  label: string;
  url: string;
  onChange: (url: string) => void;
  onUploading?: (active: boolean) => void;
  folder?: "cms" | "listings";
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function upload(file?: File) {
    if (!file || busy) return;
    setBusy(true);
    setError("");
    onUploading?.(true);
    try {
      onChange(await uploadImage(file, folder));
    } catch (failure) {
      setError(adminError(failure));
    } finally {
      setBusy(false);
      onUploading?.(false);
      if (input.current) input.current.value = "";
    }
  }
  return (
    <div className="space-y-3">
      <span className="admin-label">{label}</span>
      <div className="grid sm:grid-cols-[160px_minmax(0,1fr)] gap-4 items-start">
        <SiteImage
          src={url}
          alt={label}
          className="w-full sm:w-40 h-28 rounded-lg object-cover border border-white/10"
          loading="lazy"
        />
        <div className="space-y-3">
          <TextField
            label="Adresse de l’image"
            value={url}
            onChange={onChange}
            hint="Image http(s) ou chemin /images/… Vous pouvez réutiliser une URL de la médiathèque."
          />
          <button
            type="button"
            className="admin-button"
            onClick={() => input.current?.click()}
            disabled={busy}
          >
            {busy ? (
              <LoaderCircle size={15} className="animate-spin" />
            ) : (
              <Upload size={15} />
            )}
            {busy ? "Téléversement…" : "Importer une image"}
          </button>
          <span className="text-[10px] text-zinc-500 block">
            JPG, PNG, WEBP, AVIF · 5 Mo maximum · fichier public dès l’import
          </span>
        </div>
      </div>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        aria-label={`Importer : ${label}`}
        onChange={(event) => void upload(event.target.files?.[0])}
      />
      {error && (
        <p className="text-xs text-red-300" role="alert">
          <ImageIcon size={13} className="inline me-2" />
          {error}
        </p>
      )}
    </div>
  );
}
