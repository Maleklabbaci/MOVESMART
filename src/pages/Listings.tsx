import React, { useState, useEffect } from 'react';
import { Bed, Bath, Square, ChevronLeft, ChevronRight, Share2, Search, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const ListingCard = ({ listing }: { listing: any }) => {
  const [idx, setIdx] = useState(0);
  const images = listing.images || [];
  const next = (e: React.MouseEvent) => { e.preventDefault(); setIdx(p => (p + 1) % images.length); };
  const prev = (e: React.MouseEvent) => { e.preventDefault(); setIdx(p => (p - 1 + images.length) % images.length); };
  const share = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}/listings/${listing.id}`;
    navigator.share ? navigator.share({ title: listing.title, url }).catch(console.error) : navigator.clipboard.writeText(url);
  };

  return (
    <Link to={`/listings/${listing.id}`} className="group block">
      <div className="aspect-[4/3] overflow-hidden bg-white/[0.03] mb-5 relative">
        {images.length > 0
          ? <img src={images[idx]} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
          : <div className="w-full h-full flex items-center justify-center text-[var(--text5)] text-xs font-sans">No image</div>
        }
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1">
          <span className="text-[var(--accent)] text-xs font-sans tracking-widest uppercase">{listing.type}</span>
        </div>
        <button onClick={share} className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-2 hover:bg-black/80 transition">
          <Share2 className="w-4 h-4 text-white" />
        </button>
        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 p-1.5 hover:bg-black/80 transition">
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 p-1.5 hover:bg-black/80 transition">
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_: any, i: number) => (
                <div key={i} className={`w-1 h-1 rounded-full transition-colors ${i === idx ? 'bg-[var(--accent)]' : 'bg-white/30'}`} />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="flex items-center gap-2 text-[var(--text4)] text-xs font-sans mb-2">
        <span className="text-xs">📍</span>{listing.location}
      </div>
      <h3 className="text-xl font-light mb-3 group-hover:text-[var(--accent)] transition-colors duration-300" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {listing.title}
      </h3>
      <div className="flex items-center gap-4 text-xs text-[var(--text4)] font-sans mb-4">
        <span className="flex items-center gap-1.5"><Bed className="w-3.5 h-3.5" /> {listing.beds} ch.</span>
        <span className="flex items-center gap-1.5"><Bath className="w-3.5 h-3.5" /> {listing.baths} sdb.</span>
        <span className="flex items-center gap-1.5"><Square className="w-3.5 h-3.5" /> {listing.area?.toLocaleString()} sqft</span>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
        <div className="text-2xl font-light text-[var(--accent)]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          AED {listing.price?.toLocaleString()}
        </div>
        <span className="text-xs font-sans text-[var(--text4)] tracking-widest uppercase group-hover:text-[var(--accent)] transition-colors">Voir →</span>
      </div>
    </Link>
  );
};

export default function Listings() {
  const [listings, setListings] = useState<any[]>([]);
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
    <div className="min-h-screen bg-[var(--bg)] text-white" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>

      {/* HEADER */}
      <section className="pt-40 pb-16 px-6 border-b border-[var(--border2)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8 bg-[var(--accent)]" />
            <span className="text-[var(--accent)] text-xs font-sans tracking-[0.3em] uppercase">Propriétés</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <h1 className="text-5xl sm:text-6xl font-light leading-[0.9]">
              Nos biens<br /><em className="not-italic text-[var(--accent)]">d'exception</em>
            </h1>
            <p className="text-[var(--text3)] font-sans font-light text-sm max-w-xs leading-relaxed">
              {loading ? '' : `${filtered.length} propriété${filtered.length > 1 ? 's' : ''} disponible${filtered.length > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <section className="py-8 px-6 border-b border-[var(--border2)] bg-[var(--bg2)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text4)]" />
              <input type="text" placeholder="Rechercher par nom ou localisation..."
                className="w-full bg-transparent border-b border-white/10 focus:border-[var(--accent)] outline-none py-2 pl-7 text-white placeholder-gray-600 font-sans font-light text-sm transition-colors"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-xs font-sans text-[var(--text3)] hover:text-[var(--accent)] transition-colors tracking-[0.2em] uppercase">
              <SlidersHorizontal className="w-4 h-4" /> Filtres
            </button>
          </div>

          {showFilters && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-sans text-[var(--text4)] tracking-[0.2em] uppercase block mb-2">Prix min (AED)</label>
                <input type="number" placeholder="0" value={minPrice} onChange={e => setMinPrice(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 focus:border-[var(--accent)] outline-none py-2 text-white placeholder-gray-700 font-sans text-sm transition-colors" />
              </div>
              <div>
                <label className="text-xs font-sans text-[var(--text4)] tracking-[0.2em] uppercase block mb-2">Prix max (AED)</label>
                <input type="number" placeholder="∞" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 focus:border-[var(--accent)] outline-none py-2 text-white placeholder-gray-700 font-sans text-sm transition-colors" />
              </div>
              <div>
                <label className="text-xs font-sans text-[var(--text4)] tracking-[0.2em] uppercase block mb-2">Trier par</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 focus:border-[var(--accent)] outline-none py-2 text-white font-sans text-sm transition-colors cursor-pointer" style={{ background: 'transparent' }}>
                  <option value="default" className="bg-[var(--bg)]">Récents</option>
                  <option value="price-low" className="bg-[var(--bg)]">Prix croissant</option>
                  <option value="price-high" className="bg-[var(--bg)]">Prix décroissant</option>
                  <option value="beds" className="bg-[var(--bg)]">Chambres</option>
                  <option value="area" className="bg-[var(--bg)]">Surface</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* GRID */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="aspect-[4/3] bg-white/[0.03] animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-32 text-center">
              <p className="text-[var(--text4)] font-sans font-light text-lg mb-2">
                {listings.length === 0 ? 'Aucun bien disponible pour le moment.' : 'Aucun résultat pour cette recherche.'}
              </p>
              {listings.length === 0 && <p className="text-[var(--text5)] font-sans text-sm">Revenez bientôt — de nouveaux biens arrivent.</p>}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filtered.map((l: any) => <ListingCard key={l.id} listing={l} />)}
            </div>
          )}
        </div>
      </section>

      <footer className="bg-[var(--bg4)] border-t border-[var(--border2)] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--text5)] font-sans">© 2026 MoveSmart Invest. Tous droits réservés.</p>
          <div className="flex gap-6 text-xs text-[var(--text5)] font-sans">
            <a href="#" className="hover:text-[var(--accent)] transition-colors">Mentions légales</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
