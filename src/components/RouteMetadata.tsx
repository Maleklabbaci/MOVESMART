import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSiteContent } from "../content/SiteContentProvider";
import { localize } from "../content/utils";
export default function RouteMetadata() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { content, language, preview } = useSiteContent();
  useEffect(() => {
    const page = pathname.split("/")[1] || "home";
    const article =
      page === "blog"
        ? content.articles.find(
            (item) =>
              item.id === pathname.split("/")[2] && (item.visible || preview),
          )
        : undefined;
    const title = article
      ? localize(article.title, language)
      : page === "admin"
        ? "Administration"
        : t("seo_" + page + "_title", t("not_found_title"));
    const description = article
      ? localize(article.excerpt, language)
      : t("seo_" + page + "_description", "");
    document.title = `${title} — ${content.settings.brand}`;
    const setMeta = (name: string, value: string, property = false) => {
      const attribute = property ? "property" : "name";
      let element = document.querySelector<HTMLMetaElement>(
        `meta[${attribute}="${name}"]`,
      );
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.content = value;
    };
    setMeta("description", description);
    setMeta("og:title", document.title, true);
    setMeta("og:description", description, true);
    setMeta("og:image", article?.image || content.images.homeHero.url, true);
    setMeta(
      "robots",
      page === "admin" ||
        preview ||
        new URLSearchParams(window.location.search).has("preview")
        ? "noindex,nofollow"
        : "index,follow",
    );
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (favicon) favicon.href = content.images.logo.url;
  }, [pathname, content, language, preview, t]);
  return null;
}
