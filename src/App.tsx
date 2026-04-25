import React, { useEffect, useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation, I18nextProvider } from 'react-i18next';
import { Sun, Moon, Menu, X, Globe, ArrowUpRight } from 'lucide-react';
import i18n from './lib/i18n';

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
        className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--text)]"
        style={{ color: 'var(--text-muted)' }}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline-block">{current.label}</span>
      </button>

      {open && (
        <div
          className="absolute top-full mt-4 py-2 z-50 glass-panel shadow-2xl transition-all duration-300 animate-blur-fade"
          style={{ minWidth: 160, right: 0 }}
        >
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => change(l.code)}
              className="w-full text-left px-5 py-3 text-sm font-medium flex items-center justify-between transition-colors"
              style={{
                color: l.code === i18n.language ? 'var(--text)' : 'var(--text-muted)',
                backgroundColor: l.code === i18n.language ? 'var(--surface-hover)' : 'transparent',
              }}
              onMouseEnter={e => { if(l.code !== i18n.language) e.currentTarget.style.backgroundColor = 'var(--surface-hover)' }}
              onMouseLeave={e => { if(l.code !== i18n.language) e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <span>{l.name}</span>
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
      className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300"
      style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
      onMouseEnter={e => {
        e.currentTarget.style.color = 'var(--text)';
        e.currentTarget.style.borderColor = 'var(--text-muted)';
        e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = 'var(--text-muted)';
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
      title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
    >
      {theme === 'dark' ? <Sun className="w-4 h-4" strokeWidth={1.5} /> : <Moon className="w-4 h-4" strokeWidth={1.5} />}
    </button>
  );
}

// ─── MOBILE NAV ───
function MobileNav() {
  const { t } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <div className="md:hidden flex items-center ml-1">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 transition-all duration-300 rounded-full"
        style={{ color: 'var(--text)', border: '1px solid var(--border)' }}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 top-[80px] z-40 p-8 flex flex-col gap-6 animate-blur-fade" 
          style={{ backgroundColor: 'var(--bg)', borderTop: '1px solid var(--border)' }}
        >
          {[
            ['/', t('home')],
            ['/listings', t('listings')],
            ['/about', t('about')],
            ['/blog', 'Blog'], 
            ['/contact', t('contact')],
          ].map(([href, label]) => (
            <Link
              key={href}
              to={href}
              className="text-4xl font-semibold tracking-tight pb-6 flex items-center justify-between group"
              style={{ 
                color: location.pathname === href ? 'var(--text)' : 'var(--text-muted)', 
                borderBottom: '1px solid var(--border)' 
              }}
            >
              {label}
              <ArrowUpRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-muted)' }}/>
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
    const onScroll = () => setScrolled(window.scrollY > 20);
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
      className="fixed top-0 left-0 right-0 z-50 h-[80px] transition-all duration-500 ease-out"
      style={{
        backgroundColor: scrolled ? 'var(--header-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      }}
    >
      <div className="h-full max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="https://i.ibb.co/60PJ8PVw/aass.png"
            alt={companyInfo?.brand || 'MoveSmart'}
            className="h-6 md:h-7 w-auto transition-transform duration-500 group-hover:scale-105"
            style={{ filter: 'var(--img-filter)' }}
            referrerPolicy="no-referrer"
          />
          <span className="font-bold text-xl tracking-tight hidden sm:block" style={{ color: 'var(--text)' }}>
            MoveSmart
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-10 bg-black/5 dark:bg-white/5 px-8 py-3 rounded-full border" style={{ borderColor: 'var(--border)' }}>
          {[
            ['/', t('home')],
            ['/listings', t('listings')],
            ['/about', t('about')],
            ['/blog', 'Blog'],
            ['/contact', t('contact')],
          ].map(([href, label]) => (
            <Link
              key={href}
              to={href}
              className="transition-all duration-300 text-sm font-medium"
              style={{ color: location.pathname === href ? 'var(--text)' : 'var(--text-muted)' }}
              onMouseEnter={e => { if (location.pathname !== href) e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={e => { if (location.pathname !== href) e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-3 sm:gap-6">
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
      className="min-h-screen transition-colors duration-500 flex flex-col selection:bg-black selection:text-white"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
    >
      <Header />
      <main className="flex-1">
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
      return saved || 'dark'; // Dark par défaut car c'est + pro/2024
    }
    return 'dark';
  });

  // GÈRE LE THEME PARFAITEMENT DANS LE HTML
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
  }, [theme]);

  const toggle = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
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
