import React from 'react';
import { Building, MapPin, Check, Phone, ShieldCheck, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next'; 
import { Link } from 'react-router-dom';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen pt-40 pb-40" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* HEADER */}
        <div className="text-center mb-32 animate-fade-in">
          <span className="tag-gold mb-10">
            {t('about_page_tag', 'À Propos')}
          </span>
          <h1 className="text-6xl md:text-[90px] font-serif tracking-tighter mb-12 max-w-4xl mx-auto leading-[1.05]">
            {t('about_title_1', 'On sécurise')} <br/>
            <span className="font-serif-italic text-accent">
              {t('about_title_em', 'votre capital.')}
            </span>
          </h1>
          <p className="max-w-3xl mx-auto text-xl md:text-2xl font-light leading-[1.8] mb-10" style={{ color: 'var(--text3)' }}>
            {t('about_p1', 'MoveSmart accompagne exclusivement les investisseurs internationaux sur le marché immobilier de Dubaï — off-plan, locatif, revente ou Golden Visa.')}
          </p>
          <p className="max-w-3xl mx-auto text-xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            {t('about_p2', 'Notre mission : maximiser votre ROI à chaque étape, de la sélection à la gestion.')}
          </p>
        </div>

        {/* IMAGE SECTION */}
        <div className="relative aspect-[21/9] bg-black/5 mb-40 overflow-hidden shadow-2xl border transition-all duration-500 animate-fade-in delay-100" style={{ borderColor: 'var(--border)' }}>
          <img 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600&auto=format&fit=crop" 
            alt="Dubai Skyline" 
            className="w-full h-full object-cover transition-transform duration-[30s] hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
        </div>

        {/* WHY DUBAI */}
        <div className="grid md:grid-cols-2 gap-24 items-start mb-40 animate-fade-in delay-200">
          <div className="sticky top-32">
            <span className="tag-gold mb-8">
              {t('why_tag', 'Pourquoi Dubaï')}
            </span>
            <h2 className="text-5xl md:text-7xl font-serif tracking-tighter leading-[1.05] mb-8">
              {t('why_dubai', 'Le marché immobilier de Dubaï')} <br/>
              <span className="font-serif-italic text-accent">{t('why_dubai_em', 'surperforme.')}</span>
            </h2>
            <Link to="/contact" className="inline-flex items-center gap-4 text-sm font-bold uppercase tracking-[0.2em] transition-colors group mt-8" style={{ color: 'var(--text)' }}>
              Discuter d'un projet
              <span className="w-10 h-10 rounded-full flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-[var(--accent)] group-hover:text-black border" style={{ borderColor: 'var(--border)' }}>
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-8">
            {[
              { icon: TrendingUp, title: t('hub_title', 'Hub financier mondial'), desc: t('hub_desc', 'Centre d\'affaires incontournable entre Orient et Occident.') },
              { icon: Check, title: t('tax_title', '0% d\'impôt'), desc: t('tax_desc', 'Aucune taxe sur les revenus locatifs ni sur les plus-values.') },
              { icon: ShieldCheck, title: t('biz_title', 'Marché réglementé'), desc: t('biz_desc', 'La RERA garantit une transparence et une sécurité absolues des transactions.') },
              { icon: Users, title: t('growth_title', 'Croissance démographique'), desc: t('growth_desc', 'Une population en hausse constante assurant une demande locative extrêmement forte.') },
            ].map((item, index) => (
              <div key={index} className="card-border p-10 group hover:-translate-y-2">
                <item.icon className="w-10 h-10 mb-8 text-accent group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                <h3 className="text-xl font-serif tracking-tighter mb-4" style={{ color: 'var(--text)' }}>{item.title}</h3>
                <p className="text-[15px] font-light leading-[1.8]" style={{ color: 'var(--text3)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* OUR APPROACH */}
        <div className="mb-40">
          <div className="text-center mb-24 animate-fade-in">
            <span className="tag-gold mb-8">
              {t('approach_tag', 'Notre approche')}
            </span>
            <h2 className="text-5xl md:text-7xl font-serif tracking-tighter leading-[1.05]">
              L'investissement <br/>
              <span className="font-serif-italic text-accent">clé en main.</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-4 gap-10">
            {[
              { step: "01", title: t('vision_title', 'Analyse de marché'), desc: t('vision_desc', 'Sélection rigoureuse basée sur les données de rendement réel.') },
              { step: "02", title: t('personal_title', 'Négociation exclusive'), desc: t('personal_desc', 'Accès aux meilleures offres avant l\'ouverture publique (Pré-lancement).') },
              { step: "03", title: t('trust_title', 'Sécurisation totale'), desc: t('trust_desc', 'Vérification juridique complète à chaque étape de la transaction.') },
              { step: "04", title: t('growth_title', 'Suivi ROI'), desc: t('growth_desc', 'Gestion locative et reporting financier régulier de votre investissement.') },
            ].map((step, index) => (
              <div key={index} className="card-border p-12 relative overflow-hidden group">
                <div className="absolute -top-8 -right-8 text-[150px] font-serif font-bold opacity-5 group-hover:opacity-10 transition-opacity" style={{ color: 'var(--text)' }}>
                  {step.step}
                </div>
                <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent mb-10">
                  Étape {step.step}
                </div>
                <h3 className="text-2xl font-serif tracking-tighter mb-5 relative z-10" style={{ color: 'var(--text)' }}>{step.title}</h3>
                <p className="text-[15px] font-light leading-[1.8] relative z-10" style={{ color: 'var(--text3)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* COMMITMENT CTA */}
        <div className="p-16 md:p-32 border text-center animate-fade-in shadow-2xl" style={{ backgroundColor: 'var(--header-bg)', borderColor: 'var(--border)' }}>
          <span className="tag-gold mb-10">
            {t('commit_tag', 'Notre engagement')}
          </span>
          <h2 className="text-5xl md:text-8xl font-serif tracking-tighter mb-14 leading-[1.05]">
            {t('commit_title_1', 'Votre capital,')} <br/>
            <span className="font-serif-italic text-accent">{t('commit_title_em', 'notre priorité.')}</span>
          </h2>
          <p className="max-w-3xl mx-auto text-xl font-light leading-[1.8] mb-16" style={{ color: 'var(--text3)' }}>
            {t('commit_p', 'Chez MoveSmart, chaque décision est guidée par une seule question : est-ce que cet investissement maximise votre retour tout en minimisant les risques ?')}
          </p>
          <Link to="/contact" className="btn-gold shadow-2xl">
            {t('commit_cta', 'Prendre rendez-vous')}
          </Link>
        </div>

      </div>
    </div>
  );
}
