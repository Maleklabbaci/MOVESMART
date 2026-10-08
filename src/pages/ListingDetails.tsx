import { listingSchema, listingTypeKey, type Listing } from "../lib/listings";
import { sharePage } from "../lib/share";
import { useSiteContent } from "../content/SiteContentProvider";
import { SiteImage } from "../components/SiteImage";
import { SiteLink as Link } from "../components/SiteLink";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  Bed,
  Bath,
  Square,
  MapPin,
  Phone,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Share2,
  Mail,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useTranslation } from "react-i18next";

export default function ListingDetails() {
  const { t } = useTranslation();
  const { content, preview } = useSiteContent();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const [reload, setReload] = useState(0);
  const [shareError, setShareError] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    setLoading(true);
    setListing(null);
    setActiveImg(0);
    setError(false);
    async function load() {
      try {
        if (!id) return;
        const { data, error: failure } = await supabase
          .from("listings")
          .select("*")
          .eq("id", id)
          .abortSignal(controller.signal)
          .maybeSingle();
        if (failure && failure.code !== "22P02") throw failure;
        if (data && active) setListing(listingSchema.parse(data));
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
      controller.abort();
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, [id, reload]);

  const handleBack = () =>
    navigate(preview ? "/listings?preview=draft" : "/listings");
  const handleShare = async () => {
    setShareError(false);
    try {
      const result = await sharePage(listing?.title || content.settings.brand);
      if (result === "copied") {
        setCopied(true);
        if (copyTimer.current) clearTimeout(copyTimer.current);
        copyTimer.current = setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      setShareError(true);
    }
  };

  if (loading)
    return (
      <div
        className="min-h-screen pt-40 pb-32 flex items-center justify-center text-sm font-bold tracking-[0.2em] uppercase animate-pulse"
        style={{ backgroundColor: "var(--bg)", color: "var(--text3)" }}
      >
        {t("loading")}
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen pt-40 px-6 text-center">
        <p role="alert" className="text-red-400">
          {t("data_error")}
        </p>
        <button
          className="btn-outline mt-6"
          onClick={() => setReload((value) => value + 1)}
        >
          {t("retry")}
        </button>
      </div>
    );
  if (!listing)
    return (
      <div
        className="min-h-screen pt-40 pb-32 flex flex-col items-center justify-center gap-10"
        style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
      >
        <p
          className="text-sm font-bold uppercase tracking-[0.2em]"
          style={{ color: "var(--text3)" }}
        >
          {t("not_found", "Bien non trouvé.")}
        </p>
        <button onClick={handleBack} className="btn-gold">
          ← {t("back", "Retour")}
        </button>
      </div>
    );

  const images = listing.images || [];

  return (
    <div
      className="min-h-screen pt-40 pb-40 transition-colors duration-400"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="max-w-[1400px] mx-auto px-6">
        {/* ── BACK + SHARE ── */}
        <div
          className="flex items-center justify-between mb-12 pb-8 border-b transition-colors duration-400 animate-fade-in"
          style={{ borderColor: "var(--border)" }}
        >
          <button
            onClick={handleBack}
            className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors hover:text-accent"
            style={{ color: "var(--text3)" }}
          >
            <ArrowLeft className="w-5 h-5" />
            {t("back", "Retour aux opportunités")}
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors hover:text-accent"
            style={{ color: copied ? "var(--text)" : "var(--text3)" }}
          >
            <Share2 className="w-5 h-5" />
            {copied ? t("copied", "Lien copié ✓") : t("share", "Partager")}
          </button>
        </div>

        {shareError && (
          <p role="alert" className="text-sm mb-6">
            {t("share_error")}
          </p>
        )}
        {/* ── IMAGE PRINCIPALE LUXE ── */}
        <div
          className="relative aspect-[16/9] md:aspect-[21/9] bg-black/5 mb-8 overflow-hidden shadow-sm border transition-all duration-400 animate-fade-in delay-100"
          style={{ borderColor: "var(--border)" }}
        >
          {images.length > 0 ? (
            <SiteImage
              src={images[activeImg]}
              alt={listing.title}
              className="w-full h-full object-cover transition-opacity duration-700"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-xs font-bold tracking-[0.2em] uppercase"
              style={{ color: "var(--text3)" }}
            >
              {t("listings_no_img", "Aucune photo disponible")}
            </div>
          )}

          {/* Flèches navigation */}
          {images.length > 1 && (
            <>
              <button
                aria-label={t("gallery_previous")}
                onClick={() =>
                  setActiveImg((p) => (p - 1 + images.length) % images.length)
                }
                className="absolute start-3 md:start-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-16 md:h-16 flex items-center justify-center transition-all duration-300 backdrop-blur-2xl rounded-full shadow-2xl hover:scale-110 hover:bg-black/80"
                style={{
                  backgroundColor: "rgba(0,0,0,0.5)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff",
                }}
              >
                <ChevronLeft className="w-6 h-6 rtl:rotate-180" />
              </button>

              <button
                aria-label={t("gallery_next")}
                onClick={() => setActiveImg((p) => (p + 1) % images.length)}
                className="absolute end-3 md:end-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-16 md:h-16 flex items-center justify-center transition-all duration-300 backdrop-blur-2xl rounded-full shadow-2xl hover:scale-110 hover:bg-black/80"
                style={{
                  backgroundColor: "rgba(0,0,0,0.5)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff",
                }}
              >
                <ChevronRight className="w-6 h-6 rtl:rotate-180" />
              </button>

              {/* Compteur */}
              <div
                className="absolute bottom-3 end-3 md:bottom-8 md:end-8 px-3 md:px-6 py-2 md:py-3 text-[11px] font-bold tracking-[0.2em] uppercase shadow-2xl backdrop-blur-2xl"
                style={{
                  backgroundColor: "rgba(0,0,0,0.6)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff",
                }}
              >
                {activeImg + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {/* ── THUMBNAILS ── */}
        {images.length > 1 && (
          <div className="flex gap-6 overflow-x-auto pb-12 scrollbar-hide animate-fade-in delay-200">
            {images.map((img: string, i: number) => (
              <button
                key={i}
                aria-label={t("gallery_photo", { number: i + 1 })}
                aria-pressed={activeImg === i}
                onClick={() => setActiveImg(i)}
                className="flex-shrink-0 w-32 h-20 overflow-hidden transition-all duration-300 shadow-sm"
                style={{
                  border: `2px solid ${i === activeImg ? "var(--accent)" : "transparent"}`,
                  opacity: i === activeImg ? 1 : 0.4,
                }}
              >
                <SiteImage
                  src={img}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </button>
            ))}
          </div>
        )}

        {/* ── CONTENT ── */}
        <div className="grid lg:grid-cols-3 gap-10 lg:gap-16 mt-10 animate-fade-in delay-300">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2">
            <span className="tag-gold mb-8">
              {t(listingTypeKey(listing.type))}
            </span>
            <h1 className="text-4xl md:text-7xl font-serif tracking-tighter mb-10 leading-[1.05]">
              {listing.title}
            </h1>
            <div
              className="flex items-center gap-4 text-[13px] font-bold uppercase tracking-[0.2em] mb-20"
              style={{ color: "var(--text3)" }}
            >
              <MapPin className="w-6 h-6 text-accent" />
              {listing.location}
            </div>

            {/* Specs */}
            <div
              className="grid grid-cols-3 gap-10 py-16 border-y mb-20 transition-colors duration-400"
              style={{ borderColor: "var(--border)" }}
            >
              {[
                {
                  icon: Bed,
                  value: listing.beds,
                  label: t("beds_label", "Chambres"),
                },
                {
                  icon: Bath,
                  value: listing.baths,
                  label: t("baths_label", "Salles de bain"),
                },
                {
                  icon: Square,
                  value: listing.area?.toLocaleString(),
                  label: t("sqft_label", "Superficie (sqft)"),
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-6 text-center items-center"
                >
                  <div
                    className="w-16 h-16 flex items-center justify-center border rounded-full"
                    style={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <s.icon className="w-8 h-8 text-accent" strokeWidth={1.5} />
                  </div>
                  <div className="text-5xl font-serif tracking-tighter">
                    {s.value}
                  </div>
                  <div
                    className="text-[10px] font-bold uppercase tracking-[0.2em]"
                    style={{ color: "var(--text3)" }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="prose max-w-none">
              <h2
                className="text-[11px] font-bold uppercase tracking-[0.2em] mb-10 border-b pb-6 inline-block"
                style={{ color: "var(--text)", borderColor: "var(--text)" }}
              >
                {t("desc_label", "Description du projet")}
              </h2>
              <p
                className="font-light leading-[2.2] text-[17px] md:text-[19px] whitespace-pre-line"
                style={{ color: "var(--text3)" }}
              >
                {listing.description || t("property_description_fallback")}
              </p>
            </div>
          </div>

          {/* RIGHT — STICKY PRICE CARD LUXE */}
          <div className="lg:col-span-1">
            <div
              className="sticky top-32 p-6 md:p-8 border shadow-2xl transition-all duration-400"
              style={{
                backgroundColor: "var(--header-bg)",
                borderColor: "var(--border)",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Prix */}
              <div
                className="mb-12 pb-12 border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <span
                  className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-6"
                  style={{ color: "var(--text3)" }}
                >
                  {t("price_label", "Prix d'investissement")}
                </span>
                <div
                  className="text-3xl md:text-4xl break-words font-serif tracking-tighter mb-4"
                  style={{ color: "var(--text)" }}
                >
                  AED {listing.price?.toLocaleString()}
                </div>
                <div
                  className="text-[13px] font-bold tracking-[0.2em] uppercase"
                  style={{ color: "var(--text3)" }}
                >
                  ≈ {Math.round((listing.price || 0) / 3.67).toLocaleString()}{" "}
                  USD
                </div>
              </div>

              {/* CTA buttons */}
              <div className="space-y-6">
                <Link
                  to="/contact"
                  className="btn-gold w-full flex items-center justify-center gap-4"
                >
                  <Mail className="w-5 h-5" />
                  {t("msg_btn", "Être contacté")}
                </Link>

                <a
                  href={`https://wa.me/${content.settings.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(t("property_interest", { title: listing.title, url: window.location.href.replace(/[?&]preview=draft/, "") }))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline w-full flex items-center justify-center gap-4"
                >
                  <Phone className="w-5 h-5" />
                  {t("wa_btn", "WhatsApp Rapide")}
                </a>
              </div>

              <div
                className="mt-12 pt-10 border-t flex flex-col gap-4 text-center"
                style={{ borderColor: "var(--border)" }}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                  {content.settings.name}
                </p>
                <p
                  className="text-[11px] font-bold tracking-[0.2em] uppercase leading-[1.8]"
                  style={{ color: "var(--text3)" }}
                >
                  {t(
                    "team_note",
                    "Analyse du ROI et accompagnement juridique inclus.",
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
