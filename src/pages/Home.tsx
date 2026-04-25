import React from 'react';
import { Link } from 'react-router-dom';
import { Building, MapPin, Check, Phone, Star, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import FAQ from '../components/FAQ';
import Testimonials from '../components/Testimonials';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div style={{ backgroundColor: 'var(--bg)' }}>
      {/* HERO ULTRA MODERNE */}
      <section className="relative h-[95vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/4531667/pexels-photo-4531667.jpeg" 
            alt="Dubai Skyline" 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-24 animate-blur-fade">
          <span className="inline-block py-1.5 px-4 rounded-full border mb-8 text-[11px] font-semibold tracking-[0.2em] uppercase backdrop-blur-md bg-white/5 border-white/20 text-white shadow-lg">
            Investissement Immobilier · Dubaï
          </span>
          <h1 className="text-6xl md:text-[100px] font-semibold mb-6 tracking-tighter leading-[0.95] text-white drop-shadow-xl">
            {t('hero_title_1', 'Investissez à')} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400">
              {t('hero_title_em', 'Dubaï.')}
            </span>
          </h1>
          <p className="text-lg md:text-2xl mb-12 max-w-3xl mx-auto font-light leading-relaxed text-gray-300 drop-shadow-md">
            {t('hero_sub', 'Rendement locatif jusqu\'à 8% net · 0% d\'impôt · Off-plan exclusif. MoveSmart maximise et sécurise votre investissement.')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/listings" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-semibold text-sm transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            >
              {t('hero_cta', 'Voir les opportunités')}
            </Link>
            <Link 
              to="/contact" 
              className="w-full sm:w-auto px-8 py-4 bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-full font-semibold text-sm transition-all hover:bg-white/10"
            >
              {t('hero_cta2', 'Consultation gratuite')}
            </Link>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
        <div className="max-w-[1400px] mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x" style={{ borderColor: 'var(--border)' }}>
          {[
            { v: '500+', l: t('stat_sold', 'Investissements sécurisés') },
            { v: '15%', l: t('roi_3_label', 'Appréciation annuelle') },
            { v: '8%', l: t('roi_1_label', 'Rendement locatif net') },
            { v: '0%', l: t('roi_2_label', 'Taxes & impôts') }
          ].map((s, i) => (
            <div key={i} className="text-center px-4">
              <p className="text-4xl md:text-5xl font-bold tracking-tighter mb-2" style={{ color: 'var(--text)' }}>{s.v}</p>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INTRO 2024 */}
      <section className="py-32" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-[1400px] mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-500/20 to-transparent blur-3xl rounded-full"></div>
            <img 
              src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800&auto=format&fit=crop" 
              alt="Luxury Interior" 
              className="w-full h-[700px] object-cover rounded-[32px] shadow-2xl relative z-10"
            />
            <div className="absolute -bottom-10 -right-10 p-8 max-w-sm hidden lg:block glass-panel z-20 animate-float">
              <div className="flex gap-1.5 mb-4 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-3xl font-bold tracking-tight mb-2" style={{ color: 'var(--text)' }}>Top Agence 2024</p>
              <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--text-muted)' }}>Reconnue pour la qualité de son accompagnement investisseur francophone à Dubaï.</p>
            </div>
          </div>

          <div className="animate-blur-fade">
            <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border mb-8 inline-block" style={{ color: 'var(--text)', borderColor: 'var(--border)' }}>
              {t('why_us_tag', 'Pourquoi MoveSmart')}
            </span>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter mb-8 leading-[1.1]" style={{ color: 'var(--text)' }}>
              On ne vend pas du rêve. <br/>
              <span className="text-gradient">On sécurise du capital.</span>
            </h2>
            <p className="mb-6 text-lg leading-relaxed font-medium" style={{ color: 'var(--text-muted)' }}>
              {t('why_us_p1', 'MoveSmart accompagne exclusivement les investisseurs internationaux sur le marché immobilier de Dubaï. Notre rôle : vous trouver les meilleures opportunités, négocier pour vous, et sécuriser chaque étape.')}
            </p>
            <p className="mb-12 text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {t('why_us_p2', 'Rendement locatif, achat sur plan, revente ou Golden Visa — nous gérons tout pour maximiser votre retour sur investissement avec des chiffres concrets.')}
            </p>
            
            <Link to="/about" className="modern-btn-outline inline-flex items-center gap-2 px-6 py-3">
              Découvrir notre approche <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES 2024 */}
      <section className="py-32 border-y" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6" style={{ color: 'var(--text)' }}>
              Un accompagnement <span className="text-gradient">de A à Z</span>
            </h2>
            <p className="text-lg" style={{ color: 'var(--text-muted)' }}>De la sélection du projet jusqu'à la revente ou la mise en location, nous sommes votre bureau local à Dubaï.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Building, title: t('s1_title', 'Achat sur plan'), desc: t('s1_desc', 'Accès exclusif aux meilleurs projets off-plan avant ouverture publique pour garantir la plus-value.') },
              { icon: MapPin, title: t('s4_title', 'Golden Visa'), desc: t('s4_desc', 'Résidence 10 ans incluse dès 545,000 AED d\'investissement. On gère 100% de l\'administratif.') },
              { icon: Check, title: t('s2_title', 'Investissement locatif'), desc: t('s2_desc', 'Sélection chirurgicale des biens à fort rendement locatif 6–8% net par an.') },
              { icon: Phone, title: t('s3_title', 'Revente & Stratégie'), desc: t('s3_desc', 'On ne fait pas que vous vendre : on prévoit la stratégie de sortie pour maximiser le capital.') },
            ].map((service, index) => (
              <div key={index} className="modern-card p-10 group">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3" style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}>
                  <service.icon className="w-8 h-8" style={{ color: 'var(--text)' }} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold tracking-tight mb-4" style={{ color: 'var(--text)' }}>{service.title}</h3>
                <p className="text-[15px] leading-relaxed font-medium" style={{ color: 'var(--text-muted)' }}>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* FAQ */}
      <FAQ />

      {/* CTA 2024 */}
      <section className="py-40 relative overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center glass-panel p-16 md:p-24 border" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-tight" style={{ color: 'var(--text)' }}>
            Votre investissement commence <br/>
            <span className="text-gradient">aujourd'hui.</span>
          </h2>
          <p className="text-lg md:text-xl mb-12 font-medium max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            {t('cta_sub', 'Réservez votre appel gratuit de 30 minutes. Notre expert analyse vos objectifs et vous propose une stratégie sur mesure.')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/contact" 
              className="modern-btn px-10 py-5 text-sm uppercase tracking-widest flex items-center justify-center gap-2"
            >
              {t('cta_btn', 'Réserver un appel')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
