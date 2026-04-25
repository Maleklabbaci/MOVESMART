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
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center font-sans tracking-widest uppercase text-sm animate-pulse" style={{ backgroundColor: 'var(--bg)', color: 'var(--text3)' }}>
      Chargement...
    </div>
  );

  if (!listing) return (
    <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center gap-6" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <p className="font-sans uppercase tracking-widest text-sm" style={{ color: 'var(--text3)' }}>{t('not_found', 'Bien non trouvé.')}</p>
      <button onClick={handleBack} className="text-xs font-bold uppercase tracking-widest transition-colors" style={{ color: 'var(--accent)' }}>
        ← {t('back', 'Retour')}
      </button>
    </div>
  );

  const images = listing.images || [];

  return (
    <div className="min-h-screen pt-24 pb-20 transition-colors duration-300" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <div className="max-w-6xl mx-auto px-6">
        
        {/* ── BACK + SHARE ── */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b transition-colors duration-300" style={{ borderColor: 'var(--border)' }}>
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors"
            style={{ color: 'var(--text3)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text3)')}
          >
            <ArrowLeft className="w-3 h-3" />
            {t('back', 'Retour')}
          </button>
          
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors"
            style={{ color: copied ? 'var(--accent)' : 'var(--text3)' }}
            onMouseEnter={e => { if (!copied) e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseLeave={e => { if (!copied) e.currentTarget.style.color = 'var(--text3)'; }}
          >
            <Share2 className="w-3 h-3" />
            {copied ? t('copied', 'Copié ✓') : t('share', 'Partager')}
          </button>
        </div>

        {/* ── IMAGE PRINCIPALE ── */}
        <div className="relative aspect-[16/9] md:aspect-[21/9] bg-[#0a0a0a] mb-6 overflow-hidden border transition-colors duration-300" style={{ borderColor: 'var(--border)' }}>
          {images.length > 0 ? (
            <img 
              src={images[activeImg]} 
              alt={listing.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-sans tracking-widest text-xs uppercase" style={{ color: 'var(--text3)' }}>
              {t('listings_no_img', 'Aucune photo')}
            </div>
          )}

          {/* Flèches navigation */}
          {images.length > 1 && (
            <>
              <button 
                onClick={() => setActiveImg(p => (p - 1 + images.length) % images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center transition-all duration-200 backdrop-blur-md hover:bg-black/80"
                style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <button 
                onClick={() => setActiveImg(p => (p + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center transition-all duration-200 backdrop-blur-md hover:bg-black/80"
                style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Compteur */}
              <div 
                className="absolute bottom-4 right-4 px-3 py-1.5 text-[10px] font-bold font-sans tracking-widest backdrop-blur-md"
                style={{ backgroundColor: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
              >
                {activeImg + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {/* ── THUMBNAILS ── */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-6 scrollbar-hide">
            {images.map((img: string, i: number) => (
              <button 
                key={i} 
                onClick={() => setActiveImg(i)}
                className="flex-shrink-0 w-14 h-10 overflow-hidden transition-all duration-200"
                style={{ border: `1px solid ${i === activeImg ? 'var(--accent)' : 'var(--border)'}`, opacity: i === activeImg ? 1 : 0.5 }}
              >
                <img src={img} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>
        )}

        {/* ── CONTENT ── */}
        <div className="grid lg:grid-cols-3 gap-12 mt-8">
          
          {/* LEFT */}
          <div className="lg:col-span-2">
            <span className="font-bold uppercase tracking-widest text-[10px] mb-4 block" style={{ color: 'var(--accent)' }}>
              {listing.type}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-wider mb-6 leading-tight">
              {listing.title}
            </h1>
            <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest mb-12" style={{ color: 'var(--text3)' }}>
              <MapPin className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              {listing.location}
            </div>

            {/* Specs */}
            <div className="grid grid-cols-3 gap-6 py-8 border-y mb-12 transition-colors duration-300" style={{ borderColor: 'var(--border)' }}>
              {[
                { icon: Bed, value: listing.beds, label: t('beds_label', 'Chambres') },
                { icon: Bath, value: listing.baths, label: t('baths_label', 'SDB') },
                { icon: Square, value: listing.area?.toLocaleString(), label: t('sqft_label', 'sqft') },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <s.icon className="w-6 h-6 mx-auto mb-4" strokeWidth={1} style={{ color: 'var(--accent)' }} />
                  <div className="text-2xl font-bold font-sans mb-1">{s.value}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text3)' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="prose max-w-none">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-6" style={{ color: 'var(--text)' }}>
                {t('desc_label', 'Détails du bien')}
              </h2>
              <p className="font-light leading-loose text-sm md:text-base whitespace-pre-line" style={{ color: 'var(--text3)' }}>
                {listing.description || 
                 `Découvrez ce ${listing.type?.toLowerCase()} d'exception situé à ${listing.location}. Cette propriété offre un confort inégalé avec des finitions premium et des équipements de standing international.`}
              </p>
            </div>
          </div>

          {/* RIGHT — sticky price card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 p-8 border transition-all duration-300 shadow-sm" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
              
              {/* Prix */}
              <div className="mb-8 pb-8 border-b" style={{ borderColor: 'var(--border)' }}>
                <span className="block text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text3)' }}>
                  {t('price_label', 'Prix d\'acquisition')}
                </span>
                <div className="text-3xl font-bold font-sans tracking-wider mb-2" style={{ color: 'var(--text)' }}>
                  AED {listing.price?.toLocaleString()}
                </div>
                <div className="text-xs font-sans tracking-widest" style={{ color: 'var(--text3)' }}>
                  ≈ {Math.round((listing.price || 0) / 3.67).toLocaleString()} USD
                </div>
              </div>

              {/* CTA buttons */}
              <div className="space-y-4">
                <a 
                  href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g,'')}?text=Bonjour,%20je%20suis%20intéressé%20par%20la%20propriété:%20${listing.title}%20(${window.location.href})`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-colors border"
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
                  className="w-full py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center transition-opacity hover:opacity-90"
                  style={{ backgroundColor: 'var(--accent)', color: '#000000' }}
                >
                  {t('msg_btn', 'Envoyer une demande')}
                </Link>
              </div>

              <div className="mt-8 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text3)' }}>MoveSmart Invest</p>
                <p className="text-[10px] font-sans tracking-widest opacity-60" style={{ color: 'var(--text3)' }}>{t('team_note', 'Réponse sous 24h. Accompagnement complet Dubai.')}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
