import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Square, MapPin, ArrowRight, Phone, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { companyInfo } from '../constants';

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
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('listings').select('*').order('created_at', { ascending: false }).limit(3)
      .then(({ data }) => setListings(data || []));
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] text-white" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>

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
            <span className="text-amber-400 text-xs font-sans font-light tracking-[0.5em] uppercase">MoveSmart Consultancy · Dubai</span>
            <div className="h-px w-12 bg-amber-400/50" />
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[110px] font-light text-white leading-[0.88] tracking-tight mb-8">
            L'Art de<br />
            <em className="text-amber-400 not-italic">Vivre</em>
            <br />à Dubaï
          </h1>

          <p className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto mb-12 leading-relaxed font-sans font-light tracking-wide">
            Propriétés d'exception, accompagnement sur-mesure,<br />visa résidence & investissement premium.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Link to="/listings"
              className="group inline-flex items-center gap-3 bg-amber-400 text-black px-8 py-3.5 text-xs font-sans font-bold tracking-[0.25em] uppercase hover:bg-amber-300 transition-all duration-300">
              Découvrir les biens
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/contact"
              className="inline-flex items-center gap-3 border border-white/15 text-white px-8 py-3.5 text-xs font-sans font-bold tracking-[0.25em] uppercase hover:border-amber-400/60 hover:text-amber-400 transition-all duration-300">
              Nous contacter
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-amber-400/50" />
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-white/[0.04] py-14 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[{ value: 500, suffix: '+', label: 'Biens vendus' }, { value: 40, suffix: '+', label: 'Nationalités' }, { value: 10, suffix: ' ans', label: "D'expertise" }].map((s, i) => (
            <div key={i}>
              <div className="text-3xl sm:text-5xl font-light text-amber-400 mb-2">
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div className="text-xs font-sans text-gray-600 tracking-[0.25em] uppercase">{s.label}</div>
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
              <span className="text-amber-400 text-xs font-sans tracking-[0.3em] uppercase">Notre Vision</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-light leading-tight mb-8">
              Votre partenaire<br /><em className="not-italic text-amber-400">360°</em> à Dubaï
            </h2>
            <p className="text-gray-500 leading-relaxed mb-5 font-sans font-light text-sm sm:text-base">
              MoveSmart accompagne les investisseurs internationaux dans l'acquisition de biens immobiliers d'exception à Dubaï.
            </p>
            <p className="text-gray-500 leading-relaxed font-sans font-light text-sm sm:text-base mb-10">
              Recherche personnalisée, accompagnement juridique, visa résidence et gestion locative.
            </p>
            <Link to="/about" className="inline-flex items-center gap-3 text-amber-400 text-xs font-sans tracking-[0.25em] uppercase hover:gap-5 transition-all duration-300">
              En savoir plus <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative">
            <div className="aspect-[3/4] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800&auto=format&fit=crop"
                alt="Luxury Interior" className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                loading="lazy" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute -bottom-5 -right-5 w-28 h-28 border border-amber-400/10 hidden md:block" />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-28 sm:py-36 px-6 bg-[#050505]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-amber-400" />
              <span className="text-amber-400 text-xs font-sans tracking-[0.3em] uppercase">Services</span>
              <div className="h-px w-8 bg-amber-400" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-light">Une expertise complète</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.04]">
            {[
              { num: '01', title: 'Recherche de biens', desc: "Sélection personnalisée selon vos critères d'investissement." },
              { num: '02', title: 'Visa résidence', desc: 'Accompagnement complet pour le Golden Visa 10 ans.' },
              { num: '03', title: 'Gestion locative', desc: 'Optimisation du rendement et gestion professionnelle.' },
              { num: '04', title: 'Suivi juridique', desc: 'Vérification des titres et accompagnement notarial.' },
            ].map((s) => (
              <div key={s.num} className="bg-[#050505] p-8 sm:p-10 group hover:bg-[#0a0a0a] transition-colors duration-300">
                <div className="text-amber-400/30 text-xs font-sans tracking-[0.4em] mb-8 group-hover:text-amber-400 transition-colors duration-300">{s.num}</div>
                <h3 className="text-lg sm:text-xl font-light mb-4">{s.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm font-sans font-light leading-relaxed">{s.desc}</p>
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
                <span className="text-amber-400 text-xs font-sans tracking-[0.3em] uppercase">Sélection exclusive</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-light">Propriétés<br /><em className="not-italic text-amber-400">en vedette</em></h2>
            </div>
            <Link to="/listings" className="inline-flex items-center gap-3 text-gray-500 text-xs font-sans tracking-[0.25em] uppercase hover:text-amber-400 hover:gap-5 transition-all duration-300 self-start sm:self-end">
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {listings.length === 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="aspect-[4/3] bg-white/[0.03] animate-pulse" />)}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {listings.map((l: any) => (
                <Link to={`/listings/${l.id}`} key={l.id} className="group block">
                  <div className="aspect-[4/3] overflow-hidden bg-white/[0.03] mb-5 relative">
                    {l.images?.[0]
                      ? <img src={l.images[0]} alt={l.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                      : <div className="w-full h-full flex items-center justify-center text-gray-700 text-xs font-sans">No image</div>
                    }
                    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1">
                      <span className="text-amber-400 text-xs font-sans tracking-widest uppercase">{l.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-xs font-sans mb-2">
                    <MapPin className="w-3 h-3" />{l.location}
                  </div>
                  <h3 className="text-xl font-light mb-3 group-hover:text-amber-400 transition-colors duration-300">{l.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-gray-600 font-sans mb-4">
                    <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {l.beds} ch.</span>
                    <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {l.baths} sdb.</span>
                    <span className="flex items-center gap-1"><Square className="w-3.5 h-3.5" /> {l.area?.toLocaleString()} sqft</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                    <div className="text-2xl font-light text-amber-400">AED {l.price?.toLocaleString()}</div>
                    <span className="text-xs font-sans text-gray-600 tracking-widest uppercase group-hover:text-amber-400 transition-colors">Voir →</span>
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
            alt="" className="w-full h-full object-cover opacity-[0.08]" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808] to-[#080808]/90" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8 bg-amber-400" />
            <span className="text-amber-400 text-xs font-sans tracking-[0.3em] uppercase">Commencer</span>
          </div>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-light leading-[0.9] mb-10">
            Investissez<br />à <em className="not-italic text-amber-400">Dubaï</em><br />dès aujourd'hui.
          </h2>
          <p className="text-gray-500 font-sans font-light text-base mb-12 max-w-md leading-relaxed">
            Notre équipe d'experts vous accompagne de A à Z dans votre projet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/contact"
              className="inline-flex items-center justify-center gap-3 bg-amber-400 text-black px-10 py-4 text-xs font-sans font-bold tracking-[0.25em] uppercase hover:bg-amber-300 transition-all duration-300">
              Prendre rendez-vous
            </Link>
            <a href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 border border-white/10 text-white px-10 py-4 text-xs font-sans font-bold tracking-[0.25em] uppercase hover:border-amber-400/40 hover:text-amber-400 transition-all duration-300">
              <Phone className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#030303] border-t border-white/[0.04] py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div className="lg:col-span-2">
              <div className="text-xl font-light text-white mb-4">MoveSmart<em className="not-italic text-amber-400"> Invest</em></div>
              <p className="text-gray-600 text-xs font-sans font-light leading-relaxed mb-6 max-w-sm">{companyInfo.description}</p>
              <div className="flex items-center gap-2 text-xs text-gray-600 font-sans">
                <MapPin className="w-3.5 h-3.5 text-amber-400" /> {companyInfo.location}
              </div>
            </div>
            <div>
              <div className="text-xs font-sans text-gray-600 tracking-[0.3em] uppercase mb-6">Navigation</div>
              <ul className="space-y-3 text-sm font-sans text-gray-600">
                {[['/', 'Accueil'], ['/listings', 'Propriétés'], ['/about', 'À Propos'], ['/contact', 'Contact']].map(([href, label]) => (
                  <li key={href}><Link to={href} className="hover:text-amber-400 transition-colors duration-200">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-sans text-gray-600 tracking-[0.3em] uppercase mb-6">Contact</div>
              <ul className="space-y-3 text-sm font-sans text-gray-600">
                <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-amber-400" />{companyInfo.whatsapp}</li>
                <li className="text-xs">contact@movesmartinvest.com</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-700 font-sans">© 2026 MoveSmart Invest. Tous droits réservés.</p>
            <div className="flex gap-6 text-xs text-gray-700 font-sans">
              <a href="#" className="hover:text-amber-400 transition-colors">Mentions légales</a>
              <a href="#" className="hover:text-amber-400 transition-colors">Confidentialité</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
