import { Briefcase, Users, Bed, Bath, Square } from 'lucide-react';
import { Link } from 'react-router-dom';
import { listings } from '../data/listings';
import { companyInfo } from '../constants';

export default function Home() {
  const featuredListings = listings.slice(0, 3);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center text-white px-6 md:px-10">
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
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-tight">Discover your ideal<br />luxury home in Dubai</h1>
          <p className="text-lg md:text-xl mb-10 text-gray-200 font-light">Uncover a world of unique homes and unforgettable experiences in the heart of Dubai. Your perfect getaway awaits just a search away!</p>
          <button className="bg-white text-black px-8 md:px-10 py-3 md:py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition">Book today</button>
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
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-6 md:mb-8 leading-tight">Extraordinary stays, curated for you.</h2>
            <p className="text-base md:text-lg text-gray-600 mb-8 md:mb-10">Whether you're planning a romantic getaway, a family vacation, or a business trip, we have the perfect space waiting for you.</p>
            
            <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-10">
              <div className="bg-gray-50 p-6 md:p-8 rounded-3xl">
                <Briefcase className="w-8 h-8 mb-4 text-gray-900" />
                <h4 className="font-bold text-lg mb-2">Remote Work</h4>
                <p className="text-sm text-gray-600">Quiet spots with fast Wi-Fi.</p>
              </div>
              <div className="bg-gray-50 p-6 md:p-8 rounded-3xl">
                <Users className="w-8 h-8 mb-4 text-gray-900" />
                <h4 className="font-bold text-lg mb-2">Family Getaways</h4>
                <p className="text-sm text-gray-600">Spaces for family memories.</p>
              </div>
            </div>
            
            <Link to="/listings" className="inline-block bg-black text-white px-8 md:px-10 py-3 md:py-4 rounded-full font-bold hover:bg-gray-800 transition">Explore Listings</Link>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:gap-6">
            <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop" alt="Stay 1" className="rounded-3xl w-full h-64 md:h-80 object-cover" referrerPolicy="no-referrer" />
            <img src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800&auto=format&fit=crop" alt="Stay 2" className="rounded-3xl w-full h-64 md:h-80 object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="bg-gray-50 py-16 md:py-20 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-extrabold tracking-tighter mb-8 md:mb-12 text-center">Featured Listings</h3>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {featuredListings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300">
                <div className="relative h-60 w-full overflow-hidden">
                  <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                    {listing.type}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-xl mb-1">{listing.title}</h4>
                  <p className="text-sm text-gray-500 mb-4">{listing.location}</p>
                  <div className="font-bold text-2xl mb-6">AED {listing.price.toLocaleString()}</div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100 text-gray-600 mb-6">
                    <div className="flex items-center gap-2">
                      <Bed className="w-5 h-5" />
                      <span className="text-sm font-medium">{listing.beds} Beds</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="w-5 h-5" />
                      <span className="text-sm font-medium">{listing.baths} Baths</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Square className="w-5 h-5" />
                      <span className="text-sm font-medium">{listing.area.toLocaleString()} sqft</span>
                    </div>
                  </div>
                  <Link to={`/listings/${listing.id}`} className="block w-full text-center bg-black text-white py-3 rounded-full font-bold hover:bg-gray-800 transition">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-10 text-center">
        <h3 className="text-4xl font-extrabold tracking-tighter mb-12">What our clients say</h3>
        <div className="max-w-3xl mx-auto italic text-lg text-gray-700">
          "Stayli made finding our dream home in Dubai an effortless and truly enjoyable experience. Highly recommended!"
          <div className="font-bold mt-6 text-gray-900">- Sarah & Ahmed, Dubai</div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-black py-20 px-10 text-center text-white">
        <h3 className="text-4xl font-extrabold tracking-tighter mb-6">Stay updated</h3>
        <p className="text-gray-400 mb-10 max-w-md mx-auto">Subscribe to our newsletter for the latest luxury listings in Dubai.</p>
        <div className="flex gap-4 justify-center max-w-md mx-auto">
          <input type="email" placeholder="Enter your email" className="px-6 py-4 rounded-full w-full text-black" />
          <button className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition">Subscribe</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-10 text-center">
        <h4 className="text-xl font-bold mb-4">{companyInfo.name}</h4>
        <p className="text-sm text-gray-400 mb-2">{companyInfo.location}</p>
        <p className="text-sm text-gray-400 mb-8">WhatsApp: {companyInfo.whatsapp}</p>
        <p className="text-sm text-gray-500">© 2026 {companyInfo.brand}. All rights reserved.</p>
      </footer>
    </div>
  );
}
