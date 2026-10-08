import { useId, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSiteContent } from "../content/SiteContentProvider";
import { localize } from "../content/utils";
export default function FAQ() {
  const { t } = useTranslation();
  const { content, language } = useSiteContent();
  const [open, setOpen] = useState<string | null>(null);
  const id = useId();
  if (!content.faq.length) return null;
  return (
    <section
      className="py-24 md:py-36"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="text-center mb-16 md:mb-24">
          <span className="tag-gold">{t("faq_tag")}</span>
          <h2 className="text-4xl md:text-7xl tracking-tighter leading-tight">
            {t("faq_title")}
            <br />
            <span className="text-accent font-serif-italic">
              {t("faq_accent")}
            </span>
          </h2>
        </div>
        <div>
          {content.faq.map((item) => (
            <div
              key={item.id}
              className="border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <button
                className="w-full py-7 md:py-10 flex items-center gap-5 justify-between text-start"
                aria-expanded={open === item.id}
                aria-controls={`${id}-${item.id}`}
                onClick={() => setOpen(open === item.id ? null : item.id)}
              >
                <span
                  className="text-xl md:text-3xl font-serif"
                  style={{
                    color: open === item.id ? "var(--text)" : "var(--text3)",
                  }}
                >
                  {localize(item.question, language)}
                </span>
                <span
                  className="w-10 h-10 md:w-14 md:h-14 shrink-0 border rounded-full flex items-center justify-center"
                  style={{ borderColor: "var(--border)" }}
                >
                  {open === item.id ? (
                    <Minus className="w-5 h-5 text-accent" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                </span>
              </button>
              <div
                id={`${id}-${item.id}`}
                hidden={open !== item.id}
                className="pb-10"
              >
                <p
                  className="text-base md:text-lg leading-loose whitespace-pre-line"
                  style={{ color: "var(--text3)" }}
                >
                  {localize(item.answer, language)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
