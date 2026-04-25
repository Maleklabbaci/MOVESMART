import React from 'react';
import { Building, MapPin, Check, Phone, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next'; 

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen pt-32 pb-40" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="text-center mb-32 animate-fade-in">
          <span className="inline-block mb-8 text-[10px] font-bold tracking-widest uppercase text-amber-500">
            {t('about_page_tag', 'À Propos')}
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-wider uppercase leading-tight mb-10 max-w-4xl mx-auto">
            {t('about_title_1', 'On sécurise')} <br/>
            <span className="font-serif-italic lowercase text-amber-500">
              {t('about_title_em', 'votre capital.')}
            </span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl font-light leading-relaxed font-sans" style={{ color: 'var(--text3)' }}>
            {t('about_p1', 'MoveSmart accompagne exclusivement les investisseurs internationaux sur le marché immobilier de Dubaï — off-plan, locatif, revente ou Golden Visa.')}
          </p>
          <p className="max-w-3xl mx-auto mt-6 text-lg font-bold font-sans" style={{ color: 'var(--text)' }}>
            {t('about_p2', 'Notre mission : maximiser votre ROI à chaque étape, de la sélection à la gestion.')}
          </p>
        </div>

        {/* IMAGE SECTION */}
        <div className="relative aspect-[21/9] bg-black/5 mb-32 overflow-hidden shadow-sm border transition-all duration-200 animate-fade-in" style={{ borderColor: 'var(--border)' }}>
          <img 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600&auto=format&fit=crop" 
            alt="Dubai Skyline" 
            className="w-full h-full object-cover transition-transform duration-[20s] hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* WHY DUBAI */}
        <div className="grid md:grid-cols-2 gap-20 items-start mb-40 animate-fade-in">
          <div className="sticky top-32">
            <span className="inline-block mb-6 text-[10px] font-bold tracking-widest uppercase text-amber-500">
              {t('why_tag', 'Pourquoi Dubaï')}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-wider leading-tight mb-6">
              {t('why_dubai', 'Le marché immobilier de Dubaï')} <br/>
              <span className="font-serif-italic lowercase text-amber-500">{t('why_dubai_em', 'surperforme.')}</span>
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-10">
            {[
              { icon: TrendingUp, title: t('hub_title', 'Hub financier mondial'), desc: t('hub_desc', 'Centre d\'affaires entre Orient et Occident.') },
              { icon: Check, title: t('tax_title', '0% d\'impôt'), desc: t('tax_desc', 'Aucune taxe sur revenus locatifs ni plus-values.') },
              { icon: ShieldCheck, title: t('biz_title', 'Marché réglementé'), desc: t('biz_desc', 'RERA garantit transparence et sécurité des transactions.') },
              { icon: Users, title: t('growth_title', 'Croissance'), desc: t('growth_desc', 'Population en hausse constante, demande locative forte.') },
            ].map((item, index) => (
              <div key={index} className="p-8 border shadow-sm group hover:-translate-y-1 transition-transform" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
                <item.icon className="w-8 h-8 mb-6 text-amber-500 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text)' }}>{item.title}</h3>
                <p className="text-sm font-light font-sans leading-relaxed" style={{ color: 'var(--text3)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* OUR APPROACH */}
        <div className="mb-40">
          <div className="text-center mb-20 animate-fade-in">
            <span className="inline-block mb-6 text-[10px] font-bold tracking-widest uppercase text-amber-500">
              {t('approach_tag', 'Notre approche')}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-wider leading-tight">
              L'investissement <br/>
              <span className="font-serif-italic lowercase text-amber-500">clé en main.</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {[
              { step: "01", title: t('vision_title', 'Analyse de marché'), desc: t('vision_desc', 'Sélection rigoureuse basée sur les données de rendement réel.') },
              { step: "02", title: t('personal_title', 'Négociation exclusive'), desc: t('personal_desc', 'Accès aux meilleures offres avant ouverture publique.') },
              { step: "03", title: t('trust_title', 'Sécurisation totale'), desc: t('trust_desc', 'Vérification juridique complète à chaque étape.') },
              { step: "04", title: t('growth_title', 'Suivi ROI'), desc: t('growth_desc', 'Gestion locative et reporting régulier de votre investissement.') },
            ].map((step, index) => (
              <div key={index} className="p-10 border relative overflow-hidden group hover:shadow-lg transition-all" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
                <div className="absolute -top-6 -right-6 text-9xl font-bold opacity-5" style={{ color: 'var(--text)' }}>
                  {step.step}
                </div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-amber-500 mb-8">
                  Étape {step.step}
                </div>
                <h3 className="text-xl font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text)' }}>{step.title}</h3>
                <p className="text-sm font-light font-sans leading-relaxed" style={{ color: 'var(--text3)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* COMMITMENT CTA */}
        <div className="p-12 md:p-24 border text-center animate-fade-in bg-black text-white" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <span className="inline-block mb-8 text-[10px] font-bold tracking-widest uppercase text-amber-500">
            {t('commit_tag', 'Notre engagement')}
          </span>
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-wider mb-10 leading-tight">
            {t('commit_title_1', 'Votre capital,')} <br/>
            <span className="font-serif-italic lowercase text-amber-500">{t('commit_title_em', 'notre priorité.')}</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg font-light font-sans leading-relaxed text-gray-400 mb-12">
            {t('commit_p', 'Chez MoveSmart, chaque décision est guidée par une seule question : est-ce que cet investissement maximise votre retour tout en minimisant les risques ?')}
          </p>
          <a href="/contact" className="inline-block px-10 py-5 font-bold uppercase tracking-widest text-[11px] transition-colors bg-amber-500 text-black hover:bg-amber-600">
            {t('commit_cta', 'Prendre rendez-vous')}
          </a>
        </div>

      </div>
    </div>
  );
}
