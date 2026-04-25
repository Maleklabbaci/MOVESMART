import React, { useState, useEffect } from 'react';
import { Bed, Bath, Square, ChevronLeft, ChevronRight, Share2, Search, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useTranslation } from 'react-i18next'; // Ajout traduction

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
    <div className="min-h-screen pt-24 pb-20" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-bold uppercase tracking-widest text-sm mb-2 block" style={{ color: 'var(--accent)' }}>
              {t('listings_page_tag', 'Opportunités')}
            </span>
            <h1 className="text-4xl md:text-5xl font-light uppercase tracking-wider">
              {t('listings_page_title_1', 'Investissements')} <br/>
              <em className="font-serif italic text-5xl md:text-6xl lowercase text-transparent" style={{ WebkitTextStroke: '1px var(--text)' }}>
                {t('listings_page_title_em', 'sélectionnés')}
              </em>
            </h1>
          </div>
          <div className="text-sm font-sans tracking-widest uppercase" style={{ color: 'var(--text3)' }}>
            {loading ? '' : `${filtered.length} ${t('listings_page_tag', 'opportunité')}${filtered.length > 1 ? 's' : ''}`}
          </div>
        </div>

        {/* FILTERS */}
        <div className="mb-12 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text3)' }} />
              <input 
                type="text" 
                placeholder={t('search_ph', 'Rechercher par projet ou zone...')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full border rounded-sm pl-12 pr-4 py-4 text-sm font-sans focus:outline-none transition-colors"
                style={{ backgroundColor: 'transparent', borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-6 py-4 text-xs font-sans uppercase tracking-[0.2em] border transition-colors"
              style={{ backgroundColor: showFilters ? 'var(--accent-bg)' : 'transparent', borderColor: showFilters ? 'var(--accent)' : 'var(--border)', color: showFilters ? 'var(--accent)' : 'var(--text)' }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {t('filters_btn', 'Filtres')}
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 border rounded-sm animate-fade-in" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', filter: 'brightness(1.05)' }}>
              <div>
                <label className="block text-[10px] font-sans uppercase tracking-widest mb-2" style={{ color: 'var(--text3)' }}>{t('filter_min', 'Budget min (AED)')}</label>
                <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-full bg-transparent border-b outline-none py-2 text-sm font-sans" style={{ borderColor: 'var(--border)', color: 'var(--text)' }} />
              </div>
              <div>
                <label className="block text-[10px] font-sans uppercase tracking-widest mb-2" style={{ color: 'var(--text3)' }}>{t('filter_max', 'Budget max (AED)')}</label>
                <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-full bg-transparent border-b outline-none py-2 text-sm font-sans" style={{ borderColor: 'var(--border)', color: 'var(--text)' }} />
              </div>
              <div>
                <label className="block text-[10px] font-sans uppercase tracking-widest mb-2" style={{ color: 'var(--text3)' }}>{t('sort_label', 'Trier par')}</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full bg-transparent border-b outline-none py-2 text-sm font-sans cursor-pointer" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
                  <option value="default">{t('sort_recent', 'Récents')}</option>
                  <option value="price-low">{t('sort_price_low', 'Prix croissant')}</option>
                  <option value="price-high">{t('sort_price_high', 'Prix décroissant')}</option>
                  <option value="beds">{t('sort_beds', 'Chambres')}</option>
                  <option value="area">{t('sort_area', 'Surface')}</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] mb-4 border" style={{ backgroundColor: 'var(--border)', borderColor: 'var(--border)' }}></div>
                <div className="h-4 w-1/4 mb-2" style={{ backgroundColor: 'var(--border)' }}></div>
                <div className="h-6 w-3/4 mb-4" style={{ backgroundColor: 'var(--border)' }}></div>
                <div className="h-4 w-1/2" style={{ backgroundColor: 'var(--border)' }}></div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="col-span-full py-20 text-center border border-dashed rounded-sm" style={{ borderColor: 'var(--border)' }}>
              <p className="text-sm font-sans uppercase tracking-widest mb-2" style={{ color: 'var(--text3)' }}>
                {listings.length === 0 ? t('no_listings', 'Aucun bien disponible') : t('no_results', 'Aucun résultat')}
              </p>
            </div>
          ) : (
            filtered.map((l: any) => (
              <Link key={l.id} to={`/listings/${l.id}`} className="group block border rounded-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                <div className="aspect-[4/3] relative overflow-hidden bg-[#111]">
                  {l.images && l.images.length > 0 ? (
                    <img src={l.images[0]} alt={l.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs uppercase" style={{ color: 'var(--text3)' }}>{t('listings_no_img', 'Aucune photo')}</div>
                  )}
                  <div className="absolute top-4 left-4 px-3 py-1 text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
                    {l.type}
                  </div>
                </div>
                <div className="p-6" style={{ backgroundColor: 'var(--bg)' }}>
                  <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider mb-3" style={{ color: 'var(--text3)' }}>
                    <MapPin className="w-3 h-3" style={{ color: 'var(--accent)' }} />
                    {l.location}
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-wider mb-4 line-clamp-1" style={{ color: 'var(--text)' }}>{l.title}</h3>
                  <div className="flex items-center gap-4 text-xs font-sans uppercase tracking-widest mb-6" style={{ color: 'var(--text3)' }}>
                    <span className="flex items-center gap-1"><Bed className="w-3 h-3" /> {l.beds} {t('sort_beds', 'ch.')}</span>
                    <span className="flex items-center gap-1"><Bath className="w-3 h-3" /> {l.baths} sdb.</span>
                    <span className="flex items-center gap-1"><Square className="w-3 h-3" /> {l.area?.toLocaleString()} {t('sqft_label', 'sqft')}</span>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-lg font-bold font-sans" style={{ color: 'var(--text)' }}>
                      AED {l.price?.toLocaleString()}
                    </div>
                    <div className="text-xs font-bold uppercase tracking-widest transition-transform group-hover:translate-x-1" style={{ color: 'var(--accent)' }}>
                      {t('view_detail', 'Analyser →')}
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