import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, Users, Bed, Bath, Square, Star, MapPin, ArrowRight, 
  TrendingUp, Shield, Home, DollarSign, CheckCircle, Phone, 
  Mail, Calendar, Building, Globe, Award, Clock
} from 'lucide-react';
import { listings } from '../data/listings';
import { companyInfo } from '../constants';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  const featuredListings = listings.slice(0, 3);

  const stats = [
    { icon: TrendingUp, value: "12%", label: "ROI Annuel Moyen" },
    { icon: Building, value: "500+", label: "Propriétés Vendues" },
    { icon: Globe, value: "40+", label: "Nationalités Clients" },
    { icon: Award, value: "10 Ans", label: "D'Expérience" },
  ];

  const benefits = [
    { icon: CheckCircle, title: "Visa Résidence", desc: "Obtenez votre visa golden visa 10 ans" },
    { icon: DollarSign, title: "0% Taxe", desc: "Pas de taxe sur le revenu ni plus-value" },
    { icon: Shield, title: "Sécurité", desc: "Dubai = l'une des villes les plus sûres au monde" },
    { icon: Clock, title: "Livraison Rapide", desc: "Propriétés prêtes ou off-plan disponibles" },
  ];

  const steps = [
    { num: "01", title: "Consultation", desc: "Analyse de vos objectifs d'investissement" },
    { num: "02", title: "Sélection", desc: "Choix des propriétés adaptées à votre budget" },
    { num: "03", title: "Visite", desc: "Visites virtuelles ou sur place organisées" },
    { num: "04", title: "Achat", desc: "Accompagnement juridique et administratif complet" },
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* ==================== HERO ==================== */}
      <section className="relative w-full min-h-screen flex items-center justify-center text-white px-4 sm:px-6 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/4531667/pexels-photo-4531667.jpeg"
            alt="Dubai Skyline"
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30 sm:from-black/80 sm:via-black/60 sm:to-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center px-4 pt-20 pb-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span>Leader de l'investissement immobilier à Dubai</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight drop-shadow-2xl">
            Investissez dans l'<span className="text-yellow-400">Immobilier de Luxe</span> à Dubai
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto drop-shadow-lg">
            Rejoignez les investisseurs internationaux qui génèrent jusqu'à 12% de rendement annuel. 
            Visa golden visa, 0% d'impôt, propriété 100% étrangère.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 rounded-full font-bold text-base sm:text-lg shadow-xl transition-all duration-300 bg-yellow-500 text-black hover:bg-yellow-400 hover:scale-105 w-full sm:w-auto justify-center"
            >
              Voir les Propriétés
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 rounded-full font-bold text-base sm:text-lg shadow-xl transition-all duration-300 bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white/20 w-full sm:w-auto justify-center"
            >
              <Phone className="w-5 h-5" />
              Consultation Gratuite
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>100% Légal & Sécurisé</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Accompagnement Complet</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Visa Golden Visa Inclus</span>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <svg viewBox="0 0 1440 80" fill="white" className="w-full h-auto" preserveAspectRatio="none">
            <path d="M0 80L60 70C120 60 240 40 360 35C480 30 600 40 720 45C840 50 960 50 1080 55C1200 60 1320 70 1380 75L1440 80V80H0Z" />
          </svg>
        </div>
      </section>

      {/* ==================== STATS ==================== */}
      <section className="py-12 sm:py-16 bg-black text-white px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-4">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-yellow-500" />
                <div className="text-3xl sm:text-4xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== WHY DUBAI ==================== */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              Pourquoi Dubai ?
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              La Destination N°1 pour l'Investissement
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Dubai offre des avantages uniques aux investisseurs internationaux
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-yellow-600" />
                </div>
                <h4 className="font-bold text-lg mb-2">{benefit.title}</h4>
                <p className="text-sm text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURED LISTINGS ==================== */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block bg-black text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              Opportunités Exclusives
            </span>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              {t('featuredListings', 'Propriétés en Vedette')}
            </h3>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Sélection de propriétés à fort potentiel de rendement
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredListings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-100">
                <div className="relative h-56 sm:h-64 overflow-hidden">
                  <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" loading="lazy" />
                  <div className="absolute top-4 left-4 bg-yellow-500 text-black px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                    {listing.type}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-bold">
                    ROI Est. 10-14%
                  </div>
                </div>
                <div className="p-5 sm:p-6">
                  <h4 className="font-bold text-lg sm:text-xl mb-2 line-clamp-1">{listing.title}</h4>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{listing.location}</span>
                  </div>
                  <div className="font-bold text-2xl sm:text-3xl mb-4 text-black">AED {listing.price.toLocaleString()}</div>
                  
                  <div className="flex items-center justify-between text-gray-600 text-xs sm:text-sm mb-5 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <Bed className="w-4 h-4" />
                      <span className="font-medium">{listing.beds}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bath className="w-4 h-4" />
                      <span className="font-medium">{listing.baths}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Square className="w-4 h-4" />
                      <span className="font-medium">{listing.area}</span>
                    </div>
                  </div>
                  
                  <Link to={`/listings/${listing.id}`} className="block w-full text-center bg-black text-white py-3 rounded-full font-bold text-sm hover:bg-yellow-500 hover:text-black transition-all duration-300">
                    {t('viewDetails', 'Voir Détails')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10 sm:mt-12">
            <Link to="/listings" className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-yellow-500 hover:text-black transition-all duration-300">
              Voir Toutes les Propriétés
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== PROCESS ==================== */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block bg-yellow-500 text-black px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              Comment Ça Marche
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Investir en 4 Étapes Simples
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              Un processus accompagné de A à Z par nos experts
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-bold text-white/10 absolute -top-4 -left-2">{step.num}</div>
                <div className="relative bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 h-full">
                  <div className="text-yellow-500 font-bold text-lg mb-2">{step.num}</div>
                  <h4 className="font-bold text-xl mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-400">{step.desc}</p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-yellow-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-yellow-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10 text-gray-900">
            Ce Que Disent Nos Investisseurs
          </h3>
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100">
            <p className="text-lg sm:text-xl md:text-2xl italic text-gray-700 mb-6 leading-relaxed">
              "MoveSmart a rendu notre investissement à Dubai extrêmement simple. 
              En 3 semaines, nous avions notre propriété et notre visa golden visa approuvé. 
              Le ROI est exactement comme promis : 11% la première année."
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-2xl">👤</div>
              <div className="text-left">
                <div className="font-bold text-lg text-gray-900">Pierre & Marie L.</div>
                <div className="text-sm text-gray-500">Investisseurs Français, Paris</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Prêt à Investir à Dubai ?
          </h2>
          <p className="text-gray-400 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Réservez votre consultation gratuite avec nos experts. 
            Analyse de votre profil et recommandations personnalisées offertes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-yellow-500 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-all duration-300 hover:scale-105"
            >
              <Calendar className="w-5 h-5" />
              Réserver un Appel Gratuit
            </Link>
            <a
              href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300"
            >
              <Phone className="w-5 h-5" />
              WhatsApp Direct
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-6">Réponse sous 24h garantie</p>
        </div>
      </section>

      {/* ==================== NEWSLETTER ==================== */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">
            Recevez les Opportunités Exclusives
          </h3>
          <p className="text-gray-600 text-sm sm:text-base mb-6">
            Nouvelles propriétés et analyses de marché directement dans votre boîte mail
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Votre email professionnel" 
              className="px-6 py-4 rounded-full text-black text-sm sm:text-base w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-200" 
            />
            <button className="bg-black text-white px-8 py-4 rounded-full font-bold text-sm sm:text-base hover:bg-yellow-500 hover:text-black transition-all duration-300 whitespace-nowrap">
              S'inscrire
            </button>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-gray-900 text-white py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-xl font-bold mb-4">{companyInfo.brand}</h4>
              <p className="text-sm text-gray-400 mb-4">{companyInfo.description}</p>
            </div>
            <div>
              <h5 className="font-bold mb-4">Liens Rapides</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/listings" className="hover:text-white transition">Propriétés</Link></li>
                <li><Link to="/about" className="hover:text-white transition">À Propos</Link></li>
                <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Contact</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> {companyInfo.whatsapp}</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {companyInfo.location}</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Légal</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Politique de Confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition">Conditions d'Utilisation</a></li>
                <li><a href="#" className="hover:text-white transition">Mentions Légales</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-xs text-gray-500">© 2026 {companyInfo.brand}. Tous droits réservés.</p>
            <p className="text-xs text-gray-600 mt-2">MoveSmart Consultancy – FZCO | Dubai, UAE</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
