import { Briefcase, Users, Bed, Bath, Square } from 'lucide-react';
import { Link } from 'react-router-dom';
import { listings } from '../data/listings';
import { companyInfo } from '../constants';
import { useTranslation } from 'react-i18next'; // ✅ AJOUTÉ pour traduction

export default function Home() {
  const { t } = useTranslation(); // ✅ Traduction
  const featuredListings = listings.slice(0, 3);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      
      {/* ==================== HERO ==================== */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center text-white px-6">
        {/* Background */}
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/4531667/pexels-photo-4531667.jpeg" 
            alt="Luxury Dubai Real Estate" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-tight">
            {t('hero.title', "Discover your ideal luxury home in Dubai")}
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-10 text-gray-200 font-light max-w-2xl mx-auto">
            {t('hero.subtitle', "Uncover a world of unique homes and unforgettable experiences")}
          </p>
          
          {/* ✅ BOUTON: Fond blanc / Texte noir */}
          <Link 
            to="/contact"
            className="inline-block bg-white text-black px-8 py-4 rounded-full font-bold text-base sm:text-lg hover:bg-gray-100 transition shadow-lg"
          >
            {t('hero.cta', "Book today")}
          </Link>
        </div>

        {/* ✅ SEPARATION WAVE */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80L60 68C120 56 240 40 360 35C480 30 600 35 720 42C840 49 960 58 1080 62C1200 66 1320 64 1380 63L1440 62V80H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ==================== CONTENT ==================== */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter mb-6 leading-tight">
              {t('content.title', "Extraordinary stays, curated for you.")}
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-8">
              {t('content.subtitle', "Whether you're planning a romantic getaway, a family vacation, or a business trip.")}
            </p>
            
            <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8">
              <div className="bg-gray-50 p-6 rounded-2xl">
                <Briefcase className="w-7 h-7 md:w-8 md:h-8 mb-3 text-gray-900" />
                <h4 className="font-bold text-base md:text-lg mb-1">{t('content.remote', "Remote Work")}</h4>
                <p className="text-xs md:text-sm text-gray-600">Quiet spots with fast Wi-Fi.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl">
                <Users className="w-7 h-7 md:w-8 md:h-8 mb-3 text-gray-900" />
                <h4 className="font-bold text-base md:text-lg mb-1">{t('content.family', "Family Getaways")}</h4>
                <p className="text-xs md:text-sm text-gray-600">Spaces for family memories.</p>
              </div>
            </div>
            
            {/* ✅ BOUTON: Fond noir / Texte blanc */}
            <Link 
              to="/listings" 
              className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition"
            >
              {t('content.cta', "Explore Listings")}
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800" 
              alt="Stay 1" 
              className="rounded-2xl w-full h-56 md:h-72 object-cover" 
              loading="lazy" 
            />
            <img 
              src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800" 
              alt="Stay 2" 
              className="rounded-2xl w-full h-56 md:h-72 object-cover" 
              loading="lazy" 
            />
          </div>
        </div>
      </section>

      {/* ==================== FEATURED LISTINGS ==================== */}
      <section className="bg-gray-50 py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tighter mb-10 md:mb-14 text-center">
            {t('listings.title', "Featured Listings")}
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {featuredListings.map((listing) => (
              <div 
                key={listing.id} 
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 transition"
              >
                <div className="relative h-48 sm:h-52">
                  <img 
                    src={listing.images[0]} 
                    alt={listing.title} 
                    className="w-full h-full object-cover" 
                    loading="lazy" 
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold">
                    {listing.type}
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-1">{listing.title}</h4>
                  <p className="text-xs text-gray-500 mb-2">{listing.location}</p>
                  <div className="font-bold text-xl mb-4">AED {listing.price.toLocaleString()}</div>
                  
                  <div className="flex justify-between text-gray-600 mb-4 text-xs">
                    <span className="flex items-center gap-1"><Bed className="w-4 h-4" /> {listing.beds}</span>
                    <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {listing.baths}</span>
                    <span className="flex items-center gap-1"><Square className="w-4 h-4" /> {listing.area}</span>
                  </div>
                  
                  {/* ✅ BOUTON: Fond noir / Texte blanc */}
                  <Link 
                    to={`/listings/${listing.id}`} 
                    className="block text-center bg-black text-white py-2.5 rounded-full font-bold hover:bg-gray-800 transition text-sm"
                  >
                    {t('listings.cta', "View Details")}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="py-16 md:py-24 px-6 text-center">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tighter mb-10">
          {t('testimonials.title', "What our clients say")}
        </h3>
        <div className="max-w-2xl mx-auto italic text-base md:text-lg text-gray-700">
          "{t('testimonials.quote', "Stayli made finding our dream home in Dubai an effortless and truly enjoyable experience. Highly recommended!")}"
          <div className="not-italic font-bold mt-4 text-gray-900">- Sarah & Ahmed, Dubai</div>
        </div>
      </section>

      {/* ==================== NEWSLETTER ==================== */}
      <section className="bg-black py-16 md:py-24 px-6 text-center text-white">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tighter mb-4">
          {t('newsletter.title', "Stay updated")}
        </h3>
        <p className="text-gray-400 mb-8 max-w-sm mx-auto text-sm">
          {t('newsletter.subtitle', "Subscribe to our newsletter for the latest luxury listings.")}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
          <input 
            type="email" 
            placeholder={t('newsletter.placeholder', "Enter your email")}
            className="px-6 py-3 rounded-full w-full text-black text-sm" 
          />
          {/* ✅ BOUTON: Fond blanc / Texte noir */}
          <Link 
            to="/contact"
            className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition text-sm"
          >
            {t('newsletter.cta', "Subscribe")}
          </Link>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-gray-900 text-white py-12 px-6 text-center">
        <h4 className="text-lg font-bold mb-2">{companyInfo.name}</h4>
        <p className="text-xs text-gray-400 mb-1">{companyInfo.location}</p>
        <p className="text-xs text-gray-400 mb-4">WhatsApp: {companyInfo.whatsapp}</p>
        <p className="text-xs text-gray-500">© 2026 {companyInfo.brand}</p>
      </footer>
    </div>
  );
}
