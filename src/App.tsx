import React, { useEffect, useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation, I18nextProvider } from 'react-i18next';
import { Sun, Moon, Menu, X } from 'lucide-react';
import i18n from '../lib/i18n'; // Added explicit import for i18n

import Home from './pages/Home';
import Listings from './pages/Listings';
import About from './pages/About';
import Contact from './pages/Contact';
import ListingDetails from './pages/ListingDetails';
import Admin from './pages/Admin';
import Blog from './pages/Blog';

import WhatsAppButton from './components/WhatsAppButton';
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
          className="absolute top-full mt-2 py-1 z-50 bg-black/90 backdrop-blur-sm border border-white/10 rounded-sm"
          style={{ minWidth: 110, right: 0 }}
        >
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => change(l.code)}
              className="w-full text-left px-4 py-2.5 text-xs font-sans flex items-center justify-between transition-colors duration-150 hover:bg-white/10"
              style={{
                color: l.code === i18n.language ? 'var(--accent)' : 'var(--text3)',
              }}
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
      onClick={toggle}
      className="flex items-center justify-center w-8 h-8 transition-colors duration-200"
      style={{ color: 'var(--text3)' }}
      onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text3)')}
      title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
    >
      {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </button>
  );
}

// ─── MOBILE NAV ───
function MobileNav() {
  const { t } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <div className="md:hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-[var(--text)] hover:text-[var(--accent)] transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 top-20 bg-[var(--bg)] z-40 p-6 flex flex-col gap-6" style={{ backgroundColor: 'var(--bg)' }}>
          {[
            ['/', t('home')],
            ['/listings', t('listings')],
            ['/about', t('about')],
            ['/blog', 'BLOG'], // Added manually as it's not in translations yet
            ['/contact', t('contact')],
          ].map(([href, label]) => (
            <Link
              key={href}
              to={href}
              className="text-xl font-light tracking-[0.2em] uppercase border-b border-white/10 pb-4"
              style={{ color: location.pathname === href ? 'var(--accent)' : 'var(--text)' }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
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
      className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-500`}
      style={{
        backgroundColor: scrolled ? 'var(--header-bg, rgba(0,0,0,0.8))' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border, rgba(255,255,255,0.1))' : 'none',
      }}
    >
      <div className="h-full max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-between">
        <Link to="/">
          <img
            src="https://i.ibb.co/60PJ8PVw/aass.png"
            alt={companyInfo?.brand || 'MoveSmart'}
            className="h-7 md:h-9 w-auto transition-all duration-300"
            style={{ filter: 'var(--img-filter, invert(0))' }}
            referrerPolicy="no-referrer"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs font-light tracking-[0.2em] uppercase">
          {[
            ['/', t('home')],
            ['/listings', t('listings')],
            ['/about', t('about')],
            ['/blog', 'BLOG'], // Added as fallback text
            ['/contact', t('contact')],
          ].map(([href, label]) => (
            <Link
              key={href}
              to={href}
              className="transition-colors duration-200"
              style={{ color: location.pathname === href ? 'var(--accent, #f59e0b)' : 'var(--text3, #9ca3af)' }}
              onMouseEnter={e => { if (location.pathname !== href) e.currentTarget.style.color = 'var(--text, #ffffff)'; }}
              onMouseLeave={e => { if (location.pathname !== href) e.currentTarget.style.color = 'var(--text3, #9ca3af)'; }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <LangSelector />
          <MobileNav />
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
      style={{ backgroundColor: 'var(--bg, #080808)', color: 'var(--text, #ffffff)' }}
    >
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/:id" element={<ListingDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      {!isAdmin && <WhatsAppButton />}
    </div>
  );
}

// ─── THEME PROVIDER WRAPPER ───
export default function AppWrapper() {
  const [theme, setTheme] = useState(() => {
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
      html.style.setProperty('--bg', '#ffffff');
      html.style.setProperty('--text', '#000000');
      html.style.setProperty('--text3', '#4b5563');
      html.style.setProperty('--border', 'rgba(0,0,0,0.1)');
      html.style.setProperty('--header-bg', 'rgba(255,255,255,0.9)');
      html.style.setProperty('--img-filter', 'invert(1)');
      html.style.setProperty('--accent-bg', 'rgba(245, 158, 11, 0.1)');
    } else {
      html.removeAttribute('data-theme');
      html.setAttribute('data-theme-dark', 'true');
      html.style.setProperty('--bg', '#080808');
      html.style.setProperty('--text', '#ffffff');
      html.style.setProperty('--text3', '#9ca3af');
      html.style.setProperty('--border', 'rgba(255,255,255,0.1)');
      html.style.setProperty('--header-bg', 'rgba(0,0,0,0.8)');
      html.style.setProperty('--img-filter', 'invert(0)');
      html.style.setProperty('--accent-bg', 'rgba(245, 158, 11, 0.1)');
    }
    html.style.setProperty('--accent', '#f59e0b');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggle = () => {
    setTheme(prev => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      return newTheme;
    });
  };

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeContext.Provider value={{ theme, toggle }}> 
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeContext.Provider>
    </I18nextProvider>
  );
}
