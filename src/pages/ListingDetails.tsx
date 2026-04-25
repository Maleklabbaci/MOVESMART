import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Bed, Bath, Square, MapPin, Phone, ChevronLeft, ChevronRight, ArrowLeft, Share2, Mail } from 'lucide-react';
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
    <div className="min-h-screen pt-40 pb-32 flex items-center justify-center text-sm font-bold tracking-widest uppercase animate-pulse" style={{ backgroundColor: 'var(--bg)', color: 'var(--text3)' }}>
      Chargement...
    </div>
  );

  if (!listing) return (
    <div className="min-h-screen pt-40 pb-32 flex flex-col items-center justify-center gap-8" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <p className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--text3)' }}>{t('not_found', 'Bien non trouvé.')}</p>
      <button onClick={handleBack} className="px-10 py-5 rounded-full font-bold uppercase tracking-widest text-[11px] bg-amber-500 text-black">
        ← {t('back', 'Retour')}
      </button>
    </div>
  );

  const images = listing.images || [];

  return (
    <div className="min-h-screen pt-32 pb-40 transition-colors duration-400" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* ── BACK + SHARE ── */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b transition-colors duration-400 animate-fade-in-up" style={{ borderColor: 'var(--border)' }}>
          <button 
            onClick={handleBack}
            className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors hover:text-[var(--text)]"
            style={{ color: 'var(--text3)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            {t('back', 'Retour aux opportunités')}
          </button>
          
          <button 
            onClick={handleShare}
            className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors hover:text-[var(--text)]"
            style={{ color: copied ? 'var(--text)' : 'var(--text3)' }}
          >
            <Share2 className="w-4 h-4" />
            {copied ? t('copied', 'Lien copié ✓') : t('share', 'Partager')}
          </button>
        </div>

        {/* ── IMAGE PRINCIPALE ── */}
        <div className="relative aspect-[16/9] md:aspect-[21/9] bg-black/5 mb-6 overflow-hidden rounded-[32px] shadow-sm border transition-all duration-400 animate-fade-in-up delay-100" style={{ borderColor: 'var(--border)' }}>
          {images.length > 0 ? (
            <img 
              src={images[activeImg]} 
              alt={listing.title} 
              className="w-full h-full object-cover transition-opacity duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text3)' }}>
              {t('listings_no_img', 'Aucune photo disponible')}
            </div>
          )}

          {/* Flèches navigation */}
          {images.length > 1 && (
            <>
              <button 
                onClick={() => setActiveImg(p => (p - 1 + images.length) % images.length)}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center transition-all duration-300 backdrop-blur-xl rounded-full shadow-2xl hover:scale-110"
                style={{ backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button 
                onClick={() => setActiveImg(p => (p + 1) % images.length)}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center transition-all duration-300 backdrop-blur-xl rounded-full shadow-2xl hover:scale-110"
                style={{ backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Compteur */}
              <div 
                className="absolute bottom-6 right-6 px-5 py-2.5 text-[11px] font-bold tracking-[0.2em] uppercase rounded-full shadow-2xl backdrop-blur-xl"
                style={{ backgroundColor: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
              >
                {activeImg + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {/* ── THUMBNAILS ── */}
        {images.length > 1 && (
          <div className="flex gap-4 overflow-x-auto pb-10 scrollbar-hide animate-fade-in-up delay-200">
            {images.map((img: string, i: number) => (
              <button 
                key={i} 
                onClick={() => setActiveImg(i)}
                className="flex-shrink-0 w-28 h-20 overflow-hidden transition-all duration-300 rounded-[12px] shadow-sm hover:opacity-100"
                style={{ border: `2px solid ${i === activeImg ? 'var(--text)' : 'transparent'}`, opacity: i === activeImg ? 1 : 0.4 }}
              >
                <img src={img} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>
        )}

        {/* ── CONTENT ── */}
        <div className="grid lg:grid-cols-3 gap-20 mt-10 animate-fade-in-up delay-300">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2">
            <span className="font-bold uppercase tracking-[0.2em] text-[11px] mb-8 inline-block py-2 px-5 rounded-full border" style={{ color: 'var(--text)', borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
              {listing.type}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.05]">
              {listing.title}
            </h1>
            <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest mb-16" style={{ color: 'var(--text3)' }}>
              <MapPin className="w-5 h-5 text-amber-500" />
              {listing.location}
            </div>

            {/* Specs */}
            <div className="grid grid-cols-3 gap-8 py-12 border-y mb-16 transition-colors duration-400" style={{ borderColor: 'var(--border)' }}>
              {[
                { icon: Bed, value: listing.beds, label: t('beds_label', 'Chambres') },
                { icon: Bath, value: listing.baths, label: t('baths_label', 'Salles de bain') },
                { icon: Square, value: listing.area?.toLocaleString(), label: t('sqft_label', 'Superficie (sqft)') },
              ].map((s, i) => (
                <div key={i} className="flex flex-col gap-5 text-center items-center">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                    <s.icon className="w-7 h-7 text-amber-500" strokeWidth={1.5} />
                  </div>
                  <div className="text-4xl font-bold tracking-tighter">{s.value}</div>
                  <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--text3)' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="prose max-w-none">
              <h2 className="text-[13px] font-bold uppercase tracking-[0.2em] mb-8 border-b pb-4 inline-block" style={{ color: 'var(--text)', borderColor: 'var(--text)' }}>
                {t('desc_label', 'Description du projet')}
              </h2>
              <p className="font-light leading-[2.2] text-[16px] md:text-lg whitespace-pre-line" style={{ color: 'var(--text3)' }}>
                {listing.description || 
                 `Découvrez cet investissement ${listing.type?.toLowerCase()} d'exception situé à ${listing.location}. \n\nCette propriété offre un confort inégalé avec des finitions premium et des équipements de standing international. Idéal pour générer un rendement locatif sécurisé (6-8%) ou pour une revente avec plus-value.`}
              </p>
            </div>
          </div>

          {/* RIGHT — sticky price card */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 p-10 md:p-12 rounded-[32px] border shadow-2xl transition-all duration-400" style={{ backgroundColor: 'var(--header-bg)', borderColor: 'var(--border)', backdropFilter: 'blur(20px)' }}>
              
              {/* Prix */}
              <div className="mb-10 pb-10 border-b" style={{ borderColor: 'var(--border)' }}>
                <span className="block text-[11px] font-bold uppercase tracking-[0.2em] mb-6" style={{ color: 'var(--text3)' }}>
                  {t('price_label', 'Prix d\'investissement')}
                </span>
                <div className="text-5xl font-bold tracking-tighter mb-4" style={{ color: 'var(--text)' }}>
                  AED {listing.price?.toLocaleString()}
                </div>
                <div className="text-[13px] font-bold tracking-widest uppercase" style={{ color: 'var(--text3)' }}>
                  ≈ {Math.round((listing.price || 0) / 3.67).toLocaleString()} USD
                </div>
              </div>

              {/* CTA buttons */}
              <div className="space-y-4">
                <Link 
                  to="/contact" 
                  className="w-full py-5 rounded-full text-[12px] font-bold uppercase tracking-[0.1em] flex items-center justify-center gap-3 transition-transform hover:scale-105 shadow-xl text-black"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  <Mail className="w-5 h-5" />
                  {t('msg_btn', 'Être contacté')}
                </Link>

                <a 
                  href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g,'')}?text=Bonjour,%20je%20suis%20intéressé%20par%20l'investissement:%20${listing.title}%20(${window.location.href})`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full py-5 rounded-full text-[12px] font-bold uppercase tracking-[0.1em] flex items-center justify-center gap-3 transition-colors border"
                  style={{ backgroundColor: 'transparent', borderColor: 'var(--border)', color: 'var(--text)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'var(--text)';
                    e.currentTarget.style.color = 'var(--bg)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text)';
                  }}
                >
                  <Phone className="w-5 h-5" />
                  {t('wa_btn', 'WhatsApp Rapide')}
                </a>
              </div>

              <div className="mt-10 pt-8 border-t flex flex-col gap-3 text-center" style={{ borderColor: 'var(--border)' }}>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-500">MoveSmart Consultancy</p>
                <p className="text-[11px] font-bold tracking-widest uppercase leading-relaxed" style={{ color: 'var(--text3)' }}>{t('team_note', 'Analyse du ROI et accompagnement juridique inclus.')}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
