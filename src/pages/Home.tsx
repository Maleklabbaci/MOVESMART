import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, Bed, Bath, Square } from 'lucide-react';
import { listings } from '../data/listings';
import { companyInfo } from '../constants';

export default function Home() {
  const featuredListings = listings.slice(0, 3);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pt-20">   {/* pt-20 = espace pour header fixe */}

      {/* Hero Section */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex flex-col items-center justify-center text-center text-white px-6">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/4531667/pexels-photo-4531667.jpeg" 
            alt="Luxury Dubai Real Estate" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>
        
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-6 leading-tight">
            Discover your ideal<br />luxury home in Dubai
          </h1>
          <p className="text-lg md:text-xl mb-10 text-gray-100">
            Uncover a world of unique homes and unforgettable experiences in the heart of Dubai.
          </p>
          <Link 
            to="/listings"
            className="inline-block bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-lg"
          >
            Explore Listings
          </Link>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-6 leading-tight">
              Extraordinary stays, curated for you.
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-10">
              Whether you're planning a romantic getaway, a family vacation, or a business trip, we have the perfect space waiting for you.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="bg-gray-50 p-7 rounded-3xl">
                <Briefcase className="w-8 h-8 mb-4 text-gray-900" />
                <h4 className="font-bold text-lg mb-2">Remote Work</h4>
                <p className="text-sm text-gray-600">Quiet spots with fast Wi-Fi.</p>
              </div>
              <div className="bg-gray-50 p-7 rounded-3xl">
                <Users className="w-8 h-8 mb-4 text-gray-900" />
                <h4 className="font-bold text-lg mb-2">Family Getaways</h4>
                <p className="text-sm text-gray-600">Spaces for family memories.</p>
              </div>
            </div>
            
            <Link to="/listings" className="inline-block bg-black text-white px-10 py-4 rounded-full font-bold hover:bg-gray-800 transition">
              Explore All Listings
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop" alt="" className="rounded-3xl w-full h-80 object-cover" referrerPolicy="no-referrer" loading="lazy" />
            <img src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800&auto=format&fit=crop" alt="" className="rounded-3xl w-full h-80 object-cover" referrerPolicy="no-referrer" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="bg-gray-50 py-16 md:py-20 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-extrabold tracking-tighter mb-12 text-center">Featured Listings</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredListings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
                <div className="relative h-60">
                  <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                  <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold">
                    {listing.type}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-xl mb-1">{listing.title}</h4>
                  <p className="text-sm text-gray-500 mb-4">{listing.location}</p>
                  <div className="font-bold text-2xl mb-6">AED {listing.price.toLocaleString()}</div>
                  
                  <Link 
                    to={`/listings/${listing.id}`} 
                    className="block w-full text-center bg-black text-white py-3 rounded-full font-bold hover:bg-gray-800 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-16 px-6 text-center">
        <h4 className="text-xl font-bold mb-4">{companyInfo.name}</h4>
        <p className="text-sm text-gray-400">© 2025 {companyInfo.brand}. All rights reserved.</p>
      </footer>
    </div>
  );
}
