import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Menu, X } from 'lucide-react';

import Home from './pages/Home';
import Listings from './pages/Listings';
import About from './pages/About';
import Contact from './pages/Contact';
import ListingDetails from './pages/ListingDetails';
// import Admin from './pages/Admin';  // ⏸️ Désactivé pour debug
import { companyInfo } from './constants';
import WhatsAppButton from './components/WhatsAppButton';
import MobileNav from './components/MobileNav';

function LanguageSelector() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en');
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1 px-2 py-1 rounded border border-gray-300 text-sm"
    >
      <span className="text-lg">{i18n.language === 'en' ? '🇬🇧' : '🇫🇷'}</span>
      <span className="hidden sm:inline">{i18n.language.toUpperCase()}</span>
    </button>
  );
}

function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { t } = useTranslation();

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const transparent = isHome && !isScrolled;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 h-14 md:h-16 transition-all duration-300 px-4 flex items-center justify-between
      ${transparent ? 'text-white' : 'bg-white text-gray-900 shadow-sm'}`}>

      {/* Logo - MINUSCULE */}
      <Link to="/" className="flex-shrink-0">
        <img 
          src="https://i.ibb.co/60PJ8PVw/aass.png" 
          alt="Logo"
          className="h-5 md:h-7 w-auto"
        />
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-4 text-xs md:text-sm font-medium">
        <Link to="/" className="hover:opacity-70">{t('home')}</Link>
        <Link to="/listings" className="hover:opacity-70">{t('listings')}</Link>
        <Link to="/about" className="hover:opacity-70">{t('about')}</Link>
        <Link to="/contact" className="hover:opacity-70">{t('contact')}</Link>
      </nav>

      {/* Right */}
      <div className="flex items-center gap-2">
        <LanguageSelector />
        <Link 
          to="/contact"
          className={`hidden md:block px-4 py-1.5 text-xs font-semibold rounded-full transition
            ${transparent ? 'bg-white text-black' : 'bg-black text-white'}`}
        >
          {t('getStarted')}
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
          {/* <Route path="/admin" element={<Admin />} /> */}
        </Routes>
        <WhatsAppButton />
        <MobileNav />
      </div>
    </BrowserRouter>
  );
}
