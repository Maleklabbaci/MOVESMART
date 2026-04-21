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

const LANGS = [
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ar', label: 'ع', name: 'العربية' },
];

function LangSelector({ dark = false }: { dark?: boolean }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const current = LANGS.find(l => l.code === i18n.language) ?? LANGS[0];

  const change = (code: string) => {
    i18n.changeLanguage(code);
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = code;
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 text-xs font-sans tracking-[0.15em] uppercase transition-colors duration-200"
        style={{ color: dark ? '#9CA3AF' : '#9CA3AF' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#FBBF24')}
        onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}
      >
        <span>{current.label}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" style={{ opacity: 0.5, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-full mt-2 py-1 z-50"
          style={{
            backgroundColor: '#0d0d0d',
            border: '1px solid rgba(255,255,255,0.08)',
            minWidth: 110,
            right: 0,
          }}
        >
          {LANGS.map(l => (
            <button key={l.code} onClick={() => change(l.code)}
              className="w-full text-left px-4 py-2.5 text-xs font-sans flex items-center justify-between transition-colors duration-150"
              style={{
                color: l.code === i18n.language ? '#FBBF24' : '#9CA3AF',
                backgroundColor: l.code === i18n.language ? 'rgba(251,191,36,0.06)' : 'transparent',
              }}
              onMouseEnter={e => { if (l.code !== i18n.language) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (l.code !== i18n.language) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <span>{l.name}</span>
              <span style={{ opacity: 0.4 }}>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Header() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';
  const [scrolled, setScrolled] = useState(false);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sync RTL on mount
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  if (isAdmin) return null;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-500"
      style={{
        backgroundColor: scrolled ? 'rgba(8,8,8,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.04)' : 'none',
        fontFamily: 'sans-serif',
      }}
    >
      <div className="h-full max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src="https://i.ibb.co/60PJ8PVw/aass.png" alt={companyInfo.brand}
            className="h-7 md:h-9 w-auto brightness-0 invert" referrerPolicy="no-referrer" />
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-light tracking-[0.2em] uppercase">
          {[['/', t('home')], ['/listings', t('listings')], ['/about', t('about')], ['/contact', t('contact')]].map(([href, label]) => (
            <Link key={href} to={href}
              className="transition-colors duration-200"
              style={{ color: location.pathname === href ? '#FBBF24' : '#9CA3AF' }}
              onMouseEnter={e => { if (location.pathname !== href) e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { if (location.pathname !== href) e.currentTarget.style.color = '#9CA3AF'; }}>
              {label}
            </Link>
          ))}
        </nav>

        {/* Right: Lang + CTA */}
        <div className="flex items-center gap-4">
          <LangSelector />
          <Link to="/contact"
            className="hidden md:inline-flex items-center gap-2 text-xs font-light tracking-[0.2em] uppercase transition-all duration-300 px-5 py-2"
            style={{ border: '1px solid rgba(251,191,36,0.3)', color: '#FBBF24' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#FBBF24'; e.currentTarget.style.color = '#000'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#FBBF24'; }}>
            {t('getStarted')}
          </Link>
        </div>
      </div>
    </header>
  );
}

function App() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <div className="min-h-screen bg-[#080808]">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<ListingDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      {!isAdmin && <WhatsAppButton />}
      {!isAdmin && <MobileNav />}
    </div>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
