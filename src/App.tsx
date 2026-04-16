import React, { useState, useEffect } from 'react';
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
import { companyInfo } from './constants';

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
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/30 hover:border-white/50 text-sm font-medium text-white hover:text-white transition"
      >
        <span>{current.flag}</span>
        <span>{current.code.toUpperCase()}</span>
        <ChevronDown className="w-4 h-4" />
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 px-6 md:px-10 flex items-center justify-between
      ${isHome && !isScrolled 
        ? 'bg-transparent text-white' 
        : 'bg-white text-gray-900 shadow-md border-b'}`}>

      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img 
          src="https://i.ibb.co/60PJ8PVw/aass.png" 
          alt={companyInfo.brand} 
          className="h-9 md:h-11 w-auto"
        />
      </Link>

      {/* Navigation centrée */}
      <nav className="hidden md:flex items-center gap-10 text-sm font-medium absolute left-1/2 -translate-x-1/2">
        <Link to="/" className="hover:opacity-70 transition">Home</Link>
        <Link to="/listings" className="hover:opacity-70 transition">Listings</Link>
        <Link to="/about" className="hover:opacity-70 transition">About</Link>
        <Link to="/contact" className="hover:opacity-70 transition">Contact</Link>
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <LanguageSelector />
        
        <Link 
          to="/contact"
          className={`px-6 py-2.5 text-sm font-semibold rounded-full transition
            ${isHome && !isScrolled 
              ? 'bg-white text-black' 
              : 'bg-black text-white'}`}
        >
          Get Started
        </Link>
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
