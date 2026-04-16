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
import { companyInfo } from './constants';
import WhatsAppButton from './components/WhatsAppButton';
import MobileNav from './components/MobileNav';

function LanguageSelector() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors text-sm font-medium"
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span>{currentLang.code.toUpperCase()}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                i18n.language === lang.code ? 'bg-gray-100 font-semibold' : ''
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
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
  const isAdmin = location.pathname === '/admin';
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { t } = useTranslation();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const transparent = isHome && !isScrolled && !isMobileMenuOpen;

  const navLinks = [
    { path: '/', label: t('home') },
    { path: '/listings', label: t('listings') },
    { path: '/about', label: t('about') },
    { path: '/contact', label: t('contact') },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 h-20 px-4 md:px-10 flex items-center justify-between z-50 transition-all duration-300 ${
      transparent ? 'text-white' : 'text-gray-900 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm'
    }`}>
      {/* Logo */}
      <Link to="/" className="flex items-center flex-shrink-0">
        <img 
          src="https://i.ibb.co/60PJ8PVw/aass.png" 
          alt={companyInfo.brand} 
          className={`h-10 w-auto transition-all ${!transparent ? 'brightness-0' : ''}`}
          referrerPolicy="no-referrer"
        />
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-8 items-center flex-1 justify-center">
        {navLinks.map(link => (
          <Link 
            key={link.path}
            to={link.path} 
            className="text-sm font-medium hover:opacity-70 transition-opacity"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Desktop Right Section */}
      <div className="hidden md:flex items-center gap-4">
        <LanguageSelector />
        <Link 
          to="/contact"
          className={`${transparent ? 'bg-white text-black' : 'bg-black text-white'} px-6 py-2.5 text-sm font-semibold rounded-full hover:opacity-90 transition-opacity`}
        >
          {t('getStarted')}
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`absolute top-20 left-0 right-0 bg-white shadow-lg md:hidden`}>
          <nav className="flex flex-col p-4 gap-2">
            {navLinks.map(link => (
              <Link 
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="py-2 px-4 border-t border-gray-100 mt-2">
              <LanguageSelector />
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
      <div className="min-h-screen bg-white text-gray-900 font-sans">
        {!window.location.pathname.startsWith('/admin') && <Header />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/:id" element={<ListingDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
        {!window.location.pathname.startsWith('/admin') && <WhatsAppButton />}
        <MobileNav />
      </div>
    </BrowserRouter>
  );
}
