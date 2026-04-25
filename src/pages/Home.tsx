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
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20 animate-fade-in">
          <span className="font-bold tracking-[0.3em] uppercase text-sm mb-6 block" style={{ color: 'var(--accent)' }}>
            MoveSmart
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-wider uppercase leading-tight text-white">
            {t('hero_title_1', 'Investissez à')} <br/>
            <span style={{ color: 'var(--accent)' }}>{t('hero_title_em', 'Dubaï.')}</span>
          </h1>
          <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed text-gray-200">
            {t('hero_sub', 'Rendement locatif · 0% d\'impôt · Achat sur plan exclusif. MoveSmart sécurise et maximise votre investissement.')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to="/listings" 
              className="w-full sm:w-auto px-8 py-4 font-bold uppercase tracking-widest text-sm transition-colors text-black"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {t('hero_cta', 'Voir les opportunités')}
            </Link>
            <Link 
              to="/contact" 
              className="w-full sm:w-auto px-8 py-4 bg-transparent border font-bold uppercase tracking-widest text-sm transition-colors text-white hover:bg-white/10"
              style={{ borderColor: 'rgba(255,255,255,0.4)' }}
            >
              {t('hero_cta2', 'Consultation gratuite')}
            </Link>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-24" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in">
            <span className="font-bold uppercase tracking-widest text-sm mb-4 block" style={{ color: 'var(--accent)' }}>
              {t('why_us_tag', 'Pourquoi MoveSmart')}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-8" style={{ color: 'var(--text)' }}>
              {t('about_title_1', 'On sécurise votre capital')}
            </h2>
            <p className="mb-6 leading-relaxed" style={{ color: 'var(--text3)' }}>
              {t('why_us_p1', 'MoveSmart accompagne exclusivement les investisseurs internationaux sur le marché immobilier de Dubaï. Notre rôle : vous trouver les meilleures opportunités, négocier pour vous, et sécuriser chaque étape.')}
            </p>
            <p className="mb-10 leading-relaxed" style={{ color: 'var(--text3)' }}>
              {t('why_us_p2', 'Rendement locatif, achat sur plan, revente ou Golden Visa — nous gérons tout pour maximiser votre retour sur investissement.')}
            </p>
            
            <div className="grid grid-cols-3 gap-8 pt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <p className="text-3xl font-bold mb-2" style={{ color: 'var(--accent)' }}>500+</p>
                <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--text3)' }}>{t('stat_sold', 'Investissements réalisés')}</p>
              </div>
              <div>
                <p className="text-3xl font-bold mb-2" style={{ color: 'var(--accent)' }}>40+</p>
                <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--text3)' }}>{t('stat_nations', 'Nationalités')}</p>
              </div>
              <div>
                <p className="text-3xl font-bold mb-2" style={{ color: 'var(--accent)' }}>10 ans</p>
                <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--text3)' }}>{t('stat_years', 'Sur le marché')}</p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800&auto=format&fit=crop" 
              alt="Luxury Interior" 
              className="w-full h-[600px] object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute -bottom-10 -left-10 p-8 max-w-sm hidden md:block animate-fade-in" style={{ backgroundColor: 'var(--bg)' }}>
              <div className="flex gap-1 mb-4" style={{ color: 'var(--accent)' }}>
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>5.0/5</p>
              <p className="text-sm italic" style={{ color: 'var(--text3)' }}>"Service exceptionnel et accompagnement professionnel."</p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-bold uppercase tracking-widest text-sm mb-4 block" style={{ color: 'var(--accent)' }}>
              {t('services_tag', 'Nos Services')}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
              {t('services_title', 'Un accompagnement complet')}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Building, title: t('s1_title', 'Achat sur plan'), desc: t('s1_desc', 'Accès exclusif aux meilleurs projets off-plan avant ouverture publique.') },
              { icon: MapPin, title: t('s4_title', 'Golden Visa'), desc: t('s4_desc', 'Résidence 10 ans incluse dès 545,000 AED d\'investissement.') },
              { icon: Check, title: t('s2_title', 'Investissement locatif'), desc: t('s2_desc', 'Sélection des biens à fort rendement locatif 6–8% net par an.') },
              { icon: Phone, title: t('s3_title', 'Revente & plus-value'), desc: t('s3_desc', 'Stratégie de revente pour maximiser votre capital.') },
            ].map((service, index) => (
              <div key={index} className="p-8 transition-all duration-300 group hover:-translate-y-1" style={{ backgroundColor: 'var(--bg)' }}>
                <service.icon className="w-10 h-10 mb-6 group-hover:scale-110 transition-transform" strokeWidth={1} style={{ color: 'var(--accent)' }} />
                <h3 className="text-lg font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text)' }}>{service.title}</h3>
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
      <section className="py-32 text-center" style={{ backgroundColor: 'var(--accent)' }}>
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-wider mb-6 text-black">
            {t('cta_title_1', 'Votre investissement commence')} <span className="font-serif-italic lowercase text-white">{t('cta_title_em', 'aujourd\'hui.')}</span>
          </h2>
          <p className="text-lg mb-12 text-black/80">
            {t('cta_sub', 'Consultation gratuite. Notre expert analyse votre projet et vous propose les meilleures opportunités du marché.')}
          </p>
          <div className="flex justify-center gap-6">
            <Link 
              to="/contact" 
              className="px-8 py-4 font-bold uppercase tracking-widest text-sm transition-transform hover:scale-105 bg-black text-white"
              style={{ color: 'var(--accent)' }}
            >
              {t('cta_btn', 'Consultation gratuite')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
