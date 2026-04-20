import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Bed, Bath, Square, MapPin, ArrowLeft, Share2, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { companyInfo } from '../constants';

export default function ListingDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.from('listings').select('*').eq('id', id).single()
      .then(({ data }) => { setListing(data); setLoading(false); });
  }, [id]);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: listing?.title, url }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
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
    <div className="min-h-screen bg-[#080808] text-white pb-20 md:pb-0"
      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>

      {/* HERO IMAGE */}
      <div className="relative h-[50vh] sm:h-[65vh] overflow-hidden bg-[#111]">
        {images.length > 0 ? (
          <img src={images[activeImg]} alt={listing.title}
            className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-700 font-sans text-sm">Aucune photo</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-black/40" />

        {/* BACK + SHARE — bien visibles */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 sm:p-6">
          <button
            onClick={() => navigate(-1)}
            style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
            className="flex items-center gap-2 text-white px-4 py-2.5 text-xs font-sans tracking-[0.15em] uppercase hover:border-amber-400/60 hover:text-amber-400 transition-all duration-200">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Retour</span>
          </button>

          <button
            onClick={handleShare}
            style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
            className="flex items-center gap-2 text-white px-4 py-2.5 text-xs font-sans tracking-[0.15em] uppercase hover:border-amber-400/60 hover:text-amber-400 transition-all duration-200">
            <Share2 className="w-4 h-4" />
            <span>{copied ? 'Copié ✓' : 'Partager'}</span>
          </button>
        </div>

        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button onClick={() => setActiveImg(p => (p - 1 + images.length) % images.length)}
              style={{ backgroundColor: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)' }}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center hover:border-amber-400/60 hover:text-amber-400 transition-all duration-200">
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button onClick={() => setActiveImg(p => (p + 1) % images.length)}
              style={{ backgroundColor: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)' }}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center hover:border-amber-400/60 hover:text-amber-400 transition-all duration-200">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="absolute bottom-4 right-4 text-xs font-sans text-white/60"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '3px 10px' }}>
              {activeImg + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* THUMBNAILS */}
      {images.length > 1 && (
        <div className="flex gap-2 px-4 sm:px-6 py-3 overflow-x-auto max-w-5xl mx-auto scrollbar-hide">
          {images.map((img: string, i: number) => (
            <button key={i} onClick={() => setActiveImg(i)}
              style={{ border: `1px solid ${i === activeImg ? '#FBBF24' : 'rgba(255,255,255,0.08)'}`, opacity: i === activeImg ? 1 : 0.5 }}
              className="flex-shrink-0 w-14 h-10 sm:w-16 sm:h-12 overflow-hidden transition-all duration-200 hover:opacity-80">
              <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-8 sm:py-12 grid lg:grid-cols-3 gap-8 lg:gap-16">

        {/* LEFT */}
        <div className="lg:col-span-2">
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="h-px w-6 bg-amber-400" />
            <span className="text-amber-400 text-xs font-sans tracking-[0.3em] uppercase">{listing.type}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light leading-tight mb-4">{listing.title}</h1>

          <div className="flex items-center gap-2 text-gray-500 font-sans text-sm mb-8">
            <MapPin className="w-4 h-4 text-amber-400/60 flex-shrink-0" />
            {listing.location}
          </div>

          {/* Specs */}
          <div className="grid grid-cols-3 gap-px mb-10" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
            {[
              { icon: Bed, value: listing.beds, label: 'Chambres' },
              { icon: Bath, value: listing.baths, label: 'SDB' },
              { icon: Square, value: listing.area?.toLocaleString(), label: 'sqft' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center py-5 px-3"
                style={{ backgroundColor: '#0d0d0d' }}>
                <s.icon className="w-4 h-4 mb-2" style={{ color: 'rgba(251,191,36,0.5)' }} />
                <div className="text-xl sm:text-2xl font-light mb-1">{s.value}</div>
                <div className="text-[10px] font-sans tracking-[0.2em] uppercase" style={{ color: '#4B5563' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-6 bg-amber-400" />
              <span className="text-amber-400 text-xs font-sans tracking-[0.3em] uppercase">Description</span>
            </div>
            <p className="text-gray-400 font-sans font-light text-sm sm:text-base leading-relaxed">
              {listing.description ||
                `Découvrez ce ${listing.type?.toLowerCase()} d'exception situé à ${listing.location}. Cette propriété offre un confort inégalé avec des finitions premium et des équipements de standing. Un investissement idéal pour ceux qui recherchent l'excellence à Dubaï.`}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-1">
          {/* Prix — toujours visible en haut sur mobile */}
          <div className="mb-6 p-6" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-xs font-sans tracking-[0.3em] uppercase mb-3" style={{ color: '#4B5563' }}>Prix</div>
            <div className="text-3xl sm:text-4xl font-light mb-1" style={{ color: '#FBBF24' }}>
              AED {listing.price?.toLocaleString()}
            </div>
            <div className="text-xs font-sans" style={{ color: '#4B5563' }}>
              ≈ {Math.round((listing.price || 0) / 3.67).toLocaleString()} USD
            </div>
          </div>

          <div className="space-y-3">
            <a href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}?text=Bonjour, je suis intéressé par: ${listing.title}`}
              target="_blank" rel="noopener noreferrer"
              style={{ backgroundColor: '#FBBF24', color: '#000' }}
              className="flex items-center justify-center gap-3 w-full py-4 text-xs font-sans font-bold tracking-[0.25em] uppercase hover:opacity-90 transition-opacity">
              <Phone className="w-4 h-4" /> WhatsApp
            </a>
            <Link to="/contact"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              className="flex items-center justify-center gap-3 w-full py-4 text-xs font-sans font-bold tracking-[0.25em] uppercase text-white hover:border-amber-400/40 hover:text-amber-400 transition-all duration-200">
              Envoyer un message
            </Link>
          </div>

          <div className="mt-6 p-5" style={{ border: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="text-xs font-sans tracking-[0.3em] uppercase mb-3" style={{ color: '#4B5563' }}>MoveSmart Invest</div>
            <p className="text-xs font-sans font-light leading-relaxed" style={{ color: '#4B5563' }}>
              Notre équipe répond sous 24h. Accompagnement complet pour votre investissement.
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-10 py-8 px-6" style={{ backgroundColor: '#030303', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs font-sans" style={{ color: '#374151' }}>© 2026 MoveSmart Invest. Tous droits réservés.</p>
          <Link to="/listings" className="text-xs font-sans hover:text-amber-400 transition-colors" style={{ color: '#374151' }}>
            ← Toutes les propriétés
          </Link>
        </div>
      </footer>
    </div>
  );
}
