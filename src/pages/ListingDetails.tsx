import { useParams, Link } from 'react-router-dom';
import { listings } from '../data/listings';
import { Bed, Bath, Square, ChevronLeft, Share2 } from 'lucide-react';

export default function ListingDetails() {
  const { id } = useParams<{ id: string }>();
  const listing = listings.find((l) => l.id === parseInt(id || '0'));

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: listing?.title,
        url: url,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url).then(() => alert('Link copied to clipboard!'));
    }
  };

  if (!listing) {
    return (
      <div className="min-h-screen bg-white text-gray-900 font-sans pt-32 px-10 text-center">
        <h1 className="text-4xl font-bold mb-4">Listing not found</h1>
        <Link to="/listings" className="text-black underline">Back to Listings</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pt-24 pb-16 px-6 md:px-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <Link to="/listings" className="flex items-center gap-2 text-gray-600 hover:text-black">
            <ChevronLeft className="w-5 h-5" /> Back
          </Link>
          <button onClick={handleShare} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full font-medium transition">
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter mb-2 md:mb-4">{listing.title}</h1>
        <p className="text-lg md:text-xl text-gray-500 mb-6 md:mb-8">{listing.location} • {listing.type}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 md:mb-10">
          {listing.images.map((image, index) => (
            <img key={index} src={image} alt={`${listing.title} ${index + 1}`} className="rounded-3xl w-full h-64 md:h-80 object-cover" referrerPolicy="no-referrer" />
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 bg-gray-50 rounded-3xl mb-8 md:mb-10 gap-6">
          <div className="font-bold text-3xl md:text-4xl">AED {listing.price.toLocaleString()}</div>
          <div className="flex flex-wrap gap-4 md:gap-8 text-gray-600">
            <div className="flex items-center gap-2">
              <Bed className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-base md:text-lg font-medium">{listing.beds} Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-base md:text-lg font-medium">{listing.baths} Baths</span>
            </div>
            <div className="flex items-center gap-2">
              <Square className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-base md:text-lg font-medium">{listing.area.toLocaleString()} sqft</span>
            </div>
          </div>
        </div>
        
        <h3 className="text-xl md:text-2xl font-bold mb-4">Description</h3>
        <p className="text-base md:text-lg text-gray-600 leading-relaxed">
          Experience luxury living in this stunning {listing.type.toLowerCase()} located in the heart of {listing.location}. 
          This property offers unparalleled comfort and style, with premium finishes and world-class amenities. 
          Perfect for those who appreciate the finer things in life.
        </p>
      </div>
    </div>
  );
}
