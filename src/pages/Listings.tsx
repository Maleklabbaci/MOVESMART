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
    <div className="min-h-screen pt-32 pb-40" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 animate-fade-in">
          <div>
            <span className="inline-block mb-6 text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
              {t('listings_page_tag', 'Opportunités')}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-wider uppercase leading-tight" style={{ color: 'var(--text)' }}>
              {t('listings_page_title_1', 'Investissements')} <br/>
              <span className="font-serif-italic lowercase" style={{ color: 'var(--accent)' }}>
                {t('listings_page_title_em', 'sélectionnés')}
              </span>
            </h1>
          </div>
          <div className="text-xs font-bold tracking-[0.2em] uppercase py-2 px-4 border" style={{ color: 'var(--text3)', borderColor: 'rgba(255,255,255,0.1)' }}>
            {loading ? '...' : `${filtered.length} ${t('listings_page_tag', 'opportunité')}${filtered.length > 1 ? 's' : ''}`}
          </div>
        </div>

        {/* FILTERS */}
        <div className="mb-16 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors" style={{ color: 'var(--text3)' }} />
              <input 
                type="text" 
                placeholder={t('search_ph', 'Rechercher par projet ou zone...')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-14 py-4 text-sm font-sans focus:outline-none transition-all"
                style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text)' }}
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-3 px-8 py-4 text-xs font-bold uppercase tracking-wider transition-all"
              style={{ 
                backgroundColor: showFilters ? 'var(--accent)' : 'transparent', 
                border: '1px solid',
                borderColor: showFilters ? 'var(--accent)' : 'rgba(255,255,255,0.1)', 
                color: showFilters ? '#000' : 'var(--text)'
              }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {t('filters_btn', 'Filtres')}
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-8 animate-fade-in" style={{ backgroundColor: 'var(--header-bg)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text3)' }}>{t('filter_min', 'Budget min (AED)')}</label>
                <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-full bg-transparent border-b outline-none py-3 text-sm font-sans transition-colors" style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'var(--text)' }} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text3)' }}>{t('filter_max', 'Budget max (AED)')}</label>
                <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-full bg-transparent border-b outline-none py-3 text-sm font-sans transition-colors" style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'var(--text)' }} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text3)' }}>{t('sort_label', 'Trier par')}</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full bg-transparent border-b outline-none py-3 text-sm font-sans cursor-pointer transition-colors" style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'var(--text)' }}>
                  <option value="default" className="bg-black text-white">{t('sort_recent', 'Récents')}</option>
                  <option value="price-low" className="bg-black text-white">{t('sort_price_low', 'Prix croissant')}</option>
                  <option value="price-high" className="bg-black text-white">{t('sort_price_high', 'Prix décroissant')}</option>
                  <option value="beds" className="bg-black text-white">{t('sort_beds', 'Chambres')}</option>
                  <option value="area" className="bg-black text-white">{t('sort_area', 'Surface')}</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse p-4" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <div className="aspect-[4/3] mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}></div>
                <div className="h-5 w-1/4 mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}></div>
                <div className="h-8 w-3/4 mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}></div>
                <div className="h-5 w-1/2" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}></div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="col-span-full py-40 text-center" style={{ border: '1px dashed rgba(255,255,255,0.2)' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text3)' }}>
                {listings.length === 0 ? t('no_listings', 'Aucune opportunité disponible') : t('no_results', 'Aucun résultat trouvé pour votre recherche')}
              </p>
            </div>
          ) : (
            filtered.map((l: any) => (
              <Link key={l.id} to={`/listings/${l.id}`} className="group flex flex-col overflow-hidden transition-all hover:-translate-y-1" style={{ backgroundColor: 'transparent' }}>
                <div className="aspect-[4/3] relative overflow-hidden">
                  {l.images && l.images.length > 0 ? (
                    <img src={l.images[0]} alt={l.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold tracking-widest uppercase" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text3)' }}>{t('listings_no_img', 'Aucune photo')}</div>
                  )}
                  <div className="absolute top-4 left-4 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
                    {l.type}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text3)' }}>
                    <MapPin className="w-3 h-3 text-amber-500" />
                    {l.location}
                  </div>
                  <h3 className="text-xl font-bold tracking-wider uppercase mb-5 line-clamp-1 transition-colors flex-1" style={{ color: 'var(--text)' }}>{l.title}</h3>
                  
                  <div className="flex items-center gap-4 mb-6 pt-6 text-[10px] font-bold uppercase tracking-widest" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', color: 'var(--text3)' }}>
                    <span className="flex items-center gap-1.5"><Bed className="w-3 h-3 text-amber-500" /> {l.beds} {t('sort_beds', 'ch.')}</span>
                    <span className="flex items-center gap-1.5"><Bath className="w-3 h-3 text-amber-500" /> {l.baths} sdb.</span>
                    <span className="flex items-center gap-1.5"><Square className="w-3 h-3 text-amber-500" /> {l.area?.toLocaleString()} {t('sqft_label', 'sqft')}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div className="text-lg font-bold font-sans" style={{ color: 'var(--text)' }}>
                      AED {l.price?.toLocaleString()}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-amber-500 group-hover:translate-x-1 transition-transform">
                      {t('view_detail', 'Détails →')}
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
