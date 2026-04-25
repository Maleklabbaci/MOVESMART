import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Bed, Bath, Square, MapPin, Phone, ChevronLeft, ChevronRight, ArrowLeft, Share2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { companyInfo } from '../constants';
import { useTranslation } from 'react-i18next'; 

export default function ListingDetails() {
  const { t } = useTranslation();
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
    <div className="min-h-screen pt-40 pb-32 flex items-center justify-center text-[11px] font-semibold tracking-widest uppercase animate-pulse" style={{ backgroundColor: 'var(--bg)', color: 'var(--text3)' }}>
      Chargement...
    </div>
  );

  if (!listing) return (
    <div className="min-h-screen pt-40 pb-32 flex flex-col items-center justify-center gap-8" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text3)' }}>{t('not_found', 'Bien non trouvé.')}</p>
      <button onClick={handleBack} className="text-[11px] font-bold uppercase tracking-widest transition-colors hover:opacity-80 px-6 py-3 rounded" style={{ backgroundColor: 'var(--accent)', color: '#000' }}>
        ← {t('back', 'Retour')}
      </button>
    </div>
  );

  const images = listing.images || [];

  return (
    <div className="min-h-screen pt-32 pb-32 transition-colors duration-400" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* ── BACK + SHARE ── */}
        <div className="flex items-center justify-between mb-10 pb-6 border-b transition-colors duration-400 animate-fade-in" style={{ borderColor: 'var(--border)' }}>
          <button 
            onClick={handleBack}
            className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors hover:text-amber-500"
            style={{ color: 'var(--text3)' }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t('back', 'Retour')}
          </button>
          
          <button 
            onClick={handleShare}
            className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
            style={{ color: copied ? 'var(--accent)' : 'var(--text3)' }}
          >
            <Share2 className="w-3.5 h-3.5" />
            {copied ? t('copied', 'Copié ✓') : t('share', 'Partager')}
          </button>
        </div>

        {/* ── IMAGE PRINCIPALE ── */}
        <div className="relative aspect-[16/9] md:aspect-[21/9] bg-black/5 mb-8 overflow-hidden rounded shadow-xl border transition-all duration-400 animate-fade-in" style={{ borderColor: 'var(--border)' }}>
          {images.length > 0 ? (
            <img 
              src={images[activeImg]} 
              alt={listing.title} 
              className="w-full h-full object-cover transition-opacity duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[11px] font-semibold tracking-widest uppercase" style={{ color: 'var(--text3)' }}>
              {t('listings_no_img', 'Aucune photo')}
            </div>
          )}

          {/* Flèches navigation */}
          {images.length > 1 && (
            <>
              <button 
                onClick={() => setActiveImg(p => (p - 1 + images.length) % images.length)}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center transition-all duration-300 backdrop-blur-xl rounded-full shadow-lg hover:scale-110"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button 
                onClick={() => setActiveImg(p => (p + 1) % images.length)}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center transition-all duration-300 backdrop-blur-xl rounded-full shadow-lg hover:scale-110"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Compteur */}
              <div 
                className="absolute bottom-6 right-6 px-4 py-2 text-[10px] font-bold tracking-[0.2em] uppercase rounded shadow-lg backdrop-blur-xl"
                style={{ backgroundColor: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
              >
                {activeImg + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {/* ── THUMBNAILS ── */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-10 scrollbar-hide animate-fade-in">
            {images.map((img: string, i: number) => (
              <button 
                key={i} 
                onClick={() => setActiveImg(i)}
                className="flex-shrink-0 w-20 h-14 overflow-hidden transition-all duration-300 rounded shadow-sm hover:opacity-100"
                style={{ border: `2px solid ${i === activeImg ? 'var(--accent)' : 'transparent'}`, opacity: i === activeImg ? 1 : 0.4 }}
              >
                <img src={img} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>
        )}

        {/* ── CONTENT ── */}
        <div className="grid lg:grid-cols-3 gap-16 mt-8 animate-fade-in">
          
          {/* LEFT */}
          <div className="lg:col-span-2">
            <span className="font-semibold uppercase tracking-[0.2em] text-[10px] mb-5 block text-gold">
              {listing.type}
            </span>
            <h1 className="text-4xl md:text-6xl font-serif tracking-tight mb-8 leading-tight">
              {listing.title}
            </h1>
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-widest mb-16" style={{ color: 'var(--text3)' }}>
              <MapPin className="w-4 h-4 text-gold" />
              {listing.location}
            </div>

            {/* Specs */}
            <div className="grid grid-cols-3 gap-8 py-10 border-y mb-16 transition-colors duration-400" style={{ borderColor: 'var(--border)' }}>
              {[
                { icon: Bed, value: listing.beds, label: t('beds_label', 'Chambres') },
                { icon: Bath, value: listing.baths, label: t('baths_label', 'SDB') },
                { icon: Square, value: listing.area?.toLocaleString(), label: t('sqft_label', 'sqft') },
              ].map((s, i) => (
                <div key={i} className="text-center group">
                  <s.icon className="w-7 h-7 mx-auto mb-5 text-gold transition-transform group-hover:-translate-y-1" strokeWidth={1.5} />
                  <div className="text-3xl font-serif mb-2">{s.value}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text3)' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="prose max-w-none">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-8" style={{ color: 'var(--text)' }}>
                {t('desc_label', 'Détails du bien')}
              </h2>
              <p className="font-light leading-[2] text-[15px] md:text-base whitespace-pre-line" style={{ color: 'var(--text3)' }}>
                {listing.description || 
                 `Découvrez ce ${listing.type?.toLowerCase()} d'exception situé à ${listing.location}. Cette propriété offre un confort inégalé avec des finitions premium et des équipements de standing international.`}
              </p>
            </div>
          </div>

          {/* RIGHT — sticky price card */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 p-10 border rounded shadow-2xl transition-all duration-400" style={{ backgroundColor: 'var(--header-bg)', borderColor: 'var(--border)', backdropFilter: 'blur(10px)' }}>
              
              {/* Prix */}
              <div className="mb-10 pb-10 border-b" style={{ borderColor: 'var(--border)' }}>
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-5" style={{ color: 'var(--text3)' }}>
                  {t('price_label', 'Prix d\'acquisition')}
                </span>
                <div className="text-4xl font-medium tracking-tight mb-3" style={{ color: 'var(--text)' }}>
                  AED {listing.price?.toLocaleString()}
                </div>
                <div className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--text3)' }}>
                  ≈ {Math.round((listing.price || 0) / 3.67).toLocaleString()} USD
                </div>
              </div>

              {/* CTA buttons */}
              <div className="space-y-5">
                <a 
                  href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g,'')}?text=Bonjour,%20je%20suis%20intéressé%20par%20la%20propriété:%20${listing.title}%20(${window.location.href})`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full py-5 text-[11px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all border rounded hover:shadow-md"
                  style={{ backgroundColor: 'transparent', borderColor: 'var(--border)', color: 'var(--text)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.color = 'var(--accent)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.color = 'var(--text)';
                  }}
                >
                  <Phone className="w-4 h-4" />
                  {t('wa_btn', 'WhatsApp')}
                </a>
                
                <Link 
                  to="/contact" 
                  className="w-full py-5 text-[11px] font-bold uppercase tracking-[0.2em] flex items-center justify-center transition-all hover:scale-[1.02] shadow-lg rounded"
                  style={{ backgroundColor: 'var(--accent)', color: '#000000' }}
                >
                  {t('msg_btn', 'Envoyer une demande')}
                </Link>
              </div>

              <div className="mt-10 text-center pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3 text-gold">MoveSmart Invest</p>
                <p className="text-[10px] font-semibold tracking-widest uppercase leading-relaxed opacity-70" style={{ color: 'var(--text3)' }}>{t('team_note', 'Réponse sous 24h. Accompagnement complet Dubai.')}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
