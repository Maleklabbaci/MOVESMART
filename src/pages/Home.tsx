import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bed, Bath, Square, MapPin, ArrowRight, Phone, Check, Building, Star, Menu, X } from 'lucide-react';
import { listings } from '../data/listings';
import { companyInfo } from '../constants';
import { useTranslation } from 'react-i18next';

function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { i18n, t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = isHome && !isScrolled;

  const toggleLang = () => i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en');

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 ${
      isTransparent ? 'bg-transparent' : 'bg-white shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center">
        
        {/* Logo - LEFT (flex-shrink-0 pour ne pas rétrécir) */}
        <div className="flex-shrink-0">
          <Link to="/">
            <img 
              src="https://i.ibb.co/60PJ8PVw/aass.png" 
              alt={companyInfo.brand} 
              className={`h-8 md:h-10 w-auto transition-all duration-300 ${
                isTransparent ? '' : 'brightness-0'
              }`}
            />
          </Link>
        </div>

        {/* Navigation - CENTERED (flex-1 prend l'espace restant, justify-center centre) */}
        <nav className={`flex-1 flex items-center justify-center gap-8 text-sm font-semibold tracking-wider uppercase ${
          isTransparent ? 'text-white' : 'text-gray-900'
        }`}>
          <Link to="/" className="hover:text-amber-500 transition-colors">{t('home', 'Accueil')}</Link>
          <Link to="/listings" className="hover:text-amber-500 transition-colors">{t('listings', 'Biens')}</Link>
          <Link to="/about" className="hover:text-amber-500 transition-colors">{t('about', 'À Propos')}</Link>
          <Link to="/contact" className="hover:text-amber-500 transition-colors">{t('contact', 'Contact')}</Link>
        </nav>

        {/* Right Side - Button + Lang (flex-shrink-0 pour ne pas rétrécir) */}
        <div className="flex-shrink-0 flex items-center gap-4">
          <button 
            onClick={toggleLang}
            className={`hidden md:block text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded border transition-colors ${
              isTransparent 
                ? 'border-white/40 text-white hover:bg-white/10' 
                : 'border-gray-300 text-gray-900 hover:bg-gray-100'
            }`}
          >
            {i18n.language === 'en' ? 'FR' : 'EN'}
          </button>
          
          <Link 
            to="/contact"
            className={`hidden md:inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
              isTransparent 
                ? 'bg-amber-500 text-black hover:bg-amber-400' 
                : 'bg-gray-900 text-white hover:bg-amber-500 hover:text-black'
            }`}
          >
            {t('getStarted', 'Contact')}
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className={`md:hidden p-2 ${isTransparent ? 'text-white' : 'text-gray-900'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white shadow-lg border-t">
          <nav className="flex flex-col p-6 gap-4">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-gray-900 uppercase tracking-wider hover:text-amber-600">Accueil</Link>
            <Link to="/listings" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-gray-900 uppercase tracking-wider hover:text-amber-600">Biens</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-gray-900 uppercase tracking-wider hover:text-amber-600">À Propos</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-gray-900 uppercase tracking-wider hover:text-amber-600">Contact</Link>
            <div className="pt-4 border-t flex items-center gap-4">
              <button onClick={toggleLang} className="text-xs font-semibold text-gray-900 uppercase">
                {i18n.language === 'en' ? 'FR' : 'EN'}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const featuredListings = listings.slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* ==================== HERO ==================== */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/4531667/pexels-photo-4531667.jpeg"
            alt="Dubai Skyline"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center px-6 pt-20">
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="h-px w-12 bg-amber-500" />
            <span className="text-amber-500 text-xs tracking-[0.3em] uppercase font-medium">MoveSmart Consultancy</span>
            <div className="h-px w-12 bg-amber-500" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            L'Art de Vivre<br />
            <span className="text-amber-500">à Dubai</span>
          </h1>
          
          <p className="text-base sm:text-lg text-gray-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Découvrez une sélection exclusive de propriétés de luxe. 
            Investissement immobilier, visa résidence et accompagnement premium.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/listings"
              className="inline-flex items-center justify-center gap-2 bg-amber-500 text-black px-10 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-amber-400 transition-all duration-300"
            >
              Nos Propriétés
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-transparent text-white border border-white/40 px-10 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-white/10 transition-all duration-300"
            >
              Contact
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <div className="h-20 bg-gradient-to-t from-white to-transparent" />
        </div>
      </section>

      {/* ==================== INTRO ==================== */}
      <section className="py-24 sm:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-amber-500" />
                <span className="text-amber-600 text-xs tracking-[0.2em] uppercase font-semibold">À Propos</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Votre Partenaire Immobilier<br />à Dubai
              </h2>
              
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  MoveSmart accompagne les investisseurs internationaux dans l'acquisition 
                  de biens immobiliers d'exception à Dubai. Notre connaissance approfondie 
                  du marché et notre réseau exclusif vous ouvrent les portes des résidences 
                  les plus prestigieuses.
                </p>
                <p>
                  Nous offrons un service complet : recherche personnalisée, accompagnement 
                  juridique, obtention du visa résidence et gestion locative.
                </p>
              </div>
              
              <div className="mt-10 grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">500+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Biens vendus</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">40+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Nationalités</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">10 ans</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">D'expertise</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden bg-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800&auto=format&fit=crop" 
                  alt="Luxury Interior" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-6 shadow-2xl max-w-xs hidden sm:block border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-900">5.0/5</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">"Service exceptionnel et accompagnement professionnel."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SERVICES ==================== */}
      <section className="py-24 sm:py-32 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-amber-500" />
              <span className="text-amber-600 text-xs tracking-[0.2em] uppercase font-semibold">Nos Services</span>
              <div className="h-px w-8 bg-amber-500" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Une Expertise Complète
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Building, title: "Recherche de biens", desc: "Sélection personnalisée selon vos critères d'investissement." },
              { icon: MapPin, title: "Visa résidence", desc: "Accompagnement complet pour le Golden Visa 10 ans." },
              { icon: Check, title: "Gestion locative", desc: "Optimisation du rendement et gestion professionnelle." },
              { icon: Phone, title: "Suivi juridique", desc: "Vérification des titres et accompagnement notarial." },
            ].map((service, index) => (
              <div key={index} className="bg-white p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors duration-300">
                  <service.icon className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== LISTINGS ==================== */}
      <section className="py-24 sm:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-16 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-amber-500" />
                <span className="text-amber-600 text-xs tracking-[0.2em] uppercase font-semibold">Sélection Exclusive</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Propriétés en Vedette
              </h2>
            </div>
            <Link 
              to="/listings" 
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-amber-600 transition-colors group"
            >
              Voir toutes les propriétés
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredListings.map((listing) => (
              <Link to={`/listings/${listing.id}`} key={listing.id} className="group">
                <div className="overflow-hidden mb-4 bg-gray-100 relative">
                  <img 
                    src={listing.images[0]} 
                    alt={listing.title} 
                    className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5">
                    <span className="text-xs font-semibold text-gray-900 uppercase tracking-wider">{listing.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 uppercase tracking-wider">
                  <MapPin className="w-3 h-3" />
                  <span>{listing.location}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                  {listing.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1"><Bed className="w-4 h-4" /> {listing.beds}</span>
                  <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {listing.baths}</span>
                  <span className="flex items-center gap-1"><Square className="w-4 h-4" /> {listing.area}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-xl font-bold text-gray-900">AED {listing.price.toLocaleString()}</div>
                  <div className="text-xs text-amber-600 font-semibold uppercase tracking-wider">Voir détails</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="py-24 sm:py-32 px-6 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500 via-transparent to-transparent" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-8 bg-amber-500" />
            <span className="text-amber-500 text-xs tracking-[0.2em] uppercase font-semibold">Contact</span>
            <div className="h-px w-8 bg-amber-500" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8">
            Commencez Votre Investissement
          </h2>
          
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Notre équipe d'experts est à votre disposition pour étudier vos opportunités 
            d'investissement à Dubai.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 bg-amber-500 text-black px-10 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-amber-400 transition-all duration-300">
              Prendre Rendez-vous
            </Link>
            <a href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-transparent text-white border border-white/30 px-10 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-white/10 transition-all duration-300">
              <Phone className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-white border-t border-gray-200 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{companyInfo.name}</h3>
              <p className="text-gray-600 leading-relaxed mb-6 max-w-md text-sm">{companyInfo.description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" /> <span>{companyInfo.location}</span>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-6">Navigation</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><Link to="/" className="hover:text-amber-600 transition">Accueil</Link></li>
                <li><Link to="/listings" className="hover:text-amber-600 transition">Propriétés</Link></li>
                <li><Link to="/about" className="hover:text-amber-600 transition">À Propos</Link></li>
                <li><Link to="/contact" className="hover:text-amber-600 transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-6">Contact</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> <span>{companyInfo.whatsapp}</span></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">© 2026 {companyInfo.brand}. Tous droits réservés.</p>
            <div className="flex gap-6 text-xs text-gray-500">
              <a href="#" className="hover:text-gray-900 transition">Mentions légales</a>
              <a href="#" className="hover:text-gray-900 transition">Politique de confidentialité</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
