import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Square, MapPin, ArrowRight, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { companyInfo } from '../constants';
import { useTranslation } from 'react-i18next';

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('listings').select('*').order('created_at', { ascending: false }).limit(3)
      .then(({ data }) => setListings(data || []));
  }, []);

  const serif = { fontFamily: isRTL ? "'Cairo', serif" : "'Cormorant Garamond', Georgia, serif" };

  return (
    <div className="min-h-screen bg-[#080808] text-white" style={serif}>

      {/* HERO */}
      <section className="relative h-[calc(100svh-64px)] sm:h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.pexels.com/photos/4531667/pexels-photo-4531667.jpeg"
            alt="Dubai" className="w-full h-full object-cover opacity-35" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/80 via-transparent to-[#080808]" />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-12 bg-amber-400/50" />
            <span className="text-amber-400 text-xs font-sans font-light tracking-[0.4em] uppercase">{t('hero_tag')}</span>
            <div className="h-px w-12 bg-amber-400/50" />
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-light text-white leading-[0.9] tracking-tight mb-8">
            {t('hero_title_1')}<br />
            <em className="text-amber-400 not-italic">{t('hero_title_em')}</em>
            <br />{t('hero_title_2')}
          </h1>

          <p className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto mb-12 leading-relaxed font-sans font-light tracking-wide">
            {t('hero_sub')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Link to="/listings"
              className="group inline-flex items-center gap-3 px-8 py-3.5 text-xs font-sans font-bold tracking-[0.25em] uppercase hover:opacity-90 transition-all duration-300"
              style={{ backgroundColor: '#FBBF24', color: '#000' }}>
              {t('hero_cta')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/contact"
              className="inline-flex items-center gap-3 px-8 py-3.5 text-xs font-sans font-bold tracking-[0.25em] uppercase transition-all duration-300"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(251,191,36,0.5)'; e.currentTarget.style.color = '#FBBF24'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#fff'; }}>
              {t('hero_cta2')}
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-amber-400/50" />
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-white/[0.04] py-14 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { value: 500, suffix: '+', label: t('stat_sold') },
            { value: 40, suffix: '+', label: t('stat_nations') },
            { value: 10, suffix: isRTL ? '' : ' ans', label: t('stat_years') },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-3xl sm:text-5xl font-light mb-2" style={{ color: '#FBBF24' }}>
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div className="text-xs font-sans tracking-[0.25em] uppercase" style={{ color: '#4B5563' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-28 sm:py-36 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8 bg-amber-400" />
              <span className="text-amber-400 text-xs font-sans tracking-[0.3em] uppercase">{t('about_tag')}</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-light leading-tight mb-8">
              {t('about_title_1')}<br />
              <em className="not-italic text-amber-400">{t('about_title_em')}</em> {t('about_title_2')}
            </h2>
            <p className="text-gray-500 leading-relaxed mb-5 font-sans font-light text-sm sm:text-base">{t('about_p1')}</p>
            <p className="text-gray-500 leading-relaxed font-sans font-light text-sm sm:text-base mb-10">{t('about_p2')}</p>
            <Link to="/about"
              className="inline-flex items-center gap-3 text-amber-400 text-xs font-sans tracking-[0.25em] uppercase hover:gap-5 transition-all duration-300">
              {t('about_link')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative">
            <div className="aspect-[3/4] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800&auto=format&fit=crop"
                alt="Luxury Interior" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                loading="lazy" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute -bottom-5 -right-5 w-28 h-28 hidden md:block" style={{ border: '1px solid rgba(251,191,36,0.1)' }} />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-28 sm:py-36 px-6" style={{ backgroundColor: '#050505' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-amber-400" />
              <span className="text-amber-400 text-xs font-sans tracking-[0.3em] uppercase">{t('services_tag')}</span>
              <div className="h-px w-8 bg-amber-400" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-light">{t('services_title')}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
            {[
              { num: '01', title: t('s1_title'), desc: t('s1_desc') },
              { num: '02', title: t('s2_title'), desc: t('s2_desc') },
              { num: '03', title: t('s3_title'), desc: t('s3_desc') },
              { num: '04', title: t('s4_title'), desc: t('s4_desc') },
            ].map((s) => (
              <div key={s.num} className="p-8 sm:p-10 group transition-colors duration-300"
                style={{ backgroundColor: '#050505' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0a0a0a')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#050505')}>
                <div className="text-xs font-sans tracking-[0.4em] mb-8 transition-colors duration-300"
                  style={{ color: 'rgba(251,191,36,0.3)' }}
                  ref={el => { if (el) { el.addEventListener('mouseenter', () => el.style.color = '#FBBF24'); el.addEventListener('mouseleave', () => el.style.color = 'rgba(251,191,36,0.3)'); } }}>
                  {s.num}
                </div>
                <h3 className="text-lg sm:text-xl font-light mb-4">{s.title}</h3>
                <p className="text-xs sm:text-sm font-sans font-light leading-relaxed" style={{ color: '#4B5563' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LISTINGS */}
      <section className="py-28 sm:py-36 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-amber-400" />
                <span className="text-amber-400 text-xs font-sans tracking-[0.3em] uppercase">{t('listings_tag')}</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-light">
                {t('listings_title_1')}<br />
                <em className="not-italic text-amber-400">{t('listings_title_em')}</em>
              </h2>
            </div>
            <Link to="/listings"
              className="inline-flex items-center gap-3 text-xs font-sans tracking-[0.25em] uppercase hover:gap-5 transition-all duration-300 self-start sm:self-end"
              style={{ color: '#9CA3AF' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#FBBF24')}
              onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}>
              {t('listings_see_all')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {listings.length === 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="aspect-[4/3] animate-pulse" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }} />)}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {listings.map((l: any) => (
                <Link to={`/listings/${l.id}`} key={l.id} className="group block">
                  <div className="aspect-[4/3] overflow-hidden mb-5 relative" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                    {l.images?.[0]
                      ? <img src={l.images[0]} alt={l.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                      : <div className="w-full h-full flex items-center justify-center text-xs font-sans" style={{ color: '#374151' }}>{t('listings_no_img')}</div>
                    }
                    <div className="absolute top-4 left-4 px-3 py-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                      <span className="text-amber-400 text-xs font-sans tracking-widest uppercase">{l.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-sans mb-2" style={{ color: '#4B5563' }}>
                    <MapPin className="w-3 h-3" />{l.location}
                  </div>
                  <h3 className="text-xl font-light mb-3 transition-colors duration-300 group-hover:text-amber-400">{l.title}</h3>
                  <div className="flex items-center gap-4 text-xs font-sans mb-4" style={{ color: '#4B5563' }}>
                    <span className="flex items-center gap-1.5"><Bed className="w-3.5 h-3.5" /> {l.beds}</span>
                    <span className="flex items-center gap-1.5"><Bath className="w-3.5 h-3.5" /> {l.baths}</span>
                    <span className="flex items-center gap-1.5"><Square className="w-3.5 h-3.5" /> {l.area?.toLocaleString()} sqft</span>
                  </div>
                  <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="text-2xl font-light" style={{ color: '#FBBF24' }}>AED {l.price?.toLocaleString()}</div>
                    <span className="text-xs font-sans tracking-widest uppercase transition-colors group-hover:text-amber-400" style={{ color: '#4B5563' }}>{t('view_detail')}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-36 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1600&auto=format&fit=crop"
            alt="" className="w-full h-full object-cover" style={{ opacity: 0.08 }} referrerPolicy="no-referrer" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #080808, rgba(8,8,8,0.9))' }} />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8 bg-amber-400" />
            <span className="text-amber-400 text-xs font-sans tracking-[0.3em] uppercase">{t('cta_tag')}</span>
          </div>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-light leading-[0.9] mb-10">
            {t('cta_title_1')}<br />
            {t('cta_title_2')} <em className="not-italic text-amber-400">{t('cta_title_em')}</em><br />
            {t('cta_title_3')}
          </h2>
          <p className="font-sans font-light text-base mb-12 max-w-md leading-relaxed" style={{ color: '#6B7280' }}>{t('cta_sub')}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/contact"
              className="inline-flex items-center justify-center gap-3 px-10 py-4 text-xs font-sans font-bold tracking-[0.25em] uppercase hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#FBBF24', color: '#000' }}>
              {t('cta_btn')}
            </Link>
            <a href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-10 py-4 text-xs font-sans font-bold tracking-[0.25em] uppercase transition-all duration-300"
              style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(251,191,36,0.4)'; e.currentTarget.style.color = '#FBBF24'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}>
              <Phone className="w-4 h-4" /> {t('cta_wa')}
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-6" style={{ backgroundColor: '#030303', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div className="lg:col-span-2">
              <div className="text-xl font-light text-white mb-4">
                MoveSmart<em className="not-italic text-amber-400"> Invest</em>
              </div>
              <p className="text-xs font-sans font-light leading-relaxed mb-6 max-w-sm" style={{ color: '#4B5563' }}>
                {companyInfo.description}
              </p>
              <div className="flex items-center gap-2 text-xs font-sans" style={{ color: '#4B5563' }}>
                <MapPin className="w-3.5 h-3.5 text-amber-400" /> {companyInfo.location}
              </div>
            </div>
            <div>
              <div className="text-xs font-sans tracking-[0.3em] uppercase mb-6" style={{ color: '#4B5563' }}>{t('footer_nav')}</div>
              <ul className="space-y-3 text-sm font-sans" style={{ color: '#4B5563' }}>
                {[['/', t('home')], ['/listings', t('listings')], ['/about', t('about')], ['/contact', t('contact')]].map(([href, label]) => (
                  <li key={href}>
                    <Link to={href} className="hover:text-amber-400 transition-colors duration-200">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-sans tracking-[0.3em] uppercase mb-6" style={{ color: '#4B5563' }}>{t('footer_contact')}</div>
              <ul className="space-y-3 text-sm font-sans" style={{ color: '#4B5563' }}>
                <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-amber-400" />{companyInfo.whatsapp}</li>
                <li className="text-xs">contact@movesmartinvest.com</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <p className="text-xs font-sans" style={{ color: '#374151' }}>© 2026 MoveSmart Invest. {t('footer_rights')}</p>
            <div className="flex gap-6 text-xs font-sans" style={{ color: '#374151' }}>
              <a href="#" className="hover:text-amber-400 transition-colors">{t('footer_legal')}</a>
              <a href="#" className="hover:text-amber-400 transition-colors">{t('footer_privacy')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
