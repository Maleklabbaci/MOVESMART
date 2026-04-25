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
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 animate-fade-in-up">
          <div>
            <span className="inline-block py-1.5 px-4 rounded-full border mb-6 text-[10px] font-bold tracking-widest uppercase" style={{ borderColor: 'var(--border)', color: 'var(--text3)' }}>
              {t('listings_page_tag', 'Nos Opportunités')}
            </span>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.95]" style={{ color: 'var(--text)' }}>
              {t('listings_page_title_1', 'Investissements')} <br/>
              <span className="font-serif-italic font-normal text-amber-500 block mt-1">
                {t('listings_page_title_em', 'sélectionnés.')}
              </span>
            </h1>
          </div>
          <div className="text-[11px] font-bold uppercase tracking-widest py-3 px-6 rounded-full border" style={{ color: 'var(--text)', backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            {loading ? '...' : `${filtered.length} ${t('listings_page_tag', 'opportunité')}${filtered.length > 1 ? 's' : ''}`}
          </div>
        </div>

        {/* FILTERS */}
        <div className="mb-16 space-y-6 animate-fade-in-up delay-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors text-amber-500" />
              <input 
                type="text" 
                placeholder={t('search_ph', 'Rechercher par projet ou zone...')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full border rounded-full px-16 py-5 text-sm font-medium focus:outline-none transition-all shadow-sm focus:border-amber-500"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-3 px-10 py-5 text-[11px] font-bold uppercase tracking-widest rounded-full transition-all border"
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-10 rounded-3xl animate-slide-down border shadow-2xl" style={{ backgroundColor: 'var(--header-bg)', borderColor: 'var(--border)', backdropFilter: 'blur(20px)' }}>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text3)' }}>{t('filter_min', 'Budget min (AED)')}</label>
                <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-full bg-transparent border-b-2 outline-none py-3 text-lg font-bold transition-colors focus:border-amber-500" style={{ borderColor: 'var(--border)', color: 'var(--text)' }} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text3)' }}>{t('filter_max', 'Budget max (AED)')}</label>
                <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-full bg-transparent border-b-2 outline-none py-3 text-lg font-bold transition-colors focus:border-amber-500" style={{ borderColor: 'var(--border)', color: 'var(--text)' }} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text3)' }}>{t('sort_label', 'Trier par')}</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full bg-transparent border-b-2 outline-none py-3 text-lg font-bold cursor-pointer transition-colors focus:border-amber-500" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
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

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse p-4 rounded-[24px] border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                <div className="aspect-[4/3] mb-6 rounded-xl" style={{ backgroundColor: 'var(--border)' }}></div>
                <div className="h-5 w-1/4 mb-4 rounded" style={{ backgroundColor: 'var(--border)' }}></div>
                <div className="h-8 w-3/4 mb-6 rounded" style={{ backgroundColor: 'var(--border)' }}></div>
                <div className="h-5 w-1/2 rounded" style={{ backgroundColor: 'var(--border)' }}></div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="col-span-full py-40 text-center rounded-[32px] border-dashed border-2" style={{ borderColor: 'var(--border)' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text3)' }}>
                {listings.length === 0 ? t('no_listings', 'Aucune opportunité disponible') : t('no_results', 'Aucun résultat trouvé pour votre recherche')}
              </p>
            </div>
          ) : (
            filtered.map((l: any, i) => (
              <Link key={l.id} to={`/listings/${l.id}`} className="group flex flex-col p-4 overflow-hidden rounded-[32px] border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl animate-fade-in-up" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', animationDelay: `${i * 50}ms` }}>
                <div className="aspect-[4/3] relative overflow-hidden rounded-[24px] mb-6 bg-black/5">
                  {l.images && l.images.length > 0 ? (
                    <img src={l.images[0]} alt={l.title} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[11px] font-bold tracking-widest uppercase" style={{ color: 'var(--text3)' }}>{t('listings_no_img', 'Aucune photo')}</div>
                  )}
                  <div className="absolute top-4 left-4 px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg backdrop-blur-md" style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
                    {l.type}
                  </div>
                </div>
                <div className="px-4 pb-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text3)' }}>
                    <MapPin className="w-3.5 h-3.5 text-amber-500" strokeWidth={2.5} />
                    {l.location}
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight mb-6 line-clamp-2 transition-colors flex-1" style={{ color: 'var(--text)' }}>{l.title}</h3>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex flex-col gap-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text3)' }}>
                      <span className="flex items-center gap-1.5 text-lg font-bold" style={{ color: 'var(--text)' }}><Bed className="w-4 h-4 text-amber-500" /> {l.beds}</span> {t('sort_beds', 'ch.')}
                    </div>
                    <div className="flex flex-col gap-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text3)' }}>
                      <span className="flex items-center gap-1.5 text-lg font-bold" style={{ color: 'var(--text)' }}><Bath className="w-4 h-4 text-amber-500" /> {l.baths}</span> sdb.
                    </div>
                    <div className="flex flex-col gap-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text3)' }}>
                      <span className="flex items-center gap-1.5 text-lg font-bold" style={{ color: 'var(--text)' }}><Square className="w-4 h-4 text-amber-500" /> {l.area?.toLocaleString()}</span> {t('sqft_label', 'sqft')}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-2xl font-bold tracking-tighter" style={{ color: 'var(--text)' }}>
                      AED {l.price?.toLocaleString()}
                    </div>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: 'var(--text)', color: 'var(--bg)' }}>
                      <ChevronRight className="w-5 h-5" />
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
