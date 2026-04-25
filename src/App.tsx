import React, { useEffect, useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation, I18nextProvider } from 'react-i18next';
import { Sun, Moon, Menu, X, Globe } from 'lucide-react';
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
        className="flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase transition-colors duration-200"
        style={{ color: 'var(--text3)' }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text3)')}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline-block">{current.label}</span>
      </button>

      {open && (
        <div
          className="absolute top-full mt-4 py-2 z-50 rounded shadow-2xl transition-all duration-200 animate-fade-in"
          style={{ 
            minWidth: 140, 
            right: 0, 
            backgroundColor: 'var(--header-bg)', 
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border)' 
          }}
        >
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => change(l.code)}
              className="w-full text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider flex items-center justify-between transition-colors duration-150"
              style={{
                color: l.code === i18n.language ? 'var(--accent)' : 'var(--text)',
                backgroundColor: l.code === i18n.language ? 'var(--accent-bg)' : 'transparent',
              }}
              onMouseEnter={e => { if(l.code !== i18n.language) e.currentTarget.style.backgroundColor = 'var(--border)' }}
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
      className="flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200"
      style={{ color: 'var(--text3)' }}
      onMouseEnter={e => {
        e.currentTarget.style.color = 'var(--accent)';
        e.currentTarget.style.backgroundColor = 'var(--accent-bg)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = 'var(--text3)';
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
      title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
    >
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
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
    <div className="md:hidden flex items-center ml-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 transition-colors duration-200 rounded-full"
        style={{ color: 'var(--text)' }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--border)'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 top-[72px] z-40 p-8 flex flex-col gap-8 animate-fade-in" 
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
              className="text-2xl font-serif tracking-wide pb-4 transition-colors"
              style={{ 
                color: location.pathname === href ? 'var(--accent)' : 'var(--text)', 
                borderBottom: '1px solid var(--border)' 
              }}
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
    const onScroll = () => setScrolled(window.scrollY > 40);
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
      className="fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'var(--header-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      }}
    >
      <div className="h-full max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            src="https://i.ibb.co/60PJ8PVw/aass.png"
            alt={companyInfo?.brand || 'MoveSmart'}
            className="h-6 md:h-8 w-auto transition-all duration-300"
            style={{ filter: 'var(--img-filter)' }}
            referrerPolicy="no-referrer"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-[11px] font-semibold tracking-[0.2em] uppercase">
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
              className="transition-colors duration-200 relative py-2"
              style={{ color: location.pathname === href ? 'var(--accent)' : 'var(--text3)' }}
              onMouseEnter={e => { if (location.pathname !== href) e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={e => { if (location.pathname !== href) e.currentTarget.style.color = 'var(--text3)'; }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-6">
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
      className="min-h-screen transition-colors duration-400 flex flex-col"
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
      return saved || 'light'; // Fallback to light theme directly
    }
    return 'light';
  });

  // Apply the theme to html tags immediately on mount and change
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
