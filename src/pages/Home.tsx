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
      {/* HERO SECTION - ANIMÉ & MODERNE */}
      <section className="relative h-[95vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/4531667/pexels-photo-4531667.jpeg" 
            alt="Dubai Skyline" 
            className="w-full h-full object-cover scale-105 transition-transform duration-[20s] ease-out hover:scale-100"
          />
          {/* Dégradé doux pour lisibilité */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-24">
          <span className="inline-flex items-center gap-2 py-2 px-5 rounded-full border mb-8 text-[11px] font-bold tracking-[0.2em] uppercase backdrop-blur-md animate-slide-down" style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse-slow"></span>
            Investissement Immobilier · Dubaï
          </span>
          <h1 className="text-6xl md:text-[100px] font-bold mb-6 tracking-tighter leading-[0.95] text-white drop-shadow-2xl animate-fade-in-up">
            {t('hero_title_1', 'Investissez à')} <br/>
            <span className="font-serif-italic font-normal text-amber-500">
              {t('hero_title_em', 'Dubaï.')}
            </span>
          </h1>
          <p className="text-lg md:text-2xl mb-12 max-w-2xl mx-auto font-light leading-relaxed text-gray-300 animate-fade-in-up delay-100">
            {t('hero_sub', 'Rendement locatif jusqu\'à 8% net · 0% d\'impôt · Achat sur plan exclusif. MoveSmart sécurise votre investissement.')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
            <Link 
              to="/listings" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest text-[11px] transition-all hover:scale-105 hover:bg-gray-100 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
            >
              {t('hero_cta', 'Voir les opportunités')}
            </Link>
            <Link 
              to="/contact" 
              className="w-full sm:w-auto px-8 py-4 bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-full font-bold uppercase tracking-widest text-[11px] transition-all hover:bg-white/10"
            >
              {t('hero_cta2', 'Consultation gratuite')}
            </Link>
          </div>
        </div>
      </section>

      {/* BANDEAU STATS */}
      <section className="border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x" style={{ borderColor: 'var(--border)' }}>
          {[
            { v: '500+', l: t('stat_sold', 'Biens vendus') },
            { v: '15%', l: t('roi_3_label', 'Plus-value moyenne') },
            { v: '8%', l: t('roi_1_label', 'Rendement locatif net') },
            { v: '0%', l: t('roi_2_label', 'Impôt sur le revenu') }
          ].map((s, i) => (
            <div key={i} className="text-center px-4 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <p className="text-3xl md:text-5xl font-bold tracking-tighter mb-2" style={{ color: 'var(--text)' }}>{s.v}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text3)' }}>{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INTRO - POURQUOI MOVESMART */}
      <section className="py-32" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="animate-fade-in-up">
            <span className="inline-block py-1.5 px-4 rounded-full border mb-8 text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--text)', borderColor: 'var(--border)' }}>
              {t('why_us_tag', 'Pourquoi MoveSmart')}
            </span>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter mb-8 leading-[1.1]" style={{ color: 'var(--text)' }}>
              On ne vend pas du rêve. <br/>
              <span className="text-amber-500 font-serif-italic font-normal">On sécurise du capital.</span>
            </h2>
            <p className="mb-6 text-lg font-light leading-relaxed" style={{ color: 'var(--text3)' }}>
              {t('why_us_p1', 'MoveSmart accompagne exclusivement les investisseurs internationaux sur le marché immobilier de Dubaï. Notre rôle : vous trouver les meilleures opportunités, négocier pour vous, et sécuriser chaque étape.')}
            </p>
            <p className="mb-12 text-lg font-light leading-relaxed" style={{ color: 'var(--text3)' }}>
              {t('why_us_p2', 'Rendement locatif, achat sur plan, revente ou Golden Visa — nous gérons tout pour maximiser votre retour sur investissement.')}
            </p>
            
            <Link to="/about" className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[11px] transition-all hover:bg-amber-500 hover:text-black border hover:border-transparent group" style={{ color: 'var(--text)', borderColor: 'var(--border)' }}>
              Découvrir notre approche <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="relative animate-fade-in-up delay-200">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-transparent blur-3xl rounded-full"></div>
            <img 
              src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800&auto=format&fit=crop" 
              alt="Luxury Interior" 
              className="w-full h-[600px] object-cover rounded-[32px] shadow-2xl relative z-10"
            />
            <div className="absolute -bottom-8 -right-8 p-8 max-w-sm hidden lg:block rounded-2xl z-20 backdrop-blur-xl border shadow-2xl" style={{ backgroundColor: 'var(--header-bg)', borderColor: 'var(--border)' }}>
              <div className="flex gap-1.5 mb-4 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-3xl font-bold tracking-tight mb-2" style={{ color: 'var(--text)' }}>5.0/5</p>
              <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--text3)' }}>"L'agence francophone la plus fiable pour investir à Dubaï en toute sérénité."</p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-32 border-y" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24 max-w-3xl mx-auto animate-fade-in-up">
            <span className="inline-block py-1.5 px-4 rounded-full border mb-8 text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--text)', borderColor: 'var(--border)' }}>
              {t('services_tag', 'Nos Services')}
            </span>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6" style={{ color: 'var(--text)' }}>
              Un accompagnement <span className="font-serif-italic font-normal text-amber-500">complet.</span>
            </h2>
            <p className="text-lg font-light" style={{ color: 'var(--text3)' }}>De la sélection du projet à la gestion locative, nous sommes votre point de contact unique.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Building, title: t('s1_title', 'Achat sur plan'), desc: t('s1_desc', 'Accès VIP aux meilleurs projets off-plan avant l\'ouverture publique.') },
              { icon: MapPin, title: t('s4_title', 'Golden Visa'), desc: t('s4_desc', 'Résidence 10 ans garantie. Nous gérons 100% de la procédure.') },
              { icon: Check, title: t('s2_title', 'Investissement locatif'), desc: t('s2_desc', 'Sélection chirurgicale des biens à fort rendement (6–8% net/an).') },
              { icon: Phone, title: t('s3_title', 'Revente & Stratégie'), desc: t('s3_desc', 'Anticipation de la stratégie de sortie pour maximiser la plus-value.') },
            ].map((service, index) => (
              <div key={index} className="p-10 rounded-[24px] border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group bg-black/5 dark:bg-white/5 animate-fade-in-up" style={{ borderColor: 'var(--border)', animationDelay: `${index * 100}ms` }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-8 border transition-transform group-hover:scale-110" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
                  <service.icon className="w-7 h-7 text-amber-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-4" style={{ color: 'var(--text)' }}>{service.title}</h3>
                <p className="text-sm font-light leading-relaxed" style={{ color: 'var(--text3)' }}>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* FAQ */}
      <FAQ />

      {/* CTA FINAL */}
      <section className="py-40 relative overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center p-16 md:p-24 rounded-[40px] border shadow-2xl animate-fade-in-up" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-tight" style={{ color: 'var(--text)' }}>
            Votre investissement commence <br/>
            <span className="text-amber-500 font-serif-italic font-normal">aujourd'hui.</span>
          </h2>
          <p className="text-lg md:text-xl mb-12 font-light max-w-2xl mx-auto" style={{ color: 'var(--text3)' }}>
            {t('cta_sub', 'Réservez votre consultation gratuite. Notre expert analyse vos objectifs et vous propose une stratégie sur mesure.')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/contact" 
              className="px-10 py-5 bg-amber-500 text-black rounded-full font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-transform hover:scale-105"
            >
              {t('cta_btn', 'Réserver un appel')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
