import React, { type ReactNode } from "react";
import { useSiteContent } from "../content/SiteContentProvider";
import { localize } from "../content/utils";
import type { HomeSectionId } from "../content/types";
import { SiteImage } from "../components/SiteImage";
import { SiteLink as Link } from "../components/SiteLink";
import {
  Building2,
  Briefcase,
  Globe,
  TrendingUp,
  Shield,
  Users,
  ArrowRight,
  Phone,
  Star,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import FAQ from "../components/FAQ";

export default function Home() {
  const { t } = useTranslation();

  const { content, language: lang } = useSiteContent();
  const currentTestimonials = content.testimonials.map((item) => ({
    ...item,
    name: localize(item.name, lang),
    role: localize(item.role, lang),
    location: localize(item.location, lang),
    text: localize(item.text, lang),
  }));

  const sections: Record<HomeSectionId, ReactNode> = {
    hero: (
      <section className="relative h-[95vh] min-h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <SiteImage
            src={content.images.homeHero.url}
            alt={localize(content.images.homeHero.alt, lang)}
            fetchPriority="high"
            className="w-full h-full object-cover scale-105 transition-transform duration-[20s] ease-out hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/75"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto mt-20">
          <span className="inline-block px-6 py-3 border border-accent/30 text-accent text-[11px] font-bold uppercase tracking-[0.25em] mb-10 animate-fade-in backdrop-blur-sm bg-accent/5">
            {t("home_votre_partenaire_a_dubai")}
          </span>

          <h1 className="text-5xl md:text-[95px] mb-8 tracking-tighter leading-[0.95] text-white drop-shadow-2xl animate-fade-in delay-100 font-serif">
            {
              <>
                {t("home_hero_title")}
                <br />
                {t("home_hero_connector")}{" "}
                <span className="font-serif-italic text-accent">
                  {t("home_hero_accent")}
                </span>
              </>
            }
          </h1>

          <p className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto font-light leading-relaxed text-gray-200 animate-fade-in delay-200">
            {t("home_immobilier_premium_creation_d_entreprise_residen")}
          </p>

          <p className="text-base md:text-lg mb-12 max-w-2xl mx-auto font-light text-gray-400 animate-fade-in delay-300">
            {t("home_accompagnement_francophone_international_experti")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in delay-400">
            <Link
              to="/listings"
              className="btn-gold w-full sm:w-auto shadow-2xl"
            >
              {t("home_explorer_les_opportunites")}
            </Link>
            <Link
              to="/contact"
              className="btn-outline hero-outline w-full sm:w-auto"
            >
              {t("home_consultation_gratuite")}
            </Link>
          </div>
        </div>
      </section>
    ),
    stats: (
      <section
        className="border-b"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { v: t("home_stat_1_value"), l: t("home_clients_accompagnes") },
            { v: t("home_stat_2_value"), l: t("home_rendement_locatif_net") },
            { v: t("home_stat_3_value"), l: t("home_stat_3_label") },
            { v: t("home_stat_4_value"), l: t("home_stat_4_label") },
          ].map((s, i) => (
            <div
              key={i}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <p
                className="text-4xl md:text-6xl font-serif tracking-tighter mb-4"
                style={{ color: "var(--text)" }}
              >
                {s.v}
              </p>
              <p
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "var(--text3)" }}
              >
                {s.l}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
    services: (
      <section
        className="py-20 md:py-32"
        style={{ backgroundColor: "var(--bg)" }}
      >
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-20 animate-fade-in">
            <span className="tag-gold mb-6">{t("home_nos_services")}</span>
            <h2
              className="text-5xl md:text-7xl tracking-tighter mb-6"
              style={{ color: "var(--text)" }}
            >
              {
                <>
                  {t("home_services_title")}{" "}
                  <span className="font-serif-italic text-accent">
                    {t("home_services_accent")}
                  </span>
                </>
              }
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{ color: "var(--text3)" }}
            >
              {t("home_investissement_immobilier_de_haut_rendement_et_c")}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* REAL ESTATE CARD */}
            <div className="card-border p-6 md:p-12 group hover:border-accent transition-all duration-300 animate-fade-in">
              <div className="flex items-start gap-6 mb-8">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110"
                  style={{ backgroundColor: "var(--accent-bg)" }}
                >
                  <Building2
                    className="w-8 h-8"
                    style={{ color: "var(--accent)" }}
                    strokeWidth={1.5}
                  />
                </div>
                <div className="min-w-0">
                  <h3
                    className="text-3xl font-serif tracking-tight mb-3"
                    style={{ color: "var(--text)" }}
                  >
                    {t("home_real_estate_investment")}
                  </h3>
                  <p
                    className="text-sm font-bold uppercase tracking-[0.15em]"
                    style={{ color: "var(--accent)" }}
                  >
                    {t("home_immobilier_premium")}
                  </p>
                </div>
              </div>

              <p
                className="text-lg mb-8 leading-[1.8]"
                style={{ color: "var(--text3)" }}
              >
                {t("home_accedez_aux_meilleures_opportunites_immobilieres")}
              </p>

              <ul className="space-y-4 mb-10">
                {[
                  t("home_rendement_locatif_6_8_net_an"),
                  t("home_achat_sur_plan_avec_paiement_echelonne"),
                  t("home_golden_visa_eligibility"),
                  t("home_gestion_locative_complete"),
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: "var(--accent)" }}
                    ></div>
                    <span className="text-sm" style={{ color: "var(--text)" }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to="/listings"
                className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.15em] group/link"
                style={{ color: "var(--accent)" }}
              >
                {t("home_voir_les_biens")}
                <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
              </Link>
            </div>

            {/* BUSINESS SETUP CARD */}
            <div className="card-border p-6 md:p-12 group hover:border-accent transition-all duration-300 animate-fade-in delay-100">
              <div className="flex items-start gap-6 mb-8">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110"
                  style={{ backgroundColor: "var(--accent-bg)" }}
                >
                  <Briefcase
                    className="w-8 h-8"
                    style={{ color: "var(--accent)" }}
                    strokeWidth={1.5}
                  />
                </div>
                <div className="min-w-0">
                  <h3
                    className="text-3xl font-serif tracking-tight mb-3"
                    style={{ color: "var(--text)" }}
                  >
                    {t("home_business_setup_relocation")}
                  </h3>
                  <p
                    className="text-sm font-bold uppercase tracking-[0.15em]"
                    style={{ color: "var(--accent)" }}
                  >
                    {t("home_installation_complete")}
                  </p>
                </div>
              </div>

              <p
                className="text-lg mb-8 leading-[1.8]"
                style={{ color: "var(--text3)" }}
              >
                {t("home_creez_votre_entreprise_a_dubai_et_obtenez_votre_")}
              </p>

              <ul className="space-y-4 mb-10">
                {[
                  t("home_creation_de_societe_freezone_mainland_offshore"),
                  t("home_visa_de_residence_uae_visas_employes"),
                  t("home_ouverture_de_compte_bancaire_corporate"),
                  t("home_structuration_fiscale_optimisation"),
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: "var(--accent)" }}
                    ></div>
                    <span className="text-sm" style={{ color: "var(--text)" }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to="/contact"
                className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.15em] group/link"
                style={{ color: "var(--accent)" }}
              >
                {t("home_demarrer_mon_projet")}
                <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    ),
    why: (
      <section
        className="py-32 border-y"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-20 animate-fade-in">
            <span className="tag-gold mb-6">
              {t("home_pourquoi_movesmart")}
            </span>
            <h2
              className="text-5xl md:text-7xl tracking-tighter max-w-4xl mx-auto"
              style={{ color: "var(--text)" }}
            >
              {
                <>
                  {t("home_why_title")}{" "}
                  <span className="font-serif-italic text-accent">
                    {t("home_why_accent")}
                  </span>
                </>
              }
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: t("home_accompagnement_multilingue"),
                desc: t(
                  "home_service_en_francais_anglais_et_arabe_equipe_loca",
                ),
              },
              {
                icon: Shield,
                title: t("home_transparence_totale"),
                desc: t(
                  "home_aucun_frais_cache_analyse_financiere_rigoureuse_",
                ),
              },
              {
                icon: TrendingUp,
                title: t("home_expertise_terrain"),
                desc: t(
                  "home_connaissance_approfondie_du_marche_uae_relations",
                ),
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="card-border p-10 animate-fade-in"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="mb-8">
                  <item.icon
                    className="w-12 h-12"
                    style={{ color: "var(--accent)" }}
                    strokeWidth={1.5}
                  />
                </div>
                <h3
                  className="text-2xl font-serif tracking-tight mb-4"
                  style={{ color: "var(--text)" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-[15px] leading-[1.8]"
                  style={{ color: "var(--text3)" }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    testimonials: (
      <section className="py-32" style={{ backgroundColor: "var(--bg)" }}>
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-20 animate-fade-in">
            <span className="tag-gold mb-6">{t("home_temoignages")}</span>
            <h2
              className="text-5xl md:text-7xl tracking-tighter"
              style={{ color: "var(--text)" }}
            >
              {
                <>
                  {t("home_testimonials_title")}{" "}
                  <span className="font-serif-italic text-accent">
                    {t("home_testimonials_accent")}
                  </span>
                </>
              }
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {currentTestimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="card-border p-10 animate-fade-in"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div
                  className="flex gap-1 mb-6"
                  style={{ color: "var(--accent)" }}
                >
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p
                  className="text-[15px] leading-[1.8] mb-8 font-serif-italic"
                  style={{ color: "var(--text)" }}
                >
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: "var(--accent)" }}
                  >
                    {testimonial.image ? (
                      <SiteImage
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      testimonial.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <p
                      className="font-bold text-sm"
                      style={{ color: "var(--text)" }}
                    >
                      {testimonial.name}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text3)" }}>
                      {testimonial.role} · {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    faq: <FAQ />,
    cta: (
      <section
        className="py-40 relative overflow-hidden text-center border-t"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, var(--accent) 0%, transparent 70%)",
          }}
        ></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 animate-fade-in">
          <span className="tag-gold mb-8">{t("home_passez_a_l_action")}</span>
          <h2
            className="text-5xl md:text-8xl tracking-tighter mb-10 leading-[1.05]"
            style={{ color: "var(--text)" }}
          >
            {
              <>
                {t("home_cta_title")}{" "}
                <span className="font-serif-italic text-accent">
                  {t("home_cta_accent")}
                </span>
              </>
            }
          </h2>
          <p
            className="text-xl md:text-2xl mb-14 font-light max-w-3xl mx-auto leading-[1.8]"
            style={{ color: "var(--text3)" }}
          >
            {t("home_reservez_votre_consultation_privee_notre_expert_")}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/contact" className="btn-gold shadow-2xl">
              {t("home_reserver_un_appel_prive")}
            </Link>
            <a
              href={`https://wa.me/${content.settings.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              {t("home_whatsapp_direct")}
            </a>
          </div>
        </div>
      </section>
    ),
  };
  return (
    <div style={{ backgroundColor: "var(--bg)" }}>
      {content.homeOrder.map((id) =>
        content.visibleSections[id] &&
        !(id === "testimonials" && !content.testimonials.length) ? (
          <React.Fragment key={id}>{sections[id]}</React.Fragment>
        ) : null,
      )}
      <p
        className="px-6 pb-10 text-center text-[11px] max-w-3xl mx-auto"
        style={{ color: "var(--text3)" }}
      >
        {t("investment_disclaimer")}
      </p>
    </div>
  );
}
