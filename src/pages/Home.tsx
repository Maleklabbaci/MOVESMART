import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Menu, X } from 'lucide-react';

import Home from './pages/Home';
import Listings from './pages/Listings';
import About from './pages/About';
import Contact from './pages/Contact';
import ListingDetails from './pages/ListingDetails';
import Admin from './pages/Admin';
import WhatsAppButton from './components/WhatsAppButton';
import MobileNav from './components/MobileNav';

function LanguageSelector() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  const current = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 hover:border-gray-400 text-sm font-medium"
      >
        <span>{current.flag}</span>
        <span>{current.code.toUpperCase()}</span>
        <ChevronDown className={`w-4 h-4 transition ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50 py-1">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 hover:bg-gray-100 flex items-center gap-3 text-sm"
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
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
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenu, setMobileMenu] = React.useState(false);
  const { t } = useTranslation();

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const transparent = isHome && !isScrolled;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 h-16 md:h-20 transition-all duration-300 px-4 md:px-8 flex items-center justify-between
      ${transparent ? 'text-white' : 'bg-white text-gray-900 shadow-sm border-b'}`}>

      {/* Logo - Taille réduite */}
      <Link to="/" className="flex items-center">
        <img 
          src="https://i.ibb.co/60PJ8PVw/aass.png" 
          alt="MoveSmart Invest"
          className="h-9 md:h-11 w-auto"   // ← Logo plus petit
        />
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
        <Link to="/" className="hover:opacity-70 transition">{t('home')}</Link>
        <Link to="/listings" className="hover:opacity-70 transition">{t('listings')}</Link>
        <Link to="/about" className="hover:opacity-70 transition">{t('about')}</Link>
        <Link to="/contact" className="hover:opacity-70 transition">{t('contact')}</Link>
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <LanguageSelector />

        <Link 
          to="/contact"
          className={`hidden md:block px-6 py-2.5 text-sm font-semibold rounded-full transition
            ${transparent ? 'bg-white text-black' : 'bg-black text-white'}`}
        >
          Get Started
        </Link>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
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
