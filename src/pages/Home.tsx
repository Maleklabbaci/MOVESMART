import React from 'react';
import { Link } from 'react-router-dom';
import { Building, MapPin, Check, Phone, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // Import de la traduction
import FAQ from '../components/FAQ';
import Testimonials from '../components/Testimonials';

export default function Home() {
  const { t } = useTranslation(); // Utilisation de t pour traduire

  return (
    <div>
      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/4531667/pexels-photo-4531667.jpeg" 
            alt="Dubai Skyline" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ backgroundColor: 'var(--bg, #000000)', opacity: 0.6 }}></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
          <span className="font-bold tracking-[0.3em] uppercase text-sm mb-6 block" style={{ color: 'var(--accent)' }}>
            MoveSmart
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-wider uppercase leading-tight" style={{ color: '#ffffff' }}>
            {t('hero_title_1', 'Investir à')} <br/>
            <span style={{ color: 'var(--accent)' }}>{t('hero_title_em', 'Dubaï.')}</span>
          </h1>
          <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed" style={{ color: '#e5e7eb' }}>
            {t('hero_sub', 'Découvrez une sélection exclusive de propriétés de luxe. Investissement immobilier, visa résidence et accompagnement premium.')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to="/listings" 
              className="w-full sm:w-auto px-8 py-4 font-bold uppercase tracking-widest text-sm transition-colors"
              style={{ backgroundColor: 'var(--accent)', color: '#000000' }}
            >
              {t('hero_cta', 'Nos Propriétés')}
            </Link>
            <Link 
              to="/contact" 
              className="w-full sm:w-auto px-8 py-4 bg-transparent border text-white font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-colors"
              style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#ffffff' }}
            >
              {t('hero_cta2', 'Contact')}
            </Link>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-24" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="font-bold uppercase tracking-widest text-sm mb-4 block" style={{ color: 'var(--accent)' }}>
              {t('about_tag', 'À Propos')}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-8" style={{ color: 'var(--text)' }}>
              {t('about_title_1', 'Votre Partenaire Immobilier à Dubai')}
            </h2>
            <p className="mb-6 leading-relaxed" style={{ color: 'var(--text3)' }}>
              {t('about_p1', 'MoveSmart accompagne les investisseurs internationaux dans l\'acquisition de biens immobiliers d\'exception à Dubai. Notre connaissance approfondie du marché et notre réseau exclusif vous ouvrent les portes des résidences les plus prestigieuses.')}
            </p>
            <p className="mb-10 leading-relaxed" style={{ color: 'var(--text3)' }}>
              {t('about_p2', 'Nous offrons un service complet : recherche personnalisée, accompagnement juridique, obtention du visa résidence et gestion locative.')}
            </p>
            
            <div className="grid grid-cols-3 gap-8 pt-10" style={{ borderTop: '1px solid var(--border)' }}>
              <div>
                <p className="text-3xl font-bold mb-2" style={{ color: 'var(--accent)' }}>500+</p>
                <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--text3)' }}>{t('stat_sold', 'Biens vendus')}</p>
              </div>
              <div>
                <p className="text-3xl font-bold mb-2" style={{ color: 'var(--accent)' }}>40+</p>
                <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--text3)' }}>{t('stat_nations', 'Nationalités')}</p>
              </div>
              <div>
                <p className="text-3xl font-bold mb-2" style={{ color: 'var(--accent)' }}>10 ans</p>
                <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--text3)' }}>{t('stat_years', 'D\'expertise')}</p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800&auto=format&fit=crop" 
              alt="Luxury Interior" 
              className="w-full h-[600px] object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute -bottom-10 -left-10 p-8 max-w-sm hidden md:block" style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}>
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
      <section className="py-24" style={{ backgroundColor: 'var(--bg)', filter: 'brightness(0.95)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-bold uppercase tracking-widest text-sm mb-4 block" style={{ color: 'var(--accent)' }}>
              {t('services_tag', 'Nos Services')}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
              {t('services_title', 'Une Expertise Complète')}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Building, title: t('s1_title', 'Recherche de biens'), desc: t('s1_desc', 'Sélection personnalisée selon vos critères d\'investissement.') },
              { icon: MapPin, title: t('s4_title', 'Visa résidence'), desc: t('s4_desc', 'Accompagnement complet pour le Golden Visa 10 ans.') },
              { icon: Check, title: t('s2_title', 'Gestion locative'), desc: t('s2_desc', 'Optimisation du rendement et gestion professionnelle.') },
              { icon: Phone, title: t('s3_title', 'Suivi juridique'), desc: t('s3_desc', 'Vérification des titres et accompagnement notarial.') },
            ].map((service, index) => (
              <div key={index} className="p-8 border hover:border-amber-500/30 transition-colors group" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
                <service.icon className="w-10 h-10 mb-6 group-hover:scale-110 transition-transform" strokeWidth={1} style={{ color: 'var(--accent)' }} />
                <h3 className="text-xl font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text)' }}>{service.title}</h3>
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
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-wider mb-8" style={{ color: '#000000' }}>
            {t('cta_title_1', 'Commencez Votre Investissement')}
          </h2>
          <p className="text-lg mb-12" style={{ color: 'rgba(0,0,0,0.7)' }}>
            {t('cta_sub', 'Notre équipe d\'experts est à votre disposition pour étudier vos opportunités d\'investissement à Dubai.')}
          </p>
          <div className="flex justify-center gap-6">
            <Link 
              to="/contact" 
              className="px-8 py-4 font-bold uppercase tracking-widest text-sm transition-colors hover:opacity-80"
              style={{ backgroundColor: '#000000', color: 'var(--accent)' }}
            >
              {t('cta_btn', 'Prendre Rendez-vous')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}