import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Bed, Bath, Square, MapPin, Phone, ChevronLeft, ChevronRight, ArrowLeft, Share2 } from 'lucide-react';
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

  const handleBack = () => navigate('/listings');

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
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!listing) return (
    <div className="min-h-screen bg-[var(--bg)] text-white flex flex-col items-center justify-center gap-6"
      style={{ fontFamily: "'Cormorant Garamond', serif" }}>
      <p className="text-2xl font-light text-[var(--text2)]">Bien non trouvé.</p>
      <button onClick={handleBack}
        className="text-[var(--accent)] text-xs font-sans tracking-[0.3em] uppercase hover:text-amber-300 transition-colors">
        ← Retour aux propriétés
      </button>
    </div>
  );

  const images = listing.images || [];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-white pb-24 md:pb-0"
      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>

      {/* ── BACK + SHARE — EN DEHORS DE L'IMAGE, sous le header ── */}
      <div className="pt-20 px-4 sm:px-6 md:px-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between py-4">
          <button onClick={handleBack}
            className="flex items-center gap-2 text-xs font-sans tracking-[0.2em] uppercase transition-all duration-200"
            style={{ color: 'var(--text2)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#FBBF24')}
            onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}>
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </button>

          <button onClick={handleShare}
            className="flex items-center gap-2 text-xs font-sans tracking-[0.2em] uppercase transition-all duration-200"
            style={{ color: copied ? '#FBBF24' : '#9CA3AF' }}
            onMouseEnter={e => { if (!copied) e.currentTarget.style.color = '#FBBF24'; }}
            onMouseLeave={e => { if (!copied) e.currentTarget.style.color = '#9CA3AF'; }}>
            <Share2 className="w-4 h-4" />
            <span>{copied ? 'Copié ✓' : 'Partager'}</span>
          </button>
        </div>
      </div>

      {/* ── IMAGE PRINCIPALE ── */}
      <div className="relative h-[45vh] sm:h-[60vh] overflow-hidden bg-[var(--bg3)] mx-4 sm:mx-6 md:mx-10 max-w-5xl md:mx-auto">
        {images.length > 0 ? (
          <img src={images[activeImg]} alt={listing.title}
            className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--text5)] font-sans text-sm">
            Aucune photo
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/60 via-transparent to-transparent" />

        {/* Flèches navigation */}
        {images.length > 1 && (
          <>
            <button onClick={() => setActiveImg(p => (p - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center transition-all duration-200"
              style={{ backgroundColor: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.15)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(251,191,36,0.6)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}>
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button onClick={() => setActiveImg(p => (p + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center transition-all duration-200"
              style={{ backgroundColor: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.15)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(251,191,36,0.6)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}>
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
            {/* Compteur */}
            <div className="absolute bottom-3 right-3 text-xs font-sans text-white/60 px-2 py-1"
              style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
              {activeImg + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* ── THUMBNAILS ── */}
      {images.length > 1 && (
        <div className="flex gap-2 px-4 sm:px-6 md:px-10 py-3 overflow-x-auto max-w-5xl md:mx-auto">
          {images.map((img: string, i: number) => (
            <button key={i} onClick={() => setActiveImg(i)}
              className="flex-shrink-0 w-14 h-10 overflow-hidden transition-all duration-200"
              style={{ border: `1px solid ${i === activeImg ? '#FBBF24' : 'rgba(255,255,255,0.08)'}`, opacity: i === activeImg ? 1 : 0.5 }}>
              <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {/* ── CONTENT ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-8 grid lg:grid-cols-3 gap-8 lg:gap-16">

        {/* LEFT */}
        <div className="lg:col-span-2">
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="h-px w-6 bg-[var(--accent)]" />
            <span className="text-[var(--accent)] text-xs font-sans tracking-[0.3em] uppercase">{listing.type}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light leading-tight mb-4">{listing.title}</h1>

          <div className="flex items-center gap-2 font-sans text-sm mb-8" style={{ color: 'var(--text3)' }}>
            <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(251,191,36,0.6)' }} />
            {listing.location}
          </div>

          {/* Specs */}
          <div className="grid grid-cols-3 gap-px mb-10" style={{ backgroundColor: 'var(--border2)' }}>
            {[
              { icon: Bed, value: listing.beds, label: 'Chambres' },
              { icon: Bath, value: listing.baths, label: 'SDB' },
              { icon: Square, value: listing.area?.toLocaleString(), label: 'sqft' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center py-5 px-2"
                style={{ backgroundColor: 'var(--bg3)' }}>
                <s.icon className="w-4 h-4 mb-2" style={{ color: 'rgba(251,191,36,0.5)' }} />
                <div className="text-xl sm:text-2xl font-light mb-1">{s.value}</div>
                <div className="text-[10px] font-sans tracking-[0.2em] uppercase" style={{ color: 'var(--text4)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-6 bg-[var(--accent)]" />
            <span className="text-[var(--accent)] text-xs font-sans tracking-[0.3em] uppercase">Description</span>
          </div>
          <p className="font-sans font-light text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text2)' }}>
            {listing.description ||
              `Découvrez ce ${listing.type?.toLowerCase()} d'exception situé à ${listing.location}. Cette propriété offre un confort inégalé avec des finitions premium et des équipements de standing international.`}
          </p>
        </div>

        {/* RIGHT — sticky price card */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 space-y-4">
            {/* Prix */}
            <div className="p-6" style={{ border: '1px solid var(--border)' }}>
              <div className="text-xs font-sans tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--text4)' }}>Prix</div>
              <div className="text-3xl sm:text-4xl font-light mb-1" style={{ color: 'var(--accent)' }}>
                AED {listing.price?.toLocaleString()}
              </div>
              <div className="text-xs font-sans" style={{ color: 'var(--text4)' }}>
                ≈ {Math.round((listing.price || 0) / 3.67).toLocaleString()} USD
              </div>
            </div>

            {/* CTA buttons */}
            <a href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}?text=Bonjour, je suis intéressé par: ${listing.title}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 text-xs font-sans font-bold tracking-[0.25em] uppercase hover:opacity-90 transition-opacity"
              style={{ backgroundColor: 'var(--accent)', color: '#000000' }}>
              <Phone className="w-4 h-4" /> WhatsApp
            </a>

            <Link to="/contact"
              className="flex items-center justify-center gap-3 w-full py-4 text-xs font-sans font-bold tracking-[0.25em] uppercase transition-all duration-200"
              style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(251,191,36,0.4)';
                e.currentTarget.style.color = '#FBBF24';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.color = '#fff';
              }}>
              Envoyer un message
            </Link>

            <div className="p-5" style={{ border: '1px solid var(--border2)' }}>
              <div className="text-xs font-sans tracking-[0.3em] uppercase mb-2" style={{ color: 'var(--text4)' }}>MoveSmart Invest</div>
              <p className="text-xs font-sans font-light leading-relaxed" style={{ color: 'var(--text4)' }}>
                Réponse sous 24h. Accompagnement complet Dubai.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-10 py-8 px-6" style={{ backgroundColor: 'var(--bg4)', borderTop: '1px solid var(--border2)' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs font-sans" style={{ color: 'var(--text5)' }}>© 2026 MoveSmart Invest.</p>
          <button onClick={handleBack} className="text-xs font-sans hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text5)' }}>
            ← Toutes les propriétés
          </button>
        </div>
      </footer>
    </div>
  );
}
