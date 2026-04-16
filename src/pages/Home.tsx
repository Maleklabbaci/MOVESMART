import { Briefcase, Users, Bed, Bath, Square } from 'lucide-react';
import { Link } from 'react-router-dom';
import { listings } from '../data/listings';
import { companyInfo } from '../constants';

export default function Home() {
  const featuredListings = listings.slice(0, 3);

  return (
    <div className="bg-white text-gray-900 font-sans">
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center text-white px-6 md:px-10 pt-16 md:pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/4531667/pexels-photo-4531667.jpeg" 
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
            Uncover a world of unique homes and unforgettable experiences.
          </p>
          <Link 
            to="/contact"
            className="inline-block bg-white text-black px-8 py-3 rounded-full font-bold text-base hover:bg-gray-100 transition shadow-lg"
          >
            Book today
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 50C480 40 600 50 720 65C840 80 960 100 1080 105C1200 110 1320 100 1380 95L1440 90V120H0Z" fill="white" stroke="none" />
          </svg>
        </div>
      </section>

      {/* ... reste du code inchangé ... */}
    </div>
  );
}
