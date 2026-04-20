import { companyInfo } from '../constants';
import { Target, Users, ShieldCheck, TrendingUp, Building2, Globe, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-[#080808] text-white" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>

      {/* HERO */}
      <section className="pt-40 pb-24 px-6 border-b border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-px w-8 bg-amber-400" />
            <span className="text-amber-400 text-xs font-sans tracking-[0.3em] uppercase">À Propos</span>
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-light leading-[0.9] tracking-tight mb-10 max-w-4xl">
            {companyInfo.brand}
          </h1>
          <p className="text-2xl sm:text-3xl font-light text-gray-300 mb-8 leading-tight max-w-3xl">
            {companyInfo.baseline}
          </p>
          <p className="text-gray-500 font-sans font-light text-base leading-relaxed max-w-2xl">
            {companyInfo.description}
          </p>
        </div>
      </section>

      {/* WHY DUBAI */}
      <section className="py-28 px-6 bg-[#050505]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-16">
            <div className="h-px w-8 bg-amber-400" />
            <span className="text-amber-400 text-xs font-sans tracking-[0.3em] uppercase">Pourquoi Dubaï</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-light mb-16">Investir à Dubaï,<br /><em className="not-italic text-amber-400">c'est investir dans l'avenir.</em></h2>
          <div className="grid md:grid-cols-3 gap-px bg-white/[0.04]">
            {[
              { icon: Building2, title: 'Hub mondial', desc: 'Position stratégique entre Orient et Occident, carrefour des affaires internationales.' },
              { icon: Globe, title: 'Fiscalité attractive', desc: "Pas d'impôt sur le revenu, pas de taxe foncière. Un environnement fiscal unique au monde." },
              { icon: Briefcase, title: 'Business friendly', desc: 'Infrastructure de classe mondiale et facilité de création d\'entreprise reconnue globalement.' },
            ].map((item, i) => (
              <div key={i} className="bg-[#050505] p-10 group hover:bg-[#080808] transition-colors duration-300">
                <item.icon className="w-8 h-8 text-amber-400/50 mb-8 group-hover:text-amber-400 transition-colors duration-300" />
                <h4 className="text-xl font-light mb-4">{item.title}</h4>
                <p className="text-gray-600 text-sm font-sans font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-16">
            <div className="h-px w-8 bg-amber-400" />
            <span className="text-amber-400 text-xs font-sans tracking-[0.3em] uppercase">Notre approche</span>
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-white/[0.04]">
            {[
              { icon: Target, title: 'Vision stratégique', desc: 'Des feuilles de route claires et actionnables, adaptées à vos objectifs d\'investissement à Dubaï.' },
              { icon: Users, title: 'Approche personnalisée', desc: 'Notre service 360° couvre chaque aspect de votre relocation et de la création de votre structure.' },
              { icon: ShieldCheck, title: 'Expertise de confiance', desc: 'Une connaissance approfondie du marché local pour naviguer les réglementations dubaïotes.' },
              { icon: TrendingUp, title: 'Croissance durable', desc: 'Focus sur le succès long terme pour construire et faire fructifier vos actifs efficacement.' },
            ].map((f, i) => (
              <div key={i} className="bg-[#080808] p-10 sm:p-14 group hover:bg-[#0a0a0a] transition-colors duration-300">
                <f.icon className="w-8 h-8 text-amber-400/40 mb-8 group-hover:text-amber-400 transition-colors duration-300" />
                <h3 className="text-2xl font-light mb-4">{f.title}</h3>
                <p className="text-gray-500 font-sans font-light leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMITMENT */}
      <section className="py-28 px-6 bg-[#050505]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="h-px w-8 bg-amber-400" />
            <span className="text-amber-400 text-xs font-sans tracking-[0.3em] uppercase">Notre engagement</span>
            <div className="h-px w-8 bg-amber-400" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-light mb-10 leading-tight">
            La confiance comme<br /><em className="not-italic text-amber-400">fondation de tout.</em>
          </h2>
          <p className="text-gray-400 font-sans font-light text-base sm:text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
            Chez {companyInfo.brand}, nous croyons que le succès à Dubaï repose sur la confiance, la transparence et une compréhension profonde du marché local. Nous sommes votre partenaire dédié, engagés à transformer vos ambitions en réalité.
          </p>
          <Link to="/contact"
            className="inline-flex items-center gap-3 bg-amber-400 text-black px-10 py-4 text-xs font-sans font-bold tracking-[0.25em] uppercase hover:bg-amber-300 transition-all duration-300">
            Commencer maintenant <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#030303] border-t border-white/[0.04] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-700 font-sans">© 2026 MoveSmart Invest. Tous droits réservés.</p>
          <div className="flex gap-6 text-xs text-gray-700 font-sans">
            <Link to="/" className="hover:text-amber-400 transition-colors">Accueil</Link>
            <Link to="/listings" className="hover:text-amber-400 transition-colors">Propriétés</Link>
            <Link to="/contact" className="hover:text-amber-400 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
