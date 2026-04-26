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
      {/* HERO SECTION - ANIMÉ & LUXE */}
      <section className="relative h-[95vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/4531667/pexels-photo-4531667.jpeg" 
            alt="Dubai Skyline" 
            className="w-full h-full object-cover scale-105 transition-transform duration-[20s] ease-out hover:scale-100"
          />
          {/* Dégradé doux */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/70"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-24">
          <span className="tag-gold animate-slide-down">
            Premium Real Estate · Dubaï
          </span>
          <h1 className="text-6xl md:text-[110px] mb-6 tracking-tighter leading-[0.95] text-white drop-shadow-2xl animate-fade-in delay-100 font-serif">
            {t('hero_title_1', 'Investissez à')} <br/>
            <span className="font-serif-italic text-accent">
              {t('hero_title_em', 'Dubaï.')}
            </span>
          </h1>
          <p className="text-lg md:text-2xl mb-12 max-w-2xl mx-auto font-light leading-relaxed text-gray-300 animate-fade-in delay-200">
            {t('hero_sub', 'Rendement locatif jusqu\'à 8% net · 0% d\'impôt · Achat sur plan exclusif. Sécurisez votre patrimoine avec MoveSmart.')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in delay-300">
            <Link to="/listings" className="btn-gold w-full sm:w-auto shadow-2xl">
              {t('hero_cta', 'Voir les opportunités')}
            </Link>
            <Link to="/contact" className="btn-outline w-full sm:w-auto text-white border-white/30 hover:bg-white/10 hover:border-white">
              {t('hero_cta2', 'Consultation gratuite')}
            </Link>
          </div>
        </div>
      </section>

      {/* BANDEAU STATS - GOLDEN */}
      <section className="border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
        <div className="max-w-[1400px] mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x" style={{ borderColor: 'var(--border)' }}>
          {[
            { v: '500+', l: t('stat_sold', 'Biens vendus') },
            { v: '15%', l: t('roi_3_label', 'Plus-value moyenne') },
            { v: '8%', l: t('roi_1_label', 'Rendement locatif net') },
            { v: '0%', l: t('roi_2_label', 'Impôt sur le revenu') }
          ].map((s, i) => (
            <div key={i} className="text-center px-4 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <p className="text-4xl md:text-6xl font-serif tracking-tighter mb-4" style={{ color: 'var(--text)' }}>{s.v}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text3)' }}>{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INTRO - LUXE & SPACE */}
      <section className="py-40" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-[1400px] mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">
          <div className="animate-fade-in">
            <span className="tag-gold mb-8">
              {t('why_us_tag', 'Pourquoi MoveSmart')}
            </span>
            <h2 className="text-5xl md:text-7xl tracking-tighter mb-10 leading-[1.05]" style={{ color: 'var(--text)' }}>
              On ne vend pas du rêve. <br/>
              <span className="text-accent font-serif-italic">On sécurise du capital.</span>
            </h2>
            <p className="mb-8 text-xl font-light leading-[1.8]" style={{ color: 'var(--text3)' }}>
              {t('why_us_p1', 'MoveSmart accompagne exclusivement les investisseurs internationaux sur le marché immobilier de Dubaï. Notre rôle : vous trouver les meilleures opportunités, négocier pour vous, et sécuriser chaque étape.')}
            </p>
            <p className="mb-14 text-xl font-light leading-[1.8]" style={{ color: 'var(--text3)' }}>
              {t('why_us_p2', 'Rendement locatif, achat sur plan, revente ou Golden Visa — nous gérons tout pour maximiser votre retour sur investissement avec une transparence totale.')}
            </p>
            
            <Link to="/about" className="inline-flex items-center gap-4 text-sm font-bold uppercase tracking-[0.2em] transition-colors group" style={{ color: 'var(--text)' }}>
              Découvrir notre approche 
              <span className="w-10 h-10 rounded-full flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-[var(--accent)] group-hover:text-black border" style={{ borderColor: 'var(--border)' }}>
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
          
          <div className="relative animate-fade-in delay-200">
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent)]/10 to-transparent blur-3xl rounded-full"></div>
            <img 
              src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800&auto=format&fit=crop" 
              alt="Luxury Interior" 
              className="w-full h-[700px] object-cover grayscale hover:grayscale-0 transition-all duration-[2s] shadow-2xl relative z-10"
            />
            <div className="absolute -bottom-12 -left-12 p-12 max-w-sm hidden lg:block z-20 backdrop-blur-2xl shadow-2xl" style={{ backgroundColor: 'var(--header-bg)', border: '1px solid var(--border)' }}>
              <div className="flex gap-2 mb-6" style={{ color: 'var(--accent)' }}>
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-4xl font-serif mb-4" style={{ color: 'var(--text)' }}>5.0/5</p>
              <p className="text-sm font-serif-italic tracking-wide leading-[1.8]" style={{ color: 'var(--text3)' }}>"L'agence francophone la plus rigoureuse pour investir à Dubaï. Leur analyse financière est redoutable."</p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES - CLEAN & ELEGANT */}
      <section className="py-40 border-y" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-24 max-w-3xl mx-auto animate-fade-in">
            <span className="tag-gold mb-6">
              {t('services_tag', 'Nos Services')}
            </span>
            <h2 className="text-5xl md:text-7xl tracking-tighter mb-8" style={{ color: 'var(--text)' }}>
              L'excellence <span className="font-serif-italic text-accent">à chaque étape.</span>
            </h2>
            <p className="text-xl font-light" style={{ color: 'var(--text3)' }}>De la sélection du projet à la gestion locative, nous sommes votre bureau privé à Dubaï.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Building, title: t('s1_title', 'Achat sur plan'), desc: t('s1_desc', 'Accès VIP aux meilleurs projets off-plan avant l\'ouverture publique. Paiements échelonnés.') },
              { icon: MapPin, title: t('s4_title', 'Golden Visa'), desc: t('s4_desc', 'Résidence 10 ans garantie dès 545k AED. Nous gérons 100% de la procédure légale.') },
              { icon: Check, title: t('s2_title', 'Investissement locatif'), desc: t('s2_desc', 'Sélection chirurgicale des biens à fort rendement (6–8% net/an). Gestion incluse.') },
              { icon: Phone, title: t('s3_title', 'Revente & Stratégie'), desc: t('s3_desc', 'Anticipation de la stratégie de sortie pour maximiser la plus-value à court/moyen terme.') },
            ].map((service, index) => (
              <div key={index} className="card-border p-12 group animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="mb-10 text-accent transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-110">
                  <service.icon className="w-10 h-10" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-serif tracking-tight mb-5" style={{ color: 'var(--text)' }}>{service.title}</h3>
                <p className="text-[15px] font-light leading-[1.8]" style={{ color: 'var(--text3)' }}>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* FAQ */}
      <FAQ />

      {/* CTA FINAL - LUXURY BANNER */}
      <section className="py-40 relative overflow-hidden text-center" style={{ backgroundColor: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, var(--accent) 0%, transparent 70%)' }}></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 animate-fade-in">
          <span className="tag-gold mb-6">Passez à l'action</span>
          <h2 className="text-5xl md:text-8xl tracking-tighter mb-10 leading-[1.05]" style={{ color: 'var(--text)' }}>
            Votre investissement commence <br/>
            <span className="text-accent font-serif-italic">aujourd'hui.</span>
          </h2>
          <p className="text-xl md:text-2xl mb-14 font-light max-w-3xl mx-auto leading-[1.8]" style={{ color: 'var(--text3)' }}>
            {t('cta_sub', 'Réservez votre appel de consultation privé. Notre expert analyse vos objectifs et vous propose une stratégie sur mesure.')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/contact" className="btn-gold shadow-2xl">
              {t('cta_btn', 'Réserver un appel privé')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
