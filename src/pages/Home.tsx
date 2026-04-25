import React from 'react';
import { Link } from 'react-router-dom';
import { Building, MapPin, Check, Phone, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import FAQ from '../components/FAQ';
import Testimonials from '../components/Testimonials';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div style={{ backgroundColor: 'var(--bg)' }}>
      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/4531667/pexels-photo-4531667.jpeg" 
            alt="Dubai Skyline" 
            className="w-full h-full object-cover"
          />
          {/* Overlay gradient to keep text crisp */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20 animate-fade-in">
          <span className="font-semibold tracking-[0.4em] uppercase text-xs mb-8 block text-gold">
            MoveSmart
          </span>
          <h1 className="text-5xl md:text-8xl font-serif mb-8 tracking-tight leading-[1.1] text-white">
            {t('hero_title_1', 'Investissez à')} <br/>
            <span className="font-serif-italic text-gold">{t('hero_title_em', 'Dubaï.')}</span>
          </h1>
          <p className="text-base md:text-lg mb-12 max-w-2xl mx-auto font-light leading-relaxed text-gray-200">
            {t('hero_sub', 'Rendement locatif · 0% d\'impôt · Achat sur plan exclusif. MoveSmart sécurise et maximise votre investissement.')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to="/listings" 
              className="w-full sm:w-auto px-10 py-4 font-semibold uppercase tracking-widest text-[11px] transition-all hover:bg-amber-600 shadow-xl text-black"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {t('hero_cta', 'Voir les opportunités')}
            </Link>
            <Link 
              to="/contact" 
              className="w-full sm:w-auto px-10 py-4 bg-transparent border font-semibold uppercase tracking-widest text-[11px] transition-colors text-white"
              style={{ borderColor: 'rgba(255,255,255,0.4)' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              {t('hero_cta2', 'Consultation gratuite')}
            </Link>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-32" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <div className="animate-fade-in">
            <span className="font-semibold uppercase tracking-widest text-[10px] mb-6 block text-gold">
              {t('why_us_tag', 'Pourquoi MoveSmart')}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif tracking-tight mb-8" style={{ color: 'var(--text)' }}>
              {t('about_title_1', 'On sécurise votre capital')}
            </h2>
            <p className="mb-6 text-sm leading-relaxed" style={{ color: 'var(--text3)' }}>
              {t('why_us_p1', 'MoveSmart accompagne exclusivement les investisseurs internationaux sur le marché immobilier de Dubaï. Notre rôle : vous trouver les meilleures opportunités, négocier pour vous, et sécuriser chaque étape.')}
            </p>
            <p className="mb-12 text-sm leading-relaxed" style={{ color: 'var(--text3)' }}>
              {t('why_us_p2', 'Rendement locatif, achat sur plan, revente ou Golden Visa — nous gérons tout pour maximiser votre retour sur investissement.')}
            </p>
            
            <div className="grid grid-cols-3 gap-8 pt-10" style={{ borderTop: '1px solid var(--border)' }}>
              <div>
                <p className="text-4xl font-serif text-gold mb-3">500+</p>
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text3)' }}>{t('stat_sold', 'Investissements réalisés')}</p>
              </div>
              <div>
                <p className="text-4xl font-serif text-gold mb-3">40+</p>
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text3)' }}>{t('stat_nations', 'Nationalités')}</p>
              </div>
              <div>
                <p className="text-4xl font-serif text-gold mb-3">10</p>
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text3)' }}>{t('stat_years', 'Années d\'expertise')}</p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800&auto=format&fit=crop" 
              alt="Luxury Interior" 
              className="w-full h-[650px] object-cover rounded grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl"
            />
            <div className="absolute -bottom-8 -left-8 p-10 max-w-xs hidden lg:block rounded shadow-2xl backdrop-blur-xl animate-fade-in" style={{ backgroundColor: 'var(--header-bg)', border: '1px solid var(--border)' }}>
              <div className="flex gap-1.5 mb-5 text-gold">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-3xl font-serif mb-3" style={{ color: 'var(--text)' }}>5.0/5</p>
              <p className="text-xs font-serif-italic tracking-wide leading-relaxed" style={{ color: 'var(--text3)' }}>"Service exceptionnel et accompagnement professionnel de bout en bout."</p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES / VALUE PROPS */}
      <section className="py-32" style={{ backgroundColor: 'var(--bg)', filter: 'brightness(0.97)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="font-semibold uppercase tracking-widest text-[10px] mb-6 block text-gold">
              {t('services_tag', 'Nos Services')}
            </span>
            <h2 className="text-4xl md:text-6xl font-serif tracking-tight" style={{ color: 'var(--text)' }}>
              {t('services_title', 'Un accompagnement complet')}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Building, title: t('s1_title', 'Achat sur plan'), desc: t('s1_desc', 'Accès exclusif aux meilleurs projets off-plan avant ouverture publique.') },
              { icon: MapPin, title: t('s4_title', 'Golden Visa'), desc: t('s4_desc', 'Résidence 10 ans incluse dès 545,000 AED d\'investissement.') },
              { icon: Check, title: t('s2_title', 'Investissement locatif'), desc: t('s2_desc', 'Sélection des biens à fort rendement locatif 6–8% net par an.') },
              { icon: Phone, title: t('s3_title', 'Revente & plus-value'), desc: t('s3_desc', 'Stratégie de revente pour maximiser votre capital.') },
            ].map((service, index) => (
              <div key={index} className="p-10 border rounded transition-all duration-300 group hover:-translate-y-2 shadow-sm hover:shadow-xl" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
                <service.icon className="w-12 h-12 mb-8 group-hover:scale-110 transition-transform text-gold" strokeWidth={1} />
                <h3 className="text-xl font-serif tracking-tight mb-4" style={{ color: 'var(--text)' }}>{service.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text3)' }}>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* FAQ */}
      <FAQ />

      {/* CTA */}
      <section className="py-40 text-center relative overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, var(--accent) 0%, transparent 70%)' }}></div>
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <h2 className="text-5xl md:text-7xl font-serif tracking-tight mb-8" style={{ color: 'var(--text)' }}>
            {t('cta_title_1', 'Votre investissement commence')} <span className="font-serif-italic text-gold block mt-2">{t('cta_title_em', 'aujourd\'hui.')}</span>
          </h2>
          <p className="text-base mb-16 leading-relaxed" style={{ color: 'var(--text3)' }}>
            {t('cta_sub', 'Consultation gratuite. Notre expert analyse votre projet et vous propose les meilleures opportunités du marché.')}
          </p>
          <div className="flex justify-center gap-6">
            <Link 
              to="/contact" 
              className="px-10 py-5 font-semibold uppercase tracking-widest text-[11px] transition-transform hover:scale-105 shadow-2xl text-black rounded"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {t('cta_btn', 'Consultation gratuite')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
