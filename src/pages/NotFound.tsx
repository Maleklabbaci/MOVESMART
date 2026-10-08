import { useTranslation } from "react-i18next";
import { SiteLink } from "../components/SiteLink";
export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-[80vh] pt-40 pb-24 px-6 flex flex-col items-center justify-center text-center gap-6">
      <span className="tag-gold">404</span>
      <h1 className="text-4xl md:text-6xl">{t("not_found_title")}</h1>
      <p style={{ color: "var(--text3)" }}>{t("not_found_text")}</p>
      <SiteLink to="/" className="btn-gold mt-4">
        {t("back_home")}
      </SiteLink>
    </div>
  );
}
