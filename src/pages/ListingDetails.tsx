import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Bed, Bath, Square, MapPin, ArrowLeft, Share2, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { companyInfo } from '../constants';

export default function ListingDetails() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!id) return;
    supabase.from('listings').select('*').eq('id', id).single()
      .then(({ data }) => { setListing(data); setLoading(false); });
  }, [id]);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) navigator.share({ title: listing?.title, url }).catch(console.error);
    else navigator.clipboard.writeText(url).then(() => alert('Lien copié !'));
  };

  if (loading) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!listing) return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col items-center justify-center gap-6"
      style={{ fontFamily: "'Cormorant Garamond', serif" }}>
      <p className="text-2xl font-light text-gray-400">Bien non trouvé.</p>
      <Link to="/listings" className="text-amber-400 text-xs font-sans tracking-[0.3em] uppercase hover:text-amber-300 transition-colors">
        ← Retour aux propriétés
      </Link>
    </div>
  );

  const images = listing.images || [];

  return (
    <div className="min-h-screen bg-[#080808] text-white" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>

      {/* HERO IMAGE */}
      <div className="relative h-[55vh] sm:h-[70vh] overflow-hidden bg-[#111]">
        {images.length > 0 ? (
          <img src={images[activeImg]} alt={listing.title}
            className="w-full h-full object-cover transition-opacity duration-500" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-700 font-sans text-sm">Aucune photo</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/30" />

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button onClick={() => setActiveImg(p => (p - 1 + images.length) % images.length)}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-10 h-10 border border-white/20 flex items-center justify-center hover:border-amber-400 hover:text-amber-400 transition-all duration-300 backdrop-blur-sm bg-black/30">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => setActiveImg(p => (p + 1) % images.length)}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-10 h-10 border border-white/20 flex items-center justify-center hover:border-amber-400 hover:text-amber-400 transition-all duration-300 backdrop-blur-sm bg-black/30">
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Back + Share */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
          <Link to="/listings"
            className="flex items-center gap-2 text-white/70 hover:text-white text-xs font-sans tracking-[0.2em] uppercase transition-colors backdrop-blur-sm bg-black/20 px-4 py-2">
            <ArrowLeft className="w-4 h-4" /> Retour
          </Link>
          <button onClick={handleShare}
            className="flex items-center gap-2 text-white/70 hover:text-amber-400 text-xs font-sans tracking-[0.2em] uppercase transition-colors backdrop-blur-sm bg-black/20 px-4 py-2">
            <Share2 className="w-4 h-4" /> Partager
          </button>
        </div>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-6 right-6 text-xs font-sans text-white/50 backdrop-blur-sm bg-black/30 px-3 py-1">
            {activeImg + 1} / {images.length}
          </div>
        )}
      </div>

      {/* THUMBNAILS */}
      {images.length > 1 && (
        <div className="flex gap-2 px-6 md:px-10 py-4 overflow-x-auto max-w-5xl mx-auto">
          {images.map((img: string, i: number) => (
            <button key={i} onClick={() => setActiveImg(i)}
              className={`flex-shrink-0 w-16 h-12 overflow-hidden border transition-all duration-200 ${i === activeImg ? 'border-amber-400' : 'border-white/10 opacity-50 hover:opacity-80'}`}>
              <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-12 grid lg:grid-cols-3 gap-16">

        {/* LEFT — Main info */}
        <div className="lg:col-span-2">
          {/* Badge type */}
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="h-px w-6 bg-amber-400" />
            <span className="text-amber-400 text-xs font-sans tracking-[0.3em] uppercase">{listing.type}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-light leading-tight mb-4">{listing.title}</h1>

          <div className="flex items-center gap-2 text-gray-500 font-sans text-sm mb-10">
            <MapPin className="w-4 h-4 text-amber-400/60" />
            {listing.location}
          </div>

          {/* Specs */}
          <div className="grid grid-cols-3 gap-px bg-white/[0.04] mb-12">
            {[
              { icon: Bed, value: listing.beds, label: listing.beds > 1 ? 'Chambres' : 'Chambre' },
              { icon: Bath, value: listing.baths, label: listing.baths > 1 ? 'Salles de bain' : 'Salle de bain' },
              { icon: Square, value: `${listing.area?.toLocaleString()}`, label: 'sqft' },
            ].map((s, i) => (
              <div key={i} className="bg-[#0d0d0d] px-6 py-6 flex flex-col items-center text-center">
                <s.icon className="w-5 h-5 text-amber-400/50 mb-3" />
                <div className="text-2xl font-light mb-1">{s.value}</div>
                <div className="text-xs font-sans text-gray-600 tracking-[0.2em] uppercase">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-6 bg-amber-400" />
              <span className="text-amber-400 text-xs font-sans tracking-[0.3em] uppercase">Description</span>
            </div>
            <p className="text-gray-400 font-sans font-light text-sm sm:text-base leading-relaxed">
              {listing.description ||
                `Découvrez ce ${listing.type?.toLowerCase()} d'exception situé à ${listing.location}. 
                Cette propriété offre un confort inégalé avec des finitions premium et des équipements de standing. 
                Un investissement idéal pour ceux qui recherchent l'excellence à Dubaï.`
              }
            </p>
          </div>
        </div>

        {/* RIGHT — Price + CTA */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="border border-white/[0.06] p-8 mb-6">
              <div className="text-xs font-sans text-gray-600 tracking-[0.3em] uppercase mb-3">Prix</div>
              <div className="text-4xl font-light text-amber-400 mb-1">
                AED {listing.price?.toLocaleString()}
              </div>
              <div className="text-xs font-sans text-gray-600">
                ≈ {Math.round((listing.price || 0) / 3.67).toLocaleString()} USD
              </div>
            </div>

            <div className="space-y-3">
              <a href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}?text=Bonjour, je suis intéressé par: ${listing.title}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-amber-400 text-black w-full py-4 text-xs font-sans font-bold tracking-[0.25em] uppercase hover:bg-amber-300 transition-all duration-300">
                <Phone className="w-4 h-4" /> Contacter via WhatsApp
              </a>
              <Link to="/contact"
                className="flex items-center justify-center gap-3 border border-white/10 text-white w-full py-4 text-xs font-sans font-bold tracking-[0.25em] uppercase hover:border-amber-400/40 hover:text-amber-400 transition-all duration-300">
                Envoyer un message
              </Link>
            </div>

            {/* Info box */}
            <div className="mt-8 border border-white/[0.04] p-6">
              <div className="text-xs font-sans text-gray-600 tracking-[0.3em] uppercase mb-4">MoveSmart Invest</div>
              <p className="text-xs font-sans text-gray-600 font-light leading-relaxed">
                Notre équipe répond sous 24h. Accompagnement complet pour votre investissement à Dubaï.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#030303] border-t border-white/[0.04] py-10 px-6 mt-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-700 font-sans">© 2026 MoveSmart Invest. Tous droits réservés.</p>
          <Link to="/listings" className="text-xs text-gray-700 font-sans hover:text-amber-400 transition-colors">
            ← Toutes les propriétés
          </Link>
        </div>
      </footer>
    </div>
  );
}
