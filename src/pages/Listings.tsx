import React, { useState, useEffect } from 'react';
import { Bed, Bath, Square, ChevronLeft, ChevronRight, Share2, Search, SlidersHorizontal, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useTranslation } from 'react-i18next'; 

export default function Listings() {
  const { t } = useTranslation();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    supabase.from('listings').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setListings(data || []); setLoading(false); });
  }, []);

  const filtered = listings
    .filter((l: any) => {
      const s = search.toLowerCase();
      const match = l.title?.toLowerCase().includes(s) || l.location?.toLowerCase().includes(s);
      const min = minPrice === '' || l.price >= Number(minPrice);
      const max = maxPrice === '' || l.price <= Number(maxPrice);
      return match && min && max;
    })
    .sort((a: any, b: any) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'beds') return b.beds - a.beds;
      if (sortBy === 'area') return b.area - a.area;
      return 0;
    });

  return (
    <div className="min-h-screen pt-40 pb-40" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* HEADER - OLD MONEY LUXURY */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24 animate-fade-in">
          <div>
            <span className="tag-gold">
              {t('listings_page_tag', 'Nos Opportunités')}
            </span>
            <h1 className="text-6xl md:text-[90px] font-serif tracking-tighter leading-[0.95]" style={{ color: 'var(--text)' }}>
              {t('listings_page_title_1', 'Investissements')} <br/>
              <span className="font-serif-italic text-accent">
                {t('listings_page_title_em', 'sélectionnés.')}
              </span>
            </h1>
          </div>
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] py-3 px-6 border" style={{ color: 'var(--text)', backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            {loading ? '...' : `${filtered.length} ${t('listings_page_tag', 'opportunité')}${filtered.length > 1 ? 's' : ''}`}
          </div>
        </div>

        {/* FILTERS */}
        <div className="mb-20 space-y-6 animate-fade-in delay-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors text-accent" />
              <input 
                type="text" 
                placeholder={t('search_ph', 'Rechercher un projet, une zone (ex: Marina, Downtown)...')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full border px-16 py-5 text-sm font-medium focus:outline-none transition-all focus:border-accent"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-3 px-10 py-5 text-[11px] font-bold uppercase tracking-[0.2em] transition-all border hover:border-accent"
              style={{ 
                backgroundColor: showFilters ? 'var(--text)' : 'var(--surface)', 
                borderColor: showFilters ? 'var(--text)' : 'var(--border)', 
                color: showFilters ? 'var(--bg)' : 'var(--text)'
              }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {t('filters_btn', 'Filtres')}
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 p-12 animate-fade-in border shadow-2xl" style={{ backgroundColor: 'var(--header-bg)', borderColor: 'var(--border)', backdropFilter: 'blur(20px)' }}>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--text3)' }}>{t('filter_min', 'Budget min (AED)')}</label>
                <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-full bg-transparent border-b outline-none py-4 text-lg font-serif transition-colors focus:border-accent" style={{ borderColor: 'var(--border)', color: 'var(--text)' }} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--text3)' }}>{t('filter_max', 'Budget max (AED)')}</label>
                <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-full bg-transparent border-b outline-none py-4 text-lg font-serif transition-colors focus:border-accent" style={{ borderColor: 'var(--border)', color: 'var(--text)' }} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--text3)' }}>{t('sort_label', 'Trier par')}</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full bg-transparent border-b outline-none py-4 text-lg font-serif cursor-pointer transition-colors focus:border-accent" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
                  <option value="default" style={{ backgroundColor: 'var(--bg)' }}>{t('sort_recent', 'Récents')}</option>
                  <option value="price-low" style={{ backgroundColor: 'var(--bg)' }}>{t('sort_price_low', 'Prix croissant')}</option>
                  <option value="price-high" style={{ backgroundColor: 'var(--bg)' }}>{t('sort_price_high', 'Prix décroissant')}</option>
                  <option value="beds" style={{ backgroundColor: 'var(--bg)' }}>{t('sort_beds', 'Chambres')}</option>
                  <option value="area" style={{ backgroundColor: 'var(--bg)' }}>{t('sort_area', 'Surface')}</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* GRID LUXE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse p-6 border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                <div className="aspect-[4/3] mb-8" style={{ backgroundColor: 'var(--border)' }}></div>
                <div className="h-6 w-1/4 mb-5" style={{ backgroundColor: 'var(--border)' }}></div>
                <div className="h-10 w-3/4 mb-8" style={{ backgroundColor: 'var(--border)' }}></div>
                <div className="h-6 w-1/2" style={{ backgroundColor: 'var(--border)' }}></div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="col-span-full py-40 text-center border border-dashed" style={{ borderColor: 'var(--border)' }}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--text3)' }}>
                {listings.length === 0 ? t('no_listings', 'Aucune opportunité disponible') : t('no_results', 'Aucun résultat trouvé pour votre recherche')}
              </p>
            </div>
          ) : (
            filtered.map((l: any, i) => (
              <Link key={l.id} to={`/listings/${l.id}`} className="group card-border flex flex-col p-5 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="aspect-[4/3] relative overflow-hidden mb-8 bg-black/5">
                  {l.images && l.images.length > 0 ? (
                    <img src={l.images[0]} alt={l.title} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--text3)' }}>{t('listings_no_img', 'Aucune photo')}</div>
                  )}
                  <div className="absolute top-5 left-5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-md" style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {l.type}
                  </div>
                </div>
                <div className="px-3 pb-3 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] mb-5" style={{ color: 'var(--text3)' }}>
                    <MapPin className="w-3.5 h-3.5 text-accent" strokeWidth={2} />
                    {l.location}
                  </div>
                  <h3 className="text-3xl font-serif tracking-tighter mb-8 line-clamp-2 transition-colors flex-1 group-hover:text-accent" style={{ color: 'var(--text)' }}>{l.title}</h3>
                  
                  <div className="grid grid-cols-3 gap-4 mb-8 pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex flex-col gap-2 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text3)' }}>
                      <span className="flex items-center gap-2 text-xl font-serif" style={{ color: 'var(--text)' }}><Bed className="w-4 h-4 text-accent" /> {l.beds}</span> {t('sort_beds', 'ch.')}
                    </div>
                    <div className="flex flex-col gap-2 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text3)' }}>
                      <span className="flex items-center gap-2 text-xl font-serif" style={{ color: 'var(--text)' }}><Bath className="w-4 h-4 text-accent" /> {l.baths}</span> sdb.
                    </div>
                    <div className="flex flex-col gap-2 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text3)' }}>
                      <span className="flex items-center gap-2 text-xl font-serif" style={{ color: 'var(--text)' }}><Square className="w-4 h-4 text-accent" /> {l.area?.toLocaleString()}</span> {t('sqft_label', 'sqft')}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-3xl font-serif tracking-tighter" style={{ color: 'var(--text)' }}>
                      AED {l.price?.toLocaleString()}
                    </div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 border" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}>
                      <ChevronRight className="w-5 h-5 text-accent" />
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
