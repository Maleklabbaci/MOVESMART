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

function LanguageSelector({ transparent }) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'fr', label: 'FR' },
  ];

  const current = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1.5 rounded-lg font-medium transition text-sm border
          ${transparent 
            ? 'border-white/50 text-white hover:bg-white/10' 
            : 'border-gray-300 text-black hover:bg-gray-100'}`}
      >
        {current.label}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-20 bg-white border rounded-lg shadow-lg z-50 py-1">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm font-medium text-black"
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const transparent = isHome && !isScrolled;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 h-16 md:h-20 transition-all duration-300 px-4 md:px-10 flex items-center justify-between
      ${transparent ? 'bg-transparent' : 'bg-white shadow-md'}`}>

      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img 
          src="https://i.ibb.co/60PJ8PVw/aass.png" 
          alt={companyInfo.brand} 
          className={`h-7 md:h-9 w-auto transition-all duration-300 ${
            transparent ? '' : 'brightness-0'
          }`}
        />
      </Link>

      {/* Desktop Navigation */}
      <nav className={`hidden md:flex items-center gap-6 lg:gap-10 text-sm font-medium
        ${transparent ? 'text-white' : 'text-gray-900'}`}>
        <Link to="/" className="hover:opacity-70 transition">{t('home')}</Link>
        <Link to="/listings" className="hover:opacity-70 transition">{t('listings')}</Link>
        <Link to="/about" className="hover:opacity-70 transition">{t('about')}</Link>
        <Link to="/contact" className="hover:opacity-70 transition">{t('contact')}</Link>
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <LanguageSelector transparent={transparent} />

       <Link 
  to="/contact"
  className={`hidden md:block px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
    isTransparent 
      ? 'bg-white text-black hover:bg-gray-100' 
      : 'bg-black text-white hover:bg-gray-900'
  }`}
  style={{
    backgroundColor: isTransparent ? '#ffffff' : '#000000',
    color: isTransparent ? '#000000' : '#ffffff'
  }}
>
  {t('getStarted')}
</Link>
        

        {/* Mobile menu button */}
        <button 
          className={`md:hidden p-2 ${transparent ? 'text-white' : 'text-gray-900'}`}
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className={`absolute top-full left-0 right-0 md:hidden ${
          transparent ? 'bg-white/95' : 'bg-white'
        } shadow-lg border-t`}>
          <nav className="flex flex-col p-4 gap-2">
            <Link to="/" onClick={() => setMobileMenu(false)} className={`px-4 py-3 rounded-lg ${
              transparent ? 'text-black' : 'text-gray-900'
            } hover:bg-gray-100`}>{t('home')}</Link>
            <Link to="/listings" onClick={() => setMobileMenu(false)} className={`px-4 py-3 rounded-lg ${
              transparent ? 'text-black' : 'text-gray-900'
            } hover:bg-gray-100`}>{t('listings')}</Link>
            <Link to="/about" onClick={() => setMobileMenu(false)} className={`px-4 py-3 rounded-lg ${
              transparent ? 'text-black' : 'text-gray-900'
            } hover:bg-gray-100`}>{t('about')}</Link>
            <Link to="/contact" onClick={() => setMobileMenu(false)} className={`px-4 py-3 rounded-lg ${
              transparent ? 'text-black' : 'text-gray-900'
            } hover:bg-gray-100`}>{t('contact')}</Link>
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
