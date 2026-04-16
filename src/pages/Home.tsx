import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, Bed, Bath, Square, Star, MapPin, ArrowRight } from 'lucide-react';
import { listings } from '../data/listings';
import { companyInfo } from '../constants';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  const featuredListings = listings.slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      
      {/* ==================== HERO ==================== */}
      <section className="relative w-full h-screen flex items-center justify-center text-white px-4 sm:px-6">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/4531667/pexels-photo-4531667.jpeg"
            alt="Dubai"
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/0 sm:from-black/80 sm:via-black/50 sm:to-black/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 pt-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight drop-shadow-2xl">
            {t('heroTitle', 'Discover your ideal luxury home in Dubai')}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-lg">
            {t('heroSubtitle', 'Uncover a world of unique homes and unforgettable experiences')}
          </p>
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-xl transition-all duration-300 bg-white text-black hover:bg-black hover:text-white hover:scale-105"
          >
            {t('heroCta', 'Book today')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <svg viewBox="0 0 1440 80" fill="white" className="w-full h-auto" preserveAspectRatio="none">
            <path d="M0 80L60 70C120 60 240 40 360 35C480 30 600 40 720 45C840 50 960 50 1080 55C1200 60 1320 70 1380 75L1440 80V80H0Z" />
          </svg>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {t('contentTitle', 'Extraordinary stays, curated for you')}
              </h2>
              <p className="text-gray-600 text-base sm:text-lg mb-10">
                {t('contentSubtitle', 'Whether you\'re planning a romantic getaway, a family vacation, or a business trip, we have the perfect space waiting for you.')}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-10">
                <div className="bg-gray-50 p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300">
                  <Briefcase className="w-8 h-8 mb-4 text-black" />
                  <h4 className="font-bold text-lg mb-2">{t('remoteWork', 'Remote Work')}</h4>
                  <p className="text-sm text-gray-600">High-speed Wi-Fi & dedicated workspaces</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300">
                  <Users className="w-8 h-8 mb-4 text-black" />
                  <h4 className="font-bold text-lg mb-2">{t('familyGetaways', 'Family Getaways')}</h4>
                  <p className="text-sm text-gray-600">Spacious homes perfect for families</p>
                </div>
              </div>
              
              <Link 
                to="/listings" 
                className="inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 rounded-full font-bold hover:bg-gray-800 transition-all duration-300 hover:scale-105"
              >
                {t('exploreListings', 'Explore Listings')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop" alt="Luxury Interior" className="rounded-2xl w-full h-48 sm:h-64 md:h-72 object-cover shadow-lg" referrerPolicy="no-referrer" loading="lazy" />
              <img src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800&auto=format&fit=crop" alt="Modern Living" className="rounded-2xl w-full h-48 sm:h-64 md:h-72 object-cover shadow-lg mt-8" referrerPolicy="no-referrer" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURED LISTINGS ==================== */}
      <section className="bg-gray-50 py-16 sm:py-20 md:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              {t('featuredListings', 'Featured Listings')}
            </h3>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Discover our handpicked selection of premium properties
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredListings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group">
                <div className="relative h-52 sm:h-60 overflow-hidden">
                  <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" loading="lazy" />
                  <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                    {listing.type}
                  </span>
                </div>
                <div className="p-5 sm:p-6">
                  <h4 className="font-bold text-lg sm:text-xl mb-2 line-clamp-1">{listing.title}</h4>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{listing.location}</span>
                  </div>
                  <div className="font-bold text-2xl sm:text-3xl mb-4 text-black">AED {listing.price.toLocaleString()}</div>
                  
                  <div className="flex items-center justify-between text-gray-600 text-xs sm:text-sm mb-5 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <Bed className="w-4 h-4" />
                      <span className="font-medium">{listing.beds}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bath className="w-4 h-4" />
                      <span className="font-medium">{listing.baths}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Square className="w-4 h-4" />
                      <span className="font-medium">{listing.area}</span>
                    </div>
                  </div>
                  
                  <Link to={`/listings/${listing.id}`} className="block w-full text-center bg-black text-white py-3 rounded-full font-bold text-sm hover:bg-gray-800 transition-all duration-300 hover:scale-[1.02]">
                    {t('viewDetails', 'View Details')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10 sm:mt-12">
            <Link to="/listings" className="inline-flex items-center gap-2 border-2 border-black text-black px-8 py-3.5 rounded-full font-bold hover:bg-black hover:text-white transition-all duration-300">
              View All Listings
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10">
            {t('testimonialsTitle', 'What our clients say')}
          </h3>
          <div className="bg-gray-50 rounded-3xl p-8 sm:p-12 shadow-lg">
            <p className="text-lg sm:text-xl md:text-2xl italic text-gray-700 mb-6 leading-relaxed">
              "{t('testimonialQuote', 'Stayli made finding our dream home in Dubai an effortless and truly enjoyable experience. The team was professional and attentive to every detail. Highly recommended!')}"
            </p>
            <div className="font-bold text-lg text-gray-900">- Sarah & Ahmed, Dubai</div>
          </div>
        </div>
      </section>

      {/* ==================== NEWSLETTER ==================== */}
      <section className="bg-black py-16 sm:py-20 md:py-24 px-4 sm:px-6 text-center text-white">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            {t('newsletterTitle', 'Stay updated')}
          </h3>
          <p className="text-gray-400 text-base sm:text-lg mb-8 sm:mb-10">
            {t('newsletterSubtitle', 'Subscribe to our newsletter for the latest luxury listings and exclusive offers in Dubai.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder={t('emailPlaceholder', 'Enter your email')} 
              className="px-6 py-4 rounded-full text-black text-sm sm:text-base w-full focus:outline-none focus:ring-2 focus:ring-white/50" 
            />
            <button className="bg-white text-black px-8 py-4 rounded-full font-bold text-sm sm:text-base hover:bg-gray-200 transition-all duration-300 whitespace-nowrap">
              {t('subscribe', 'Subscribe')}
            </button>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-gray-900 text-white py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h4 className="text-xl sm:text-2xl font-bold mb-4">{companyInfo.name}</h4>
          <p className="text-sm text-gray-400 mb-2">{companyInfo.location}</p>
          <p className="text-sm text-gray-400 mb-6">WhatsApp: {companyInfo.whatsapp}</p>
          <div className="w-16 h-1 bg-white mx-auto mb-6 rounded-full"></div>
          <p className="text-xs text-gray-500">© 2026 {companyInfo.brand}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
