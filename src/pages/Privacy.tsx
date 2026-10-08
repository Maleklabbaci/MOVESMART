import { useTranslation } from "react-i18next";
import { useSiteContent } from "../content/SiteContentProvider";
import { AnalyticsChoice } from "../components/AnalyticsConsent";
export default function Privacy() {
  const { t } = useTranslation();
  const { content } = useSiteContent();
  return (
    <div className="max-w-3xl mx-auto px-6 pt-36 pb-24">
      <span className="tag-gold">{content.settings.brand}</span>
      <h1 className="text-4xl md:text-6xl mb-12">{t("privacy_title")}</h1>
      {t("privacy_content")
        .split(/\n\s*\n/)
        .map((paragraph, index) => (
          <p
            key={index}
            className="mb-6 leading-loose whitespace-pre-line"
            style={{ color: "var(--text3)" }}
          >
            {paragraph}
          </p>
        ))}
      <h2 className="text-3xl md:text-4xl mt-16 mb-8">
        {t("analytics_privacy_title")}
      </h2>
      {t("analytics_privacy_content")
        .split(/\n\s*\n/)
        .map((paragraph, index) => (
          <p
            key={index}
            className="mb-6 leading-loose whitespace-pre-line"
            style={{ color: "var(--text3)" }}
          >
            {paragraph}
          </p>
        ))}
      <AnalyticsChoice />
      <a
        className="text-accent break-all"
        href={`mailto:${encodeURIComponent(content.settings.email)}`}
      >
        {content.settings.email}
      </a>
    </div>
  );
}
