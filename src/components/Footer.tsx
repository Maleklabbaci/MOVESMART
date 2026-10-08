import { useTranslation } from "react-i18next";
import { useSiteContent } from "../content/SiteContentProvider";
import { SiteLink } from "./SiteLink";
export default function Footer() {
  const { t } = useTranslation();
  const { content } = useSiteContent();
  const { settings } = content;
  return (
    <footer
      className="border-t py-12"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row gap-8 md:items-center justify-between">
        <div>
          <SiteLink to="/" className="font-serif text-2xl">
            {settings.brand}
          </SiteLink>
          <p className="text-sm mt-3" style={{ color: "var(--text3)" }}>
            {t("footer_tagline")}
          </p>
        </div>
        <div className="flex flex-wrap gap-5 text-xs">
          {Object.entries(settings.social)
            .filter(([, url]) => url)
            .map(([name, url]) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="capitalize hover:text-accent"
              >
                {name}
              </a>
            ))}
          <SiteLink to="/privacy" className="hover:text-accent">
            {t("privacy_link")}
          </SiteLink>
        </div>
      </div>
      <p
        className="max-w-[1400px] mx-auto px-6 mt-10 text-[11px]"
        style={{ color: "var(--text3)" }}
      >
        © {new Date().getFullYear()} {settings.name}. {t("footer_rights")}
      </p>
    </footer>
  );
}
