import { Briefcase, Users, Bed, Bath, Square } from 'lucide-react';
import { Link } from 'react-router-dom';
import { listings } from '../data/listings';
import { companyInfo } from '../constants';

export default function Home() {
  const featuredListings = listings.slice(0, 3);

  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* Hero Section - FIX: padding-top pour header fixed */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center text-white px-6 md:px-10 pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/4531667/pexels-photo-4531667.jpeg?_gl=1*13j8uyu*_ga*NjA0NjgzODgzLjE3NzUzODUyNzc.*_ga_8JE65Q40S6*czE3NzYyOTc5ODQkbzIkZzEkdDE3NzYyOTgzNDUkajQkbDAkaDA." 
            alt="Luxury Dubai Real Estate" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer" 
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6 leading-tight">
            Discover your ideal<br />luxury home in Dubai
          </h1>
          <p className="text-base md:text-lg mb-8 text-gray-200 font-light px-4">
            Uncover a world of unique homes and unforgettable experiences in the heart of Dubai.
          </p>
          {/* FIX: Bouton cliquable avec Link */}
          <Link 
            to="/contact"
            className="inline-block bg-white text-black px-8 py-3 rounded-full font-bold text-base hover:bg-gray-100 transition shadow-lg"
          >
            Book today
          </Link>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 50C480 40 600 50 720 65C840 80 960 100 1080 105C1200 110 1320 100 1380 95L1440 90V120H0Z" fill="white" stroke="none" />
          </svg>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter mb-6 leading-tight">
              Extraordinary stays, curated for you.
            </h2>
            <p className="text-base text-gray-600 mb-8">
              Whether you're planning a romantic getaway, a family vacation, or a business trip.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 p-6 rounded-2xl">
                <Briefcase className="w-7 h-7 mb-3 text-gray-900" />
                <h4 className="font-bold text-base mb-1">Remote Work</h4>
                <p className="text-xs text-gray-600">Quiet spots with fast Wi-Fi.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl">
                <Users className="w-7 h-7 mb-3 text-gray-900" />
                <h4 className="font-bold text-base mb-1">Family Getaways</h4>
                <p className="text-xs text-gray-600">Spaces for family memories.</p>
              </div>
            </div>
            
            {/* FIX: Bouton cliquable */}
            <Link 
              to="/listings" 
              className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition"
            >
              Explore Listings
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop" 
              alt="Stay 1" 
              className="rounded-2xl w-full h-56 md:h-72 object-cover" 
              referrerPolicy="no-referrer" 
              loading="lazy" 
            />
            <img 
              src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800&auto=format&fit=crop" 
              alt="Stay 2" 
              className="rounded-2xl w-full h-56 md:h-72 object-cover" 
              referrerPolicy="no-referrer" 
              loading="lazy" 
            />
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="bg-gray-50 py-16 md:py-20 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tighter mb-8 text-center">
            Featured Listings
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
              <div 
                key={listing.id} 
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300"
              >
                <div className="relative h-48 w-full">
                  <img 
                    src={listing.images[0]} 
                    alt={listing.title} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer" 
                    loading="lazy" 
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-gray-900">
                    {listing.type}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-1">{listing.title}</h4>
                  <p className="text-xs text-gray-500 mb-2">{listing.location}</p>
                  <div className="font-bold text-xl mb-4">AED {listing.price.toLocaleString()}</div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      <span className="text-xs font-medium">{listing.beds}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      <span className="text-xs font-medium">{listing.baths}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="w-4 h-4" />
                      <span className="text-xs font-medium">{listing.area}</span>
                    </div>
                  </div>
                  {/* FIX: Bouton cliquable */}
                  <Link 
                    to={`/listings/${listing.id}`} 
                    className="block w-full text-center bg-black text-white py-2.5 rounded-full font-bold hover:bg-gray-800 transition text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 text-center">
        <h3 className="text-2xl md:text-3xl font-extrabold tracking-tighter mb-8">
          What our clients say
        </h3>
        <div className="max-w-2xl mx-auto italic text-base text-gray-700">
          "Stayli made finding our dream home in Dubai an effortless and truly enjoyable experience. Highly recommended!"
          <div className="font-bold mt-4 text-gray-900">- Sarah & Ahmed, Dubai</div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-black py-16 px-6 text-center text-white">
        <h3 className="text-2xl font-extrabold tracking-tighter mb-4">Stay updated</h3>
        <p className="text-gray-400 mb-8 max-w-sm mx-auto text-sm">
          Subscribe to our newsletter for the latest luxury listings in Dubai.
        </p>
        <div className="flex flex-col md:flex-row gap-3 justify-center max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="px-6 py-3 rounded-full w-full text-black text-sm" 
          />
          {/* FIX: Bouton avec Link */}
          <Link 
            to="/contact"
            className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition text-sm"
          >
            Subscribe
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6 text-center">
        <h4 className="text-lg font-bold mb-2">{companyInfo.name}</h4>
        <p className="text-xs text-gray-400 mb-1">{companyInfo.location}</p>
        <p className="text-xs text-gray-400 mb-4">WhatsApp: {companyInfo.whatsapp}</p>
        <p className="text-xs text-gray-500">© 2026 {companyInfo.brand}. All rights reserved.</p>
      </footer>
    </div>
  );
}
