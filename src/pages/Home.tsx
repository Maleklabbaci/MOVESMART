import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Square, MapPin, ArrowRight, Phone, CheckCircle, TrendingUp, Shield, Zap } from 'lucide-react';
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

function LeadForm() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', whatsapp: '', budget: '', goal: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Send to WhatsApp or Supabase
    const msg = encodeURIComponent(
      `🔥 Nouvelle demande MoveSmart\n\n👤 Nom: ${form.name}\n📱 WhatsApp: ${form.whatsapp}\n💰 Budget: ${form.budget}\n🎯 Objectif: ${form.goal}`
    );
    // Save to Supabase leads table (optional)
    try {
      await supabase.from('leads').insert({
        name: form.name, whatsapp: form.whatsapp, budget: form.budget, goal: form.goal
      });
    } catch (_) {}
    setLoading(false);
    setSuccess(true);
    // Open WhatsApp with pre-filled message
    setTimeout(() => {
      window.open(`https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}?text=${msg}`, '_blank');
    }, 800);
  };

  const inputClass = "w-full bg-[#0d0d0d] border border-white/10 focus:border-amber-400 outline-none px-4 py-3 text-white text-sm font-sans placeholder-gray-600 transition-colors duration-200";
  const selectClass = `${inputClass} cursor-pointer`;

  if (success) return (
    <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
      <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)' }}>
        <CheckCircle className="w-7 h-7 text-amber-400" />
      </div>
      <p className="text-white font-light text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t('lead_success')}</p>
      <p className="text-xs font-sans" style={{ color: '#4B5563' }}>{t('lead_privacy')}</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
          className={inputClass} placeholder={t('lead_name')} required />
        <input type="text" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })}
          className={inputClass} placeholder={t('lead_whatsapp')} required />
      </div>
      <select value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })}
        className={selectClass} style={{ background: '#0d0d0d' }} required>
        <option value="" className="bg-[#0d0d0d]">{t('lead_budget')}</option>
        <option value="<200k" className="bg-[#0d0d0d]">{t('lead_budget_1')}</option>
        <option value="200k-500k" className="bg-[#0d0d0d]">{t('lead_budget_2')}</option>
        <option value="500k-1m" className="bg-[#0d0d0d]">{t('lead_budget_3')}</option>
        <option value=">1m" className="bg-[#0d0d0d]">{t('lead_budget_4')}</option>
      </select>
      <select value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })}
        className={selectClass} style={{ background: '#0d0d0d' }} required>
        <option value="" className="bg-[#0d0d0d]">{t('lead_goal_select')}</option>
        <option value="rental" className="bg-[#0d0d0d]">{t('lead_goal_1')}</option>
        <option value="offplan" className="bg-[#0d0d0d]">{t('lead_goal_2')}</option>
        <option value="visa" className="bg-[#0d0d0d]">{t('lead_goal_3')}</option>
        <option value="diversify" className="bg-[#0d0d0d]">{t('lead_goal_4')}</option>
      </select>
      <button type="submit" disabled={loading}
        className="w-full py-4 text-sm font-sans font-bold tracking-[0.25em] uppercase hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-3"
        style={{ backgroundColor: '#FBBF24', color: '#000' }}>
        {loading ? t('lead_sending') : <><Phone className="w-4 h-4" />{t('lead_btn')}</>}
      </button>
      <p className="text-center text-xs font-sans" style={{ color: '#4B5563' }}>{t('lead_privacy')}</p>
    </form>
  );
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [listings, setListings] = useState<any[]>([]);
  const serif = { fontFamily: isRTL ? "'Cairo', serif" : "'Cormorant Garamond', Georgia, serif" };

  useEffect(() => {
    supabase.from('listings').select('*').order('created_at', { ascending: false }).limit(3)
      .then(({ data }) => setListings(data || []));
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] text-white" style={serif}>

      {/* ── HERO ── INVESTOR ANGLE ── */}
      <section className="relative h-[calc(100svh-64px)] sm:h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.pexels.com/photos/4531667/pexels-photo-4531667.jpeg"
            alt="Dubai" className="w-full h-full object-cover opacity-35" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/80 via-transparent to-[#080808]" />
        </div>

<div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center mt-24 md:mt-32">
  <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-12 bg-amber-400/50" />
            <span className="text-amber-400 text-xs font-sans font-light tracking-[0.4em] uppercase">{t('hero_tag')}</span>
            <div className="h-px w-12 bg-amber-400/50" />
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-light text-white leading-[0.9] tracking-tight mb-6">
            {t('hero_title_1')}<br />
            <em className="text-amber-400 not-italic">{t('hero_title_em')}</em>
            <br />{t('hero_title_2')}
          </h1>

          {/* ROI badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {['6–8% rendement', '0% impôt', 'Off-plan exclusif', 'Golden Visa'].map((tag) => (
              <span key={tag} className="text-xs font-sans px-3 py-1.5 tracking-wider"
                style={{ border: '1px solid rgba(251,191,36,0.25)', color: '#FBBF24', backgroundColor: 'rgba(251,191,36,0.06)' }}>
                {tag}
              </span>
            ))}
          </div>

          <p className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto mb-10 leading-relaxed font-sans font-light">
            {t('hero_sub')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Link to="/listings"
              className="group inline-flex items-center gap-3 px-8 py-3.5 text-xs font-sans font-bold tracking-[0.25em] uppercase hover:opacity-90 transition-all duration-300"
              style={{ backgroundColor: '#FBBF24', color: '#000' }}>
              {t('hero_cta')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-3.5 text-xs font-sans font-bold tracking-[0.25em] uppercase transition-all duration-300"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(251,191,36,0.5)'; e.currentTarget.style.color = '#FBBF24'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#fff'; }}>
              <Phone className="w-4 h-4" /> {t('hero_cta2')}
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-y border-white/[0.04] py-14 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { value: 500, suffix: '+', label: t('stat_sold') },
            { value: 40, suffix: '+', label: t('stat_nations') },
            { value: 10, suffix: '+', label: t('stat_years') },
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

      {/* ── WHY INVEST ── VALUE PROPS ── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-amber-400" />
              <span className="text-amber-400 text-xs font-sans tracking-[0.3em] uppercase">{t('why_invest_tag')}</span>
              <div className="h-px w-8 bg-amber-400" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-light mb-4">
              {t('why_invest_title')} <em className="not-italic text-amber-400">{t('why_invest_em')}</em>
            </h2>
            <p className="text-gray-500 font-sans font-light text-base max-w-xl mx-auto">{t('why_invest_sub')}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
            {[
              { icon: TrendingUp, val: t('vp1_title'), desc: t('vp1_desc') },
              { icon: Shield, val: t('vp2_title'), desc: t('vp2_desc') },
              { icon: Zap, val: t('vp3_title'), desc: t('vp3_desc') },
              { icon: ArrowRight, val: t('vp4_title'), desc: t('vp4_desc') },
            ].map((v, i) => (
              <div key={i} className="p-8 text-center transition-colors duration-300 group"
                style={{ backgroundColor: '#080808' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0d0d0d')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#080808')}>
                <v.icon className="w-6 h-6 mx-auto mb-4 text-amber-400/50 group-hover:text-amber-400 transition-colors" />
                <div className="text-base sm:text-lg font-light text-white mb-2">{v.val}</div>
                <p className="text-xs font-sans font-light leading-relaxed" style={{ color: '#4B5563' }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY MOVESMART ── */}
      <section className="py-28 px-6" style={{ backgroundColor: '#050505' }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8 bg-amber-400" />
              <span className="text-amber-400 text-xs font-sans tracking-[0.3em] uppercase">{t('why_us_tag')}</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-light leading-tight mb-4">
              {t('why_us_title')}<br />
              <em className="not-italic text-amber-400">{t('why_us_em')}</em>
            </h2>
            <p className="text-xl font-light text-gray-300 mb-8 italic">{t('why_us_sub')}</p>
            <p className="text-gray-500 leading-relaxed mb-5 font-sans font-light text-sm sm:text-base">{t('why_us_p1')}</p>
            <p className="text-gray-500 leading-relaxed font-sans font-light text-sm sm:text-base mb-10">{t('why_us_p2')}</p>
            <Link to="/about"
              className="inline-flex items-center gap-3 text-amber-400 text-xs font-sans tracking-[0.25em] uppercase hover:gap-5 transition-all duration-300">
              {t('why_us_link')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative">
            <div className="aspect-[3/4] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=800&auto=format&fit=crop"
                alt="Dubai Investment" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                loading="lazy" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute -bottom-5 -right-5 w-28 h-28 hidden md:block" style={{ border: '1px solid rgba(251,191,36,0.1)' }} />
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-28 px-6">
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
              <div key={s.num} className="p-8 sm:p-10 transition-colors duration-300"
                style={{ backgroundColor: '#080808' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0d0d0d')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#080808')}>
                <div className="text-xs font-sans tracking-[0.4em] mb-8" style={{ color: 'rgba(251,191,36,0.3)' }}>{s.num}</div>
                <h3 className="text-lg sm:text-xl font-light mb-4">{s.title}</h3>
                <p className="text-xs sm:text-sm font-sans font-light leading-relaxed" style={{ color: '#4B5563' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LISTINGS ── */}
      <section className="py-28 px-6" style={{ backgroundColor: '#050505' }}>
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
                  <h3 className="text-xl font-light mb-3 group-hover:text-amber-400 transition-colors duration-300">{l.title}</h3>
                  <div className="flex items-center gap-4 text-xs font-sans mb-4" style={{ color: '#4B5563' }}>
                    <span className="flex items-center gap-1.5"><Bed className="w-3.5 h-3.5" /> {l.beds}</span>
                    <span className="flex items-center gap-1.5"><Bath className="w-3.5 h-3.5" /> {l.baths}</span>
                    <span className="flex items-center gap-1.5"><Square className="w-3.5 h-3.5" /> {l.area?.toLocaleString()} sqft</span>
                  </div>
                  <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="text-2xl font-light" style={{ color: '#FBBF24' }}>AED {l.price?.toLocaleString()}</div>
                    <span className="text-xs font-sans tracking-widest uppercase group-hover:text-amber-400 transition-colors" style={{ color: '#4B5563' }}>{t('view_detail')}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── ROI SECTION ── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-amber-400" />
              <span className="text-amber-400 text-xs font-sans tracking-[0.3em] uppercase">{t('roi_tag')}</span>
              <div className="h-px w-8 bg-amber-400" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-light mb-4">
              {t('roi_title')} <em className="not-italic text-amber-400">{t('roi_em')}</em>
            </h2>
            <p className="text-gray-500 font-sans font-light" >{t('roi_sub')}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px mb-16" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
            {[
              { val: t('roi_1_val'), label: t('roi_1_label'), desc: t('roi_1_desc') },
              { val: t('roi_2_val'), label: t('roi_2_label'), desc: t('roi_2_desc') },
              { val: t('roi_3_val'), label: t('roi_3_label'), desc: t('roi_3_desc') },
              { val: t('roi_4_val'), label: t('roi_4_label'), desc: t('roi_4_desc') },
            ].map((r, i) => (
              <div key={i} className="p-8 text-center transition-colors duration-300"
                style={{ backgroundColor: '#080808' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0d0d0d')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#080808')}>
                <div className="text-4xl sm:text-5xl font-light mb-3" style={{ color: '#FBBF24' }}>{r.val}</div>
                <div className="text-sm font-light mb-2 text-white">{r.label}</div>
                <div className="text-xs font-sans font-light" style={{ color: '#4B5563' }}>{r.desc}</div>
              </div>
            ))}
          </div>
          {/* Developer logos */}
          <div className="text-center">
            <div className="text-xs font-sans tracking-[0.3em] uppercase mb-8" style={{ color: '#374151' }}>{t('partners_label')}</div>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14">
              {['SOBHA', 'ELLINGTON', 'DAMAC', 'EMAAR', 'NAKHEEL'].map((dev) => (
                <span key={dev} className="text-sm font-sans font-light tracking-[0.3em] uppercase transition-colors duration-300"
                  style={{ color: '#374151' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#FBBF24')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#374151')}>
                  {dev}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── URGENCY + PROCESS ── */}
      <section className="py-20 px-6" style={{ backgroundColor: '#050505' }}>
        <div className="max-w-6xl mx-auto">
          {/* Urgency banner */}
          <div className="mb-16 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            style={{ border: '1px solid rgba(251,191,36,0.2)', backgroundColor: 'rgba(251,191,36,0.04)' }}>
            <div className="flex items-center gap-4">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
              <div>
                <div className="text-xs font-sans tracking-[0.3em] uppercase text-amber-400 mb-1">{t('urgency_badge')}</div>
                <p className="text-white font-light text-base sm:text-lg">{t('urgency_msg')}</p>
              </div>
            </div>
            <Link to="/listings"
              className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 text-xs font-sans font-bold tracking-[0.2em] uppercase transition-all duration-300"
              style={{ backgroundColor: '#FBBF24', color: '#000' }}>
              {t('urgency_cta')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Process */}
          <div className="flex items-center gap-3 mb-10">
            <div className="h-px w-8 bg-amber-400" />
            <span className="text-amber-400 text-xs font-sans tracking-[0.3em] uppercase">{t('process_tag')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light mb-12">{t('process_title')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: t('p1_title'), desc: t('p1_desc') },
              { step: '02', title: t('p2_title'), desc: t('p2_desc') },
              { step: '03', title: t('p3_title'), desc: t('p3_desc') },
              { step: '04', title: t('p4_title'), desc: t('p4_desc') },
            ].map((p) => (
              <div key={p.step} className="relative">
                <div className="text-5xl font-light mb-4" style={{ color: 'rgba(251,191,36,0.1)' }}>{p.step}</div>
                <h4 className="text-lg font-light text-white mb-2">{p.title}</h4>
                <p className="text-xs font-sans font-light leading-relaxed" style={{ color: '#4B5563' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEAD CAPTURE FORM ── */}
      <section className="py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-amber-400" />
              <span className="text-amber-400 text-xs font-sans tracking-[0.3em] uppercase">{t('lead_tag')}</span>
              <div className="h-px w-8 bg-amber-400" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-light mb-4">
              {t('lead_title')}<br />
              <em className="not-italic text-amber-400">{t('lead_em')}</em>
            </h2>
            <p className="text-gray-500 font-sans font-light text-base">{t('lead_sub')}</p>
          </div>
          <div className="p-8 sm:p-10" style={{ border: '1px solid rgba(255,255,255,0.06)', backgroundColor: '#0d0d0d' }}>
            <LeadForm />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-36 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.pexels.com/photos/4531667/pexels-photo-4531667.jpeg"
            alt="" className="w-full h-full object-cover" style={{ opacity: 0.1 }} referrerPolicy="no-referrer" />
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

      {/* ── FOOTER ── */}
      <footer className="py-16 px-6" style={{ backgroundColor: '#030303', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div className="lg:col-span-2">
              <div className="text-xl font-light text-white mb-4">MoveSmart<em className="not-italic text-amber-400"> Invest</em></div>
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
                  <li key={href}><Link to={href} className="hover:text-amber-400 transition-colors">{label}</Link></li>
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
