import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';

import Home from './pages/Home';
import Listings from './pages/Listings';
import About from './pages/About';
import Contact from './pages/Contact';
import ListingDetails from './pages/ListingDetails';
import { companyInfo } from './constants';
import WhatsAppButton from './components/WhatsAppButton';
import MobileNav from './components/MobileNav';

function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenu, setMobileMenu] = React.useState(false);
  const { i18n, t } = useTranslation();

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const transparent = isHome && !isScrolled;

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      transparent ? 'text-white' : 'bg-white text-gray-900 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src="https://i.ibb.co/60PJ8PVw/aass.png" 
            alt="Logo" 
            className="h-6 w-auto object-contain"
          />
        </Link>

        {/* Nav Desktop */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/" className="hover:opacity-70">{t('home')}</Link>
          <Link to="/listings" className="hover:opacity-70">{t('listings')}</Link>
          <Link to="/about" className="hover:opacity-70">{t('about')}</Link>
          <Link to="/contact" className="hover:opacity-70">{t('contact')}</Link>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleLang}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-current text-sm hover:bg-white/10 transition"
          >
            <span className="text-base">{i18n.language === 'en' ? '🇬🇧' : '🇫🇷'}</span>
            <span className="hidden sm:inline">{i18n.language.toUpperCase()}</span>
          </button>
          <Link 
            to="/contact"
            className={`hidden md:block px-5 py-2 text-sm font-semibold rounded-full transition ${
              transparent ? 'bg-white text-black' : 'bg-black text-white'
            }`}
          >
            {t('getStarted')}
          </Link>
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-14">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/listings/:id" element={<ListingDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
        <WhatsAppButton />
        <MobileNav />
      </div>
    </BrowserRouter>
  );
}
