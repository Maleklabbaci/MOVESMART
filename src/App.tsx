import React, { useEffect, useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation, I18nextProvider } from 'react-i18next';
import { Sun, Moon, Menu, X, ArrowRight, Globe } from 'lucide-react';
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
        className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase transition-colors duration-200"
        style={{ color: 'var(--text3)' }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text3)')}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden md:inline-block">{current.label}</span>
      </button>

      {open && (
        <div
          className="absolute top-full mt-4 py-2 z-50 rounded-lg shadow-2xl glass-effect animate-slide-down border"
          style={{ minWidth: 140, right: 0, backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}
        >
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => change(l.code)}
              className="w-full text-left px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all duration-200"
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
      className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300"
      style={{ color: 'var(--text3)', border: '1px solid transparent' }}
      onMouseEnter={e => {
        e.currentTarget.style.color = 'var(--text)';
        e.currentTarget.style.backgroundColor = 'var(--surface)';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = 'var(--text3)';
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.borderColor = 'transparent';
      }}
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

  useEffect(() => {
    setIsOpen(false);
    // Bloque le scroll si le menu est ouvert
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [location.pathname, isOpen]);

  return (
    <div className="md:hidden flex items-center">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full transition-all duration-300 z-50 relative"
        style={{ color: 'var(--text)', backgroundColor: isOpen ? 'transparent' : 'var(--surface)' }}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* OVERLAY SOMBRE */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* MENU COULISSANT */}
      <div 
        className={`fixed top-0 bottom-0 right-0 w-[80%] max-w-sm z-40 p-8 pt-28 flex flex-col gap-8 shadow-2xl transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)`} 
        style={{ 
          backgroundColor: 'var(--bg)', 
          borderLeft: '1px solid var(--border)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)' 
        }}
      >
        {[
          ['/', t('home')],
          ['/listings', t('listings')],
          ['/about', t('about')],
          ['/blog', 'Blog'], 
          ['/contact', t('contact')],
        ].map(([href, label], index) => (
          <Link
            key={href}
            to={href}
            className={`text-2xl font-bold tracking-tight uppercase pb-4 flex items-center justify-between group transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ 
              color: location.pathname === href ? 'var(--accent)' : 'var(--text)', 
              borderBottom: '1px solid var(--border)',
              transitionDelay: `${index * 50}ms`
            }}
          >
            {label}
            <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }}/>
          </Link>
        ))}

        <div className="mt-auto pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text3)' }}>Contact direct</p>
          <a href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g,'')}`} className="text-xl font-bold transition-colors hover:text-amber-500" style={{ color: 'var(--text)' }}>
            {companyInfo.whatsapp}
          </a>
        </div>
      </div>
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
      className="fixed top-0 left-0 right-0 z-50 h-[80px] transition-all duration-500 ease-out"
      style={{
        backgroundColor: scrolled ? 'var(--header-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      }}
    >
      <div className="h-full max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-4 group">
          <img
            src="https://i.ibb.co/60PJ8PVw/aass.png"
            alt={companyInfo?.brand || 'MoveSmart'}
            className="h-6 md:h-8 w-auto transition-transform duration-500 group-hover:scale-105"
            style={{ filter: 'var(--img-filter)' }}
            referrerPolicy="no-referrer"
          />
          <span className="font-bold text-xl tracking-tighter hidden lg:block transition-colors" style={{ color: 'var(--text)' }}>
            MoveSmart
          </span>
        </Link>

        {/* NAVIGATION DESKTOP avec petit background moderne */}
        <nav className="hidden md:flex items-center gap-2 p-1.5 rounded-full glass-effect border transition-all duration-300" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
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
              className="px-5 py-2.5 rounded-full transition-all duration-300 text-[11px] font-bold uppercase tracking-widest relative overflow-hidden group"
              style={{ 
                color: location.pathname === href ? 'var(--bg)' : 'var(--text)',
                backgroundColor: location.pathname === href ? 'var(--text)' : 'transparent'
              }}
            >
              <span className="relative z-10">{label}</span>
              {location.pathname !== href && (
                <div className="absolute inset-0 bg-black/5 dark:bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full"></div>
              )}
            </Link>
          ))}
        </nav>

        {/* ICONES DROITE */}
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
      className="min-h-screen transition-colors duration-400 flex flex-col selection:bg-amber-500 selection:text-black"
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
      return saved || 'dark'; // Mode sombre par défaut pour le côté luxe.
    }
    return 'dark';
  });

  // Appliquer le thème via data-attribute sur <html>
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
