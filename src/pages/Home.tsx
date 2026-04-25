import React from 'react';
import { Link } from 'react-router-dom';
import { Building, MapPin, Check, Phone, Star } from 'lucide-react';
import FAQ from '../components/FAQ';
import Testimonials from '../components/Testimonials';

export default function Home() {
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
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
          <span className="text-amber-500 font-bold tracking-[0.3em] uppercase text-sm mb-6 block">
            MoveSmart Consultancy
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-wider uppercase leading-tight">
            L'Art de Vivre <br/>à Dubai
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Découvrez une sélection exclusive de propriétés de luxe. 
            Investissement immobilier, visa résidence et accompagnement premium.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to="/listings" 
              className="w-full sm:w-auto px-8 py-4 bg-amber-500 text-black font-bold uppercase tracking-widest text-sm hover:bg-amber-600 transition-colors"
            >
              Nos Propriétés
            </Link>
            <Link 
              to="/contact" 
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/30 text-white font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-24 bg-black">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-4 block">À Propos</span>
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-8">
              Votre Partenaire Immobilier à Dubai
            </h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              MoveSmart accompagne les investisseurs internationaux dans l'acquisition
              de biens immobiliers d'exception à Dubai. Notre connaissance approfondie
              du marché et notre réseau exclusif vous ouvrent les portes des résidences
              les plus prestigieuses.
            </p>
            <p className="text-gray-400 mb-10 leading-relaxed">
              Nous offrons un service complet : recherche personnalisée, accompagnement
              juridique, obtention du visa résidence et gestion locative.
            </p>
            
            <div className="grid grid-cols-3 gap-8 border-t border-white/10 pt-10">
              <div>
                <p className="text-3xl font-bold text-amber-500 mb-2">500+</p>
                <p className="text-xs uppercase tracking-widest text-gray-500">Biens vendus</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-amber-500 mb-2">40+</p>
                <p className="text-xs uppercase tracking-widest text-gray-500">Nationalités</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-amber-500 mb-2">10 ans</p>
                <p className="text-xs uppercase tracking-widest text-gray-500">D'expertise</p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800&auto=format&fit=crop" 
              alt="Luxury Interior" 
              className="w-full h-[600px] object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute -bottom-10 -left-10 bg-black border border-white/10 p-8 max-w-sm hidden md:block">
              <div className="flex gap-1 text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-2xl font-bold mb-2">5.0/5</p>
              <p className="text-gray-400 text-sm italic">"Service exceptionnel et accompagnement professionnel."</p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-4 block">Nos Services</span>
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-wider">Une Expertise Complète</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Building, title: "Recherche de biens", desc: "Sélection personnalisée selon vos critères d'investissement." },
              { icon: MapPin, title: "Visa résidence", desc: "Accompagnement complet pour le Golden Visa 10 ans." },
              { icon: Check, title: "Gestion locative", desc: "Optimisation du rendement et gestion professionnelle." },
              { icon: Phone, title: "Suivi juridique", desc: "Vérification des titres et accompagnement notarial." },
            ].map((service, index) => (
              <div key={index} className="bg-black p-8 border border-white/5 hover:border-amber-500/30 transition-colors group">
                <service.icon className="w-10 h-10 text-amber-500 mb-6 group-hover:scale-110 transition-transform" strokeWidth={1} />
                <h3 className="text-xl font-bold uppercase tracking-wider mb-4">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{service.desc}</p>
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
      <section className="py-32 bg-amber-500 text-black text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-wider mb-8">Commencez Votre Investissement</h2>
          <p className="text-black/70 text-lg mb-12">
            Notre équipe d'experts est à votre disposition pour étudier vos opportunités
            d'investissement à Dubai.
          </p>
          <div className="flex justify-center gap-6">
            <Link 
              to="/contact" 
              className="px-8 py-4 bg-black text-amber-500 font-bold uppercase tracking-widest text-sm hover:bg-gray-900 transition-colors"
            >
              Prendre Rendez-vous
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}