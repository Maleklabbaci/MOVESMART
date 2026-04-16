import React from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Square, MapPin, ArrowRight, Phone, Check, Building } from 'lucide-react';
import { listings } from '../data/listings';
import { companyInfo } from '../constants';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  const featuredListings = listings.slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      
      {/* ==================== HERO ==================== */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/4531667/pexels-photo-4531667.jpeg"
            alt="Dubai Skyline"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
          <p className="text-amber-400 text-xs sm:text-sm tracking-[0.25em] uppercase mb-6 font-medium">
            MoveSmart Consultancy
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            L'Excellence Immobilière<br />
            <span className="text-amber-400">à Dubai</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Accompagnement premium pour investisseurs internationaux. 
            Acquisition, visa résidence et gestion de patrimoine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/listings"
              className="inline-flex items-center justify-center gap-2 bg-amber-500 text-black px-8 py-4 text-sm font-semibold tracking-wider hover:bg-amber-400 transition-colors duration-300"
            >
              DÉCOUVRIR LES BIENS
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/30 px-8 py-4 text-sm font-semibold tracking-wider hover:bg-white/20 transition-colors duration-300"
            >
              CONSULTATION
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </section>

      {/* ==================== INTRO ==================== */}
      <section className="py-24 sm:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-amber-600 text-xs tracking-[0.2em] uppercase mb-4 font-semibold">
                À Propos
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Votre Partenaire de Confiance à Dubai
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  MoveSmart accompagne les investisseurs internationaux dans l'acquisition 
                  de biens immobiliers de prestige à Dubai. Notre expertise du marché local 
                  et notre réseau exclusif vous donnent accès aux opportunités les plus prometteuses.
                </p>
                <p>
                  De la sélection du bien à l'obtention du visa résidence, nous assurons 
                  un accompagnement personnalisé et transparent à chaque étape.
                </p>
              </div>
              
              <div className="mt-10 grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">500+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Biens vendus</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">40+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Nationalités</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">10 ans</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">D'expérience</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden bg-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800&auto=format&fit=crop" 
                  alt="Luxury Interior Dubai" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 shadow-xl max-w-xs hidden sm:block border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">Accompagnement Premium</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">De la visite à la remise des clés, nous gérons chaque détail.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SERVICES ==================== */}
      <section className="py-24 sm:py-32 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-600 text-xs tracking-[0.2em] uppercase mb-4 font-semibold">
              Nos Services
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Un Accompagnement Sur Mesure
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Building, title: "Recherche de biens", desc: "Sélection personnalisée selon vos critères d'investissement et votre budget." },
              { icon: MapPin, title: "Visa résidence", desc: "Accompagnement complet pour l'obtention du Golden Visa 10 ans." },
              { icon: Check, title: "Gestion locative", desc: "Optimisation du rendement et gestion professionnelle de vos locataires." },
              { icon: Phone, title: "Suivi juridique", desc: "Vérification des titres de propriété et accompagnement notarial." },
            ].map((service, index) => (
              <div key={index} className="bg-white p-8 hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                <service.icon className="w-8 h-8 text-amber-600 mb-6" />
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
              <p className="text-amber-600 text-xs tracking-[0.2em] uppercase mb-4 font-semibold">
                Sélection Exclusive
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Biens en Vedette
              </h2>
            </div>
            <Link 
              to="/listings" 
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-amber-600 transition-colors group"
            >
              Voir tous les biens
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredListings.map((listing) => (
              <Link to={`/listings/${listing.id}`} key={listing.id} className="group">
                <div className="overflow-hidden mb-4 bg-gray-100">
                  <img 
                    src={listing.images[0]} 
                    alt={listing.title} 
                    className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 uppercase tracking-wide">
                  <MapPin className="w-3 h-3" />
                  <span>{listing.location}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                  {listing.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-1">
                    <Bed className="w-4 h-4" /> {listing.beds}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="w-4 h-4" /> {listing.baths}
                  </span>
                  <span className="flex items-center gap-1">
                    <Square className="w-4 h-4" /> {listing.area}
                  </span>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  AED {listing.price.toLocaleString()}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="py-24 sm:py-32 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-amber-400 text-xs tracking-[0.2em] uppercase mb-4 font-semibold">
            Contact
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8">
            Discutons de Votre Projet
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Notre équipe d'experts est à votre disposition pour étudier vos opportunités 
            d'investissement à Dubai et vous accompagner dans chaque étape.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-amber-500 text-black px-8 py-4 text-sm font-semibold tracking-wider hover:bg-amber-400 transition-colors duration-300"
            >
              NOUS CONTACTER
            </Link>
            <a
              href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/30 px-8 py-4 text-sm font-semibold tracking-wider hover:bg-white/20 transition-colors duration-300"
            >
              <Phone className="w-4 h-4" />
              WHATSAPP
            </a>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-white border-t border-gray-200 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{companyInfo.name}</h3>
              <p className="text-gray-600 leading-relaxed mb-6 max-w-md text-sm">
                {companyInfo.description}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{companyInfo.location}</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">Navigation</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><Link to="/" className="hover:text-amber-600 transition">Accueil</Link></li>
                <li><Link to="/listings" className="hover:text-amber-600 transition">Biens</Link></li>
                <li><Link to="/about" className="hover:text-amber-600 transition">À Propos</Link></li>
                <li><Link to="/contact" className="hover:text-amber-600 transition">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">Contact</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{companyInfo.whatsapp}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">
              © 2026 {companyInfo.brand}. Tous droits réservés.
            </p>
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
