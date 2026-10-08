import NewsletterForm from "../components/NewsletterForm";
import { useSiteContent } from "../content/SiteContentProvider";
import { localize, articleForLanguage } from "../content/utils";
import { SiteImage } from "../components/SiteImage";
import { SiteLink as Link } from "../components/SiteLink";
import { Calendar, User, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Blog() {
  const { t } = useTranslation();
  const { content, language: lang, preview } = useSiteContent();
  const articles = content.articles
    .filter((item) => item.visible || preview)
    .map((item) => articleForLanguage(item, lang));

  return (
    <div
      className="min-h-screen pt-28 pb-20 md:pt-40 md:pb-40 overflow-x-hidden"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        {/* HEADER */}
        <div className="text-center mb-16 md:mb-24 animate-fade-in">
          <span className="tag-gold mb-10">{t("blog_tag")}</span>
          <h1 className="text-4xl md:text-[90px] font-serif tracking-tighter leading-[1.05] mb-8 md:mb-12">
            {t("blog_analyses")} <br />
            <span className="font-serif-italic text-accent">
              {t("blog_immobilieres")}
            </span>
          </h1>
          <p
            className="max-w-2xl mx-auto text-lg md:text-xl font-light leading-[1.8]"
            style={{ color: "var(--text3)" }}
          >
            {t("blog_conseils_d_experts_analyses_de_marche_et_guides_")}
          </p>
        </div>

        {articles.length === 0 && (
          <p className="text-center py-16">{t("blog_empty")}</p>
        )}
        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {articles.map((article, i) => (
            <Link
              key={article.id}
              to={`/blog/${article.id}`}
              className="group flex flex-col card-border animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-black/5">
                <SiteImage
                  src={article.image}
                  alt={article.alt || article.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                />
                <div
                  className="absolute top-5 left-5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg backdrop-blur-md"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.6)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {article.category}
                </div>
              </div>

              <div className="p-8 md:p-10 flex-1 flex flex-col">
                <div
                  className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em] mb-6 gap-4 flex-wrap"
                  style={{ color: "var(--text3)" }}
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-accent" /> {article.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-accent" /> {article.author}
                  </span>
                </div>

                <h3
                  className="text-xl md:text-2xl font-serif tracking-tight mb-4 line-clamp-2 transition-colors flex-1 group-hover:text-accent"
                  style={{ color: "var(--text)" }}
                >
                  {article.title}
                </h3>

                <p
                  className="text-[15px] font-light leading-[1.8] mb-8 line-clamp-3"
                  style={{ color: "var(--text3)" }}
                >
                  {article.excerpt}
                </p>

                <div
                  className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform w-fit"
                  style={{ color: "var(--accent)" }}
                >
                  {t("blog_lire_la_suite")}{" "}
                  <ArrowRight className="w-4 h-4 ml-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* NEWSLETTER CTA */}
        <div
          className="mt-20 md:mt-32 px-6 py-12 md:p-24 text-center border shadow-2xl animate-fade-in delay-200"
          style={{
            backgroundColor: "var(--header-bg)",
            borderColor: "var(--border)",
          }}
        >
          <span className="tag-gold mb-8">{t("blog_restez_informe")}</span>
          <h3
            className="text-3xl md:text-6xl font-serif tracking-tighter mb-6 md:mb-8"
            style={{ color: "var(--text)" }}
          >
            {t("blog_abonnez_vous_a_notre_newsletter")}
          </h3>
          <p
            className="mb-10 md:mb-14 max-w-2xl mx-auto text-lg md:text-xl font-light leading-[1.8]"
            style={{ color: "var(--text3)" }}
          >
            {t("blog_recevez_les_dernieres_analyses_immobilieres_de_d")}
          </p>
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
}
