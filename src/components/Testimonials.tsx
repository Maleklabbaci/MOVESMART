import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSiteContent } from "../content/SiteContentProvider";
import { localize } from "../content/utils";
import { SiteImage } from "./SiteImage";
export default function Testimonials() {
  const { t } = useTranslation();
  const { content, language } = useSiteContent();
  if (!content.testimonials.length) return null;
  return (
    <section className="py-24">
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="font-serif text-4xl text-center mb-12">
          {t("home_testimonials_title")}{" "}
          <span className="text-accent">{t("home_testimonials_accent")}</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {content.testimonials.map((item) => (
            <div key={item.id} className="card-border p-8">
              <div
                className="flex gap-1 text-accent mb-5"
                aria-label={`${item.rating}/5`}
              >
                {Array.from({ length: item.rating }, (_, index) => (
                  <Star size={14} className="fill-current" key={index} />
                ))}
              </div>
              <p className="leading-loose italic mb-6">
                {localize(item.text, language)}
              </p>
              <div className="flex gap-4 items-center">
                {item.image && (
                  <SiteImage
                    src={item.image}
                    alt={localize(item.name, language)}
                    className="w-12 h-12 rounded-full object-cover"
                    loading="lazy"
                  />
                )}
                <div>
                  <p className="text-sm font-medium">
                    {localize(item.name, language)}
                  </p>
                  <p className="text-xs mt-2" style={{ color: "var(--text3)" }}>
                    {localize(item.role, language)} ·{" "}
                    {localize(item.location, language)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
