import React, { useEffect, useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sun, Moon } from 'lucide-react';

import Home from './pages/Home';
import Listings from './pages/Listings';
import About from './pages/About';
import Contact from './pages/Contact';
import ListingDetails from './pages/ListingDetails';
import Admin from './pages/Admin';
import WhatsAppButton from './components/WhatsAppButton';
import MobileNav from './components/MobileNav';
import { companyInfo } from './constants';

// ─── THEME CONTEXT ───
interface ThemeContextType {
  theme: string;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

// ─── LANGUAGES ───
const LANGS = [
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ar', label: 'ع', name: 'العربية' },
];

// ─── LANGUAGE SELECTOR ───
function LangSelector() {
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
        style={{ color: 'var(--text3)' }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text3)')}
      >
        <span>{current.label}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" style={{ opacity: 0.5, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-full mt-2 py-1 z-50"
          style={{
            backgroundColor: 'var(--bg3)',
            border: '1px solid var(--border)',
            minWidth: 110,
            right: 0,
          }}
        >
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => change(l.code)}
              className="w-full text-left px-4 py-2.5 text-xs font-sans flex items-center justify-between transition-colors duration-150"
              style={{
                color: l.code === i18n.language ? 'var(--accent)' : 'var(--text3)',
                backgroundColor: l.code === i18n.language ? 'var(--accent-bg)' : 'transparent',
              }}
              onMouseEnter={e => { if (l.code !== i18n.language) e.currentTarget.style.backgroundColor = 'var(--border)'; }}
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

// ─── THEME TOGGLE BUTTON ───
function ThemeToggle() {
  const { theme, toggle } = useTheme();
  
  return (
    <button
      onClick={() => {
        console.log('🌓 Theme toggle clicked! Current:', theme);
        toggle();
      }}
      className="flex items-center justify-center w-8 h-8 transition-colors duration-200"
      style={{ color: 'var(--text3)' }}
      onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text3)')}
      title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
    >
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

// ─── HEADER ───
function Header() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';
  const [scrolled, setScrolled] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  if (isAdmin) return null;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-500"
      style={{
        backgroundColor: scrolled ? 'var(--header-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      }}
    >
      <div className="h-full max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-between">
        <Link to="/">
          <img
            src="https://i.ibb.co/60PJ8PVw/aass.png"
            alt={companyInfo.brand}
            className="h-7 md:h-9 w-auto transition-all duration-300"
            style={{ filter: 'var(--img-filter)' }}
            referrerPolicy="no-referrer"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs font-light tracking-[0.2em] uppercase">
          {[
            ['/', t('home')],
            ['/listings', t('listings')],
            ['/about', t('about')],
            ['/contact', t('contact')],
          ].map(([href, label]) => (
            <Link
              key={href}
              to={href}
              className="transition-colors duration-200"
              style={{ color: location.pathname === href ? 'var(--accent)' : 'var(--text3)' }}
              onMouseEnter={e => { if (location.pathname !== href) e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={e => { if (location.pathname !== href) e.currentTarget.style.color = 'var(--text3)'; }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <LangSelector />
          <Link
            to="/contact"
            className="hidden md:inline-flex items-center gap-2 text-xs font-light tracking-[0.2em] uppercase transition-all duration-300 px-5 py-2"
            style={{ border: '1px solid var(--accent-border)', color: 'var(--accent)' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--accent)'; e.currentTarget.style.color = '#000'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--accent)'; }}
          >
            {t('getStarted')}
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─── MAIN APP ───
function App() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
    >
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

// ─── THEME PROVIDER WRAPPER ───
export default function AppWrapper() {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved || 'dark';
    }
    return 'dark';
  });

  // Appliquer le thème sur <html>
  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'light') {
      html.setAttribute('data-theme', 'light');
      html.removeAttribute('data-theme-dark');
    } else {
      html.removeAttribute('data-theme');
      html.setAttribute('data-theme-dark', 'true');
    }
    localStorage.setItem('theme', theme);
    console.log('🎨 Theme applied:', theme, '| data-theme:', html.getAttribute('data-theme'));
  }, [theme]);

  const toggle = () => {
    setTheme(prev => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      console.log('🔄 Toggling theme:', prev, '→', newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeContext.Provider>
  );
}
