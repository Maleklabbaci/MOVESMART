import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, Bed, Bath, Square } from 'lucide-react';
import { listings } from '../data/listings';
import { companyInfo } from '../constants';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  const featuredListings = listings.slice(0, 3);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      
{/* HERO */}
<section className="relative h-screen flex items-center justify-center text-white text-center px-6">
  {/* BG */}
  <div className="absolute inset-0 z-0">
    <img
      src="https://images.pexels.com/photos/4531667/pexels-photo-4531667.jpeg"
      alt="Dubai"
      className="w-full h-full object-cover"
      referrerPolicy="no-referrer"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/55 to-black/25" />
  </div>

  {/* Content */}
  <div className="relative z-10 max-w-3xl mx-auto pt-20 px-4">
    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
      {t('heroTitle', 'Discover your ideal luxury home in Dubai')}
    </h1>

    <p className="text-base sm:text-lg md:text-xl text-gray-100 mb-10">
      {t('heroSubtitle', 'Uncover a world of unique homes and unforgettable experiences')}
    </p>

    {/* Bouton HERO */}
    <Link
      to="/contact"
      className="inline-block px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-lg transition-colors duration-200
                 bg-white text-black hover:bg-black hover:text-white"
    >
      {t('heroCta', 'Book today')}
    </Link>
  </div>

  {/* Wave */}
  <div className="absolute bottom-0 left-0 right-0 z-10">
    <svg viewBox="0 0 1440 60" fill="white" className="w-full h-auto">
      <path d="M0 60L60 50C120 40 240 30 360 28C480 26 600 32 720 36C840 40 960 42 1080 46C1200 50 1320 54 1380 56L1440 58V60H0Z" />
    </svg>
  </div>
</section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {t('contentTitle', 'Extraordinary stays, curated for you')}
            </h2>
            <p className="text-gray-600 mb-10 text-base md:text-lg">
              {t('contentSubtitle', 'Perfect space for romantic getaway, family vacation, or business trip')}
            </p>
            <div className="grid grid-cols-2 gap-4 md:gap-6 mb-10">
              <div className="bg-gray-50 p-6 rounded-2xl">
                <Briefcase className="w-7 h-7 mb-3 text-gray-900" />
                <h4 className="font-bold text-base mb-1">{t('remoteWork', 'Remote Work')}</h4>
                <p className="text-xs text-gray-600">Fast Wi-Fi included</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl">
                <Users className="w-7 h-7 mb-3 text-gray-900" />
                <h4 className="font-bold text-base mb-1">{t('familyGetaways', 'Family Getaways')}</h4>
                <p className="text-xs text-gray-600">Family memories</p>
              </div>
            </div>
            <Link 
              to="/listings" 
              className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition"
            >
              {t('exploreListings', 'Explore Listings')}
            </Link>
          </div>
          <div className="grid gap-4 md:gap-6">
            <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop" alt="Stay 1" className="rounded-2xl h-56 md:h-72 object-cover" referrerPolicy="no-referrer" loading="lazy" />
            <img src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800&auto=format&fit=crop" alt="Stay 2" className="rounded-2xl h-56 md:h-72 object-cover" referrerPolicy="no-referrer" loading="lazy" />
          </div>
        </div>
      </section>

      {/* LISTINGS */}
      <section className="bg-gray-50 py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10 md:mb-14 text-center">
            {t('featuredListings', 'Featured Listings')}
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {featuredListings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                <div className="relative h-48 md:h-52">
                  <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                  <span className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded-full text-xs font-bold">{listing.type}</span>
                </div>
                <div className="p-4 md:p-6">
                  <h4 className="font-bold text-lg mb-1">{listing.title}</h4>
                  <p className="text-xs text-gray-500 mb-2">{listing.location}</p>
                  <div className="font-bold text-xl mb-4">AED {listing.price.toLocaleString()}</div>
                  <div className="flex justify-between text-xs text-gray-600 mb-4">
                    <span className="flex items-center gap-1"><Bed className="w-4 h-4" /> {listing.beds}</span>
                    <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {listing.baths}</span>
                    <span className="flex items-center gap-1"><Square className="w-4 h-4" /> {listing.area}</span>
                  </div>
                  <Link to={`/listings/${listing.id}`} className="block w-full text-center bg-black text-white py-2.5 rounded-full font-bold text-sm hover:bg-gray-800 transition">
                    {t('viewDetails', 'View Details')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 md:py-24 px-6 text-center">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12">
          {t('testimonialsTitle', 'What our clients say')}
        </h3>
        <div className="max-w-2xl mx-auto italic text-base md:text-lg text-gray-700">
          "{t('testimonialQuote', 'Stayli made finding our dream home in Dubai an effortless and truly enjoyable experience. Highly recommended!')}"
          <div className="not-italic font-bold mt-4 md:mt-6 text-gray-900">- Sarah & Ahmed, Dubai</div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-black py-16 md:py-24 px-6 text-center text-white">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">
          {t('newsletterTitle', 'Stay updated')}
        </h3>
        <p className="text-gray-400 mb-8 md:mb-10 max-w-md mx-auto text-sm">
          {t('newsletterSubtitle', 'Subscribe to our newsletter for the latest luxury listings in Dubai')}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
          <input type="email" placeholder={t('emailPlaceholder', 'Enter your email')} className="px-6 py-3 rounded-full text-black text-sm w-full" />
          <button className="bg-white text-black px-8 py-3 rounded-full font-bold text-sm hover:bg-gray-200 transition">
            {t('subscribe', 'Subscribe')}
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12 px-6 text-center">
        <h4 className="text-lg font-bold mb-2">{companyInfo.name}</h4>
        <p className="text-xs text-gray-400 mb-1">{companyInfo.location}</p>
        <p className="text-xs text-gray-400 mb-4">WhatsApp: {companyInfo.whatsapp}</p>
        <p className="text-xs text-gray-500">© 2026 {companyInfo.brand}</p>
      </footer>
    </div>
  );
}
