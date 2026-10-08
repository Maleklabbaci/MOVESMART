import { useSiteContent } from "../content/SiteContentProvider";
import { localize, articleForLanguage } from "../content/utils";
import { SiteImage } from "../components/SiteImage";
import { useState } from "react";
import { sharePage } from "../lib/share";
import { useParams } from "react-router-dom";
import { SiteLink as Link } from "../components/SiteLink";
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function BlogPost() {
  const { id } = useParams();
  const [shareResult, setShareResult] = useState("");
  const { t } = useTranslation();
  const { content, language: lang, preview } = useSiteContent();
  const articles = content.articles
    .filter((item) => item.visible || preview)
    .map((item) => articleForLanguage(item, lang));

  const article = articles.find((a) => a.id === id);

  if (!article) {
    return (
      <div
        className="min-h-screen pt-40 pb-20 flex items-center justify-center"
        style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
      >
        <div className="text-center">
          <h1 className="text-4xl font-serif mb-4">404</h1>
          <p className="text-lg mb-8" style={{ color: "var(--text3)" }}>
            {t("blog_article_non_trouve")}
          </p>
          <Link to="/blog" className="btn-gold inline-block">
            {t("blog_retour_au_blog")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-28 pb-20 md:pt-40 md:pb-40 overflow-x-hidden"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* BACK LINK */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 mb-12 hover:text-accent transition-colors"
          style={{ color: "var(--text3)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          {t("blog_retour_au_blog")}
        </Link>

        {/* HERO IMAGE */}
        <div className="aspect-video mb-12 md:mb-16 overflow-hidden rounded-lg shadow-2xl animate-fade-in">
          <SiteImage
            src={article.image}
            alt={article.alt || article.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>

        {/* HEADER */}
        <div
          className="mb-12 md:mb-16 animate-fade-in"
          style={{ animationDelay: "100ms" }}
        >
          <div
            className="flex flex-wrap items-center gap-4 mb-6 text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: "var(--text3)" }}
          >
            <span
              className="px-4 py-2 border"
              style={{ borderColor: "var(--border)" }}
            >
              {article.category}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" /> {article.date}
            </span>
            <span className="flex items-center gap-2">
              <User className="w-4 h-4 text-accent" /> {article.author}
            </span>
          </div>

          <h1
            className="text-4xl md:text-6xl font-serif tracking-tighter leading-[1.1] mb-8"
            style={{ color: "var(--text)" }}
          >
            {article.title}
          </h1>

          <p
            className="text-lg md:text-xl font-light leading-[1.8] max-w-2xl"
            style={{ color: "var(--text3)" }}
          >
            {article.excerpt}
          </p>
        </div>

        {/* CONTENT */}
        <div
          className="prose prose-invert max-w-none mb-12 md:mb-16 animate-fade-in"
          style={{ animationDelay: "200ms" }}
        >
          {article.content.split(/\n\s*\n/).map((paragraph, i) => (
            <p
              key={i}
              className="text-base md:text-lg font-light leading-[1.8] mb-6 md:mb-8"
              style={{ color: "var(--text3)" }}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* SHARE */}
        <div
          className="py-8 md:py-12 border-t border-b mb-12 md:mb-16 flex flex-wrap items-center gap-6 animate-fade-in"
          style={{ borderColor: "var(--border)" }}
        >
          <span
            className="text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: "var(--text3)" }}
          >
            {t("blog_partager")}
          </span>
          <div className="flex gap-4">
            <button
              aria-label={t("share")}
              onClick={() => {
                void sharePage(article.title)
                  .then((result) =>
                    setShareResult(result === "copied" ? t("copied") : ""),
                  )
                  .catch(() => setShareResult(t("share_error")));
              }}
              className="p-3 border hover:border-accent transition-colors"
              style={{ borderColor: "var(--border)" }}
            >
              <Share2 className="w-4 h-4 text-accent" />
            </button>
          </div>
        </div>

        {shareResult && (
          <p role="status" className="text-sm mb-6">
            {shareResult}
          </p>
        )}
        {/* RELATED ARTICLES */}
        <div className="animate-fade-in" style={{ animationDelay: "300ms" }}>
          <h2
            className="text-2xl md:text-4xl font-serif tracking-tight mb-10"
            style={{ color: "var(--text)" }}
          >
            {t("blog_articles_similaires")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles
              .filter((a) => a.id !== article.id)
              .slice(0, 2)
              .map((related) => (
                <Link
                  key={related.id}
                  to={`/blog/${related.id}`}
                  className="group card-border"
                >
                  <div className="aspect-[4/3] overflow-hidden mb-6 bg-black/5">
                    <SiteImage
                      src={related.image}
                      alt={related.alt || related.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                    />
                  </div>
                  <h3
                    className="text-lg font-serif tracking-tight mb-3 line-clamp-2 group-hover:text-accent transition-colors"
                    style={{ color: "var(--text)" }}
                  >
                    {related.title}
                  </h3>
                  <p
                    className="text-sm font-light leading-[1.6] line-clamp-2"
                    style={{ color: "var(--text3)" }}
                  >
                    {related.excerpt}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
