import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';

import Home from './pages/Home';
import Listings from './pages/Listings';
import About from './pages/About';
import Contact from './pages/Contact';
import ListingDetails from './pages/ListingDetails';
import Admin from './pages/Admin';
import WhatsAppButton from './components/WhatsAppButton';
import MobileNav from './components/MobileNav';
import { companyInfo } from './constants';

function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { i18n, t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Transparent ONLY if on Home AND not scrolled
  const isTransparent = isHome && !isScrolled;

  const toggleLang = () => i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en');

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 ${
      isTransparent ? 'bg-transparent' : 'bg-white shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center">
        
        {/* Logo - LEFT */}
        <div className="flex-shrink-0">
          <Link to="/">
            <img 
              src="https://i.ibb.co/60PJ8PVw/aass.png" 
              alt={companyInfo.brand} 
              className={`h-8 md:h-10 w-auto transition-all duration-300 ${
                isTransparent ? '' : 'brightness-0'
              }`}
            />
          </Link>
        </div>

        {/* Navigation - CENTERED */}
        <nav className={`flex-1 flex items-center justify-center gap-8 text-sm font-semibold tracking-wider uppercase ${
          isTransparent ? 'text-white' : 'text-gray-900'
        }`}>
          <Link to="/" className="hover:text-amber-500 transition-colors">{t('home', 'Accueil')}</Link>
          <Link to="/listings" className="hover:text-amber-500 transition-colors">{t('listings', 'Biens')}</Link>
          <Link to="/about" className="hover:text-amber-500 transition-colors">{t('about', 'À Propos')}</Link>
          <Link to="/contact" className="hover:text-amber-500 transition-colors">{t('contact', 'Contact')}</Link>
        </nav>

        {/* Right Side */}
        <div className="flex-shrink-0 flex items-center gap-4">
          <button 
            onClick={toggleLang}
            className={`hidden md:block text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded border transition-colors ${
              isTransparent 
                ? 'border-white/40 text-white hover:bg-white/10' 
                : 'border-gray-300 text-gray-900 hover:bg-gray-100'
            }`}
          >
            {i18n.language === 'en' ? 'FR' : 'EN'}
          </button>
          
          <Link 
            to="/contact"
            className={`hidden md:inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
              isTransparent 
                ? 'bg-amber-500 text-black hover:bg-amber-400' 
                : 'bg-gray-900 text-white hover:bg-amber-500 hover:text-black'
            }`}
          >
            {t('getStarted', 'Contact')}
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className={`md:hidden p-2 ${isTransparent ? 'text-white' : 'text-gray-900'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white shadow-lg border-t">
          <nav className="flex flex-col p-6 gap-4">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-gray-900 uppercase tracking-wider hover:text-amber-600">Accueil</Link>
            <Link to="/listings" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-gray-900 uppercase tracking-wider hover:text-amber-600">Biens</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-gray-900 uppercase tracking-wider hover:text-amber-600">À Propos</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-gray-900 uppercase tracking-wider hover:text-amber-600">Contact</Link>
            <div className="pt-4 border-t flex items-center gap-4">
              <button onClick={toggleLang} className="text-xs font-semibold text-gray-900 uppercase">
                {i18n.language === 'en' ? 'FR' : 'EN'}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Header />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/:id" element={<ListingDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>

        <WhatsAppButton />
        <MobileNav />
      </div>
    </BrowserRouter>
  );
}
