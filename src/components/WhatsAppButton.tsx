import { useEffect, useRef, useState } from "react";
import { Phone, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSiteContent } from "../content/SiteContentProvider";
export default function WhatsAppButton() {
  const { t } = useTranslation();
  const { content } = useSiteContent();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const outside = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("click", outside);
      document.removeEventListener("keydown", escape);
    };
  }, []);
  const url = `https://wa.me/${content.settings.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(t("wa_message"))}`;
  return (
    <div
      ref={ref}
      className="fixed bottom-5 end-5 z-[100] flex flex-col items-end"
    >
      {open && (
        <div
          className="mb-4 p-5 rounded-2xl max-w-[280px] shadow-2xl"
          style={{
            background: "var(--header-bg)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex items-center justify-between gap-4 mb-3">
            <span className="font-serif font-semibold">
              {content.settings.brand}
            </span>
            <button
              aria-label={t("menu_close")}
              onClick={() => setOpen(false)}
              className="p-1"
            >
              <X size={15} />
            </button>
          </div>
          <p className="text-[10px] text-accent mb-4">{t("wa_status")}</p>
          <p
            className="text-xs leading-loose mb-5"
            style={{ color: "var(--text3)" }}
          >
            {t("wa_text")}
          </p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-[#25d366] text-white rounded-lg px-4 py-3 text-center text-xs font-medium"
          >
            {t("wa_button")}
          </a>
        </div>
      )}
      <button
        className="w-14 h-14 rounded-full bg-[#25d366] text-white shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
        aria-label={t("wa_btn")}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={22} /> : <Phone size={22} />}
      </button>
    </div>
  );
}
