import React, { useState } from 'react';
import { Bed, Bath, Square, ChevronDown, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { listings } from '../data/listings';

interface ListingCardProps {
  key?: React.Key;
  listing: {
    id: number;
    title: string;
    type: string;
    location: string;
    price: number;
    beds: number;
    baths: number;
    area: number;
    images: string[];
  };
}

const ListingCard = ({ listing }: ListingCardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev + 1) % listing.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}/listings/${listing.id}`;
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        url: url,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url).then(() => alert('Link copied to clipboard!'));
    }
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300">
      <div className="relative h-60 w-full overflow-hidden bg-gray-100">
        <img src={listing.images[currentIndex]} alt={listing.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
          {listing.type}
        </div>
        <button onClick={handleShare} className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition shadow-sm">
          <Share2 className="w-5 h-5 text-gray-900" />
        </button>
        {listing.images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full hover:bg-white transition">
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full hover:bg-white transition">
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </>
        )}
      </div>
      <div className="p-6">
        <h4 className="font-bold text-lg md:text-xl mb-1">{listing.title}</h4>
        <p className="text-xs md:text-sm text-gray-500 mb-4">{listing.location}</p>
        <div className="font-bold text-xl md:text-2xl mb-6">AED {listing.price.toLocaleString()}</div>
        
        <div className="flex items-center justify-between pt-6 border-t border-gray-100 text-gray-600 mb-6 gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Bed className="w-5 h-5" />
            <span className="text-xs md:text-sm font-medium">{listing.beds}</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath className="w-5 h-5" />
            <span className="text-xs md:text-sm font-medium">{listing.baths}</span>
          </div>
          <div className="flex items-center gap-2">
            <Square className="w-5 h-5" />
            <span className="text-xs md:text-sm font-medium">{listing.area.toLocaleString()}</span>
          </div>
        </div>
        <Link to={`/listings/${listing.id}`} className="block w-full text-center bg-black text-white py-3 rounded-full font-bold hover:bg-gray-800 transition text-sm md:text-base">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default function Listings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          listing.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMinPrice = minPrice === '' || listing.price >= Number(minPrice);
    const matchesMaxPrice = maxPrice === '' || listing.price <= Number(maxPrice);
    return matchesSearch && matchesMinPrice && matchesMaxPrice;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'beds': return b.beds - a.beds;
      case 'area': return b.area - a.area;
      default: return 0;
    }
  });

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pt-24 pb-16 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-6xl font-extrabold tracking-tighter mb-6 md:mb-10">Our Listings</h1>
        
        <div className="flex flex-col gap-3 md:gap-4 mb-8 md:mb-12">
          <input
            type="text"
            placeholder="Search by location or property name..."
            className="w-full px-4 md:px-6 py-3 md:py-4 text-sm md:text-base border border-gray-200 rounded-full focus:ring-2 focus:ring-black outline-none shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <input
              type="number"
              placeholder="Min Price"
              className="w-full px-4 md:px-6 py-3 md:py-4 text-sm md:text-base border border-gray-200 rounded-full focus:ring-2 focus:ring-black outline-none shadow-sm"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max Price"
              className="w-full px-4 md:px-6 py-3 md:py-4 text-sm md:text-base border border-gray-200 rounded-full focus:ring-2 focus:ring-black outline-none shadow-sm"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <div className="relative">
              <select
                className="appearance-none w-full px-4 md:px-6 py-3 md:py-4 pl-4 pr-10 text-sm md:text-base border border-gray-200 rounded-full focus:ring-2 focus:ring-black outline-none shadow-sm bg-white cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Sort by</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="beds">Beds (Most)</option>
                <option value="area">Area (Largest)</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {sortedListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
        {sortedListings.length === 0 && (
          <p className="text-center text-gray-500 text-base md:text-lg mt-10">No listings found matching your search.</p>
        )}
      </div>
    </div>
  );
}
