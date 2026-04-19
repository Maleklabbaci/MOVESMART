import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Home from './pages/Home';
import Listings from './pages/Listings';
import About from './pages/About';
import Contact from './pages/Contact';
import ListingDetails from './pages/ListingDetails';
import Admin from './pages/Admin';

import WhatsAppButton from './components/WhatsAppButton';
import MobileNav from './components/MobileNav';
import { companyInfo } from './constants';

function LanguageSelector({ transparent }: { transparent: boolean }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const langs = [
    { code: 'en', label: 'EN' },
    { code: 'fr', label: 'FR' },
  ];
  const current = langs.find((l) => l.code === i18n.language) ?? langs[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition
          ${transparent ? 'text-white hover:opacity-75' : 'bg-white text-black border border-gray-200 hover:bg-gray-50'}`}
      >
        {current.label}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          {langs.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                i18n.changeLanguage(l.code);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm font-semibold text-black hover:bg-gray-100"
            >
              {l.label}
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
  const [scrolled, setScrolled] = useState(() => typeof window !== 'undefined' ? window.scrollY > 50 : false);
  const { t } = useTranslation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const transparent = isHome && !scrolled;
const linkClass = `hover:opacity-75 transition font-medium ${transparent ? '!text-white' : '!text-gray-900'}`;
  
  return (
 <header
  className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300
  ${transparent ? 'bg-transparent text-white' : 'bg-white text-gray-900 shadow-md border-b border-gray-100'}`}
>
      <div className="relative h-full max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center min-w-[160px]">
          <Link to="/" className="flex items-center">
            <img
              src="https://i.ibb.co/60PJ8PVw/aass.png"
              alt={companyInfo.brand}
              className={`h-9 md:h-11 w-auto transition duration-300 ${transparent ? 'brightness-0 invert' : 'brightness-0'}`}
              referrerPolicy="no-referrer"
            />
          </Link>
        </div>

        {/* CENTER */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-10 text-sm">
          <Link to="/" className={linkClass}>{t('home')}</Link>
          <Link to="/listings" className={linkClass}>{t('listings')}</Link>
          <Link to="/about" className={linkClass}>{t('about')}</Link>
          <Link to="/contact" className={linkClass}>{t('contact')}</Link>
        </nav>

        {/* RIGHT */}
        <div className="flex items-center justify-end gap-4 min-w-[160px]">
          <LanguageSelector transparent={transparent} />

          <Link
            to="/contact"
            className={`px-6 py-2.5 text-sm font-semibold rounded-full border-2 transition-all duration-300
              ${transparent
                ? 'border-white text-white hover:bg-white hover:text-black'
                : 'bg-black text-white border-black hover:bg-gray-800'
              }`}
          >
            {t('getStarted', 'Commencer')}
          </Link>
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
