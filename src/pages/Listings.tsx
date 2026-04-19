import React, { useState, useEffect } from 'react';
import { Bed, Bath, Square, ChevronDown, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const ListingCard = ({ listing }: { listing: any }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = listing.images || [];

  const nextImage = (e: React.MouseEvent) => { e.preventDefault(); setCurrentIndex((prev) => (prev + 1) % images.length); };
  const prevImage = (e: React.MouseEvent) => { e.preventDefault(); setCurrentIndex((prev) => (prev - 1 + images.length) % images.length); };
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}/listings/${listing.id}`;
    if (navigator.share) navigator.share({ title: listing.title, url }).catch(console.error);
    else navigator.clipboard.writeText(url).then(() => alert('Link copied!'));
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300">
      <div className="relative h-60 w-full overflow-hidden bg-gray-100">
        {images.length > 0
          ? <img src={images[currentIndex]} alt={listing.title} className="w-full h-full object-cover" loading="lazy" />
          : <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
        }
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">{listing.type}</div>
        <button onClick={handleShare} className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition shadow-sm">
          <Share2 className="w-5 h-5 text-gray-900" />
        </button>
        {images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full hover:bg-white transition"><ChevronLeft className="w-6 h-6 text-gray-800" /></button>
            <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full hover:bg-white transition"><ChevronRight className="w-6 h-6 text-gray-800" /></button>
          </>
        )}
      </div>
      <div className="p-6">
        <h4 className="font-bold text-lg md:text-xl mb-1">{listing.title}</h4>
        <p className="text-xs md:text-sm text-gray-500 mb-4">{listing.location}</p>
        <div className="font-bold text-xl md:text-2xl mb-6">AED {listing.price?.toLocaleString()}</div>
        <div className="flex items-center justify-between pt-6 border-t border-gray-100 text-gray-600 mb-6 gap-2 flex-wrap">
          <div className="flex items-center gap-2"><Bed className="w-5 h-5" /><span className="text-xs md:text-sm font-medium">{listing.beds}</span></div>
          <div className="flex items-center gap-2"><Bath className="w-5 h-5" /><span className="text-xs md:text-sm font-medium">{listing.baths}</span></div>
          <div className="flex items-center gap-2"><Square className="w-5 h-5" /><span className="text-xs md:text-sm font-medium">{listing.area?.toLocaleString()}</span></div>
        </div>
        <Link to={`/listings/${listing.id}`} className="block w-full text-center bg-black text-white py-3 rounded-full font-bold hover:bg-gray-800 transition text-sm md:text-base">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    supabase.from('listings').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setListings(data || []); setLoading(false); });
  }, []);

  const filtered = listings
    .filter((l: any) => {
      const matchSearch = l.title?.toLowerCase().includes(searchTerm.toLowerCase()) || l.location?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchMin = minPrice === '' || l.price >= Number(minPrice);
      const matchMax = maxPrice === '' || l.price <= Number(maxPrice);
      return matchSearch && matchMin && matchMax;
    })
    .sort((a: any, b: any) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'beds') return b.beds - a.beds;
      if (sortBy === 'area') return b.area - a.area;
      return 0;
    });

  return (
    <div className="min-h-screen bg-white text-gray-900 pt-24 pb-16 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-6xl font-extrabold tracking-tighter mb-6 md:mb-10">Our Listings</h1>
        <div className="flex flex-col gap-3 mb-8 md:mb-12">
          <input type="text" placeholder="Search by location or name..."
            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-full focus:ring-2 focus:ring-black outline-none shadow-sm"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input type="number" placeholder="Min Price" className="w-full px-4 py-3 text-sm border border-gray-200 rounded-full focus:ring-2 focus:ring-black outline-none shadow-sm" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
            <input type="number" placeholder="Max Price" className="w-full px-4 py-3 text-sm border border-gray-200 rounded-full focus:ring-2 focus:ring-black outline-none shadow-sm" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            <div className="relative">
              <select className="appearance-none w-full px-4 py-3 text-sm border border-gray-200 rounded-full focus:ring-2 focus:ring-black outline-none shadow-sm bg-white cursor-pointer" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="default">Sort by</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="beds">Beds (Most)</option>
                <option value="area">Area (Largest)</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">{listings.length === 0 ? 'Aucun bien disponible.' : 'Aucun résultat.'}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filtered.map((l: any) => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </div>
    </div>
  );
}
