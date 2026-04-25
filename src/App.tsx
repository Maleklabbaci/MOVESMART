import React, { useEffect, useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation, I18nextProvider } from 'react-i18next';
import { Sun, Moon, Menu, X, ArrowRight } from 'lucide-react';
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
        className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors duration-200"
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
          className="absolute top-full mt-4 py-2 z-50 card-border shadow-2xl animate-fade-in"
          style={{ minWidth: 140, right: 0 }}
        >
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => change(l.code)}
              className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest flex items-center justify-between transition-colors duration-150"
              style={{
                color: l.code === i18n.language ? 'var(--accent)' : 'var(--text)',
                backgroundColor: l.code === i18n.language ? 'var(--accent-bg)' : 'transparent',
              }}
              onMouseEnter={e => { if(l.code !== i18n.language) e.currentTarget.style.color = 'var(--accent)' }}
              onMouseLeave={e => { if(l.code !== i18n.language) e.currentTarget.style.color = 'var(--text)' }}
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
      className="flex items-center justify-center w-10 h-10 transition-all duration-200 rounded-full border border-transparent"
      style={{ color: 'var(--text3)' }}
      onMouseEnter={e => {
        e.currentTarget.style.color = 'var(--accent)';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = 'var(--text3)';
        e.currentTarget.style.borderColor = 'transparent';
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
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }, [location.pathname, isOpen]);

  return (
    <div className="md:hidden flex items-center ml-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 transition-colors duration-200 relative z-50 rounded-full border border-transparent"
        style={{ color: 'var(--text)' }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" strokeWidth={1.5} />}
      </button>

      {/* Overlay Sombre */}
      <div 
        className={`fixed inset-0 z-30 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Menu Coulissant */}
      <div 
        className={`fixed top-0 bottom-0 right-0 w-[85%] max-w-sm z-40 p-10 pt-32 flex flex-col gap-8 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]`} 
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
          ['/blog', 'Journal'], 
          ['/contact', t('contact')],
        ].map(([href, label], i) => (
          <Link
            key={href}
            to={href}
            className={`text-2xl font-serif tracking-wider uppercase pb-4 flex items-center justify-between group transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ 
              color: location.pathname === href ? 'var(--accent)' : 'var(--text)', 
              borderBottom: '1px solid var(--border)',
              transitionDelay: `${i * 50}ms`
            }}
          >
            {label}
            <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }}/>
          </Link>
        ))}

        <div className="mt-auto pt-10 border-t" style={{ borderColor: 'var(--border)' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text3)' }}>Service Client</p>
          <a href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g,'')}`} className="text-xl font-serif tracking-widest transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--text)' }}>
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
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      }}
    >
      <div className="h-full max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-4 group">
          <img
            src="https://i.ibb.co/60PJ8PVw/aass.png"
            alt={companyInfo?.brand || 'MoveSmart'}
            className="h-6 md:h-7 w-auto transition-transform duration-500 group-hover:scale-105"
            style={{ filter: 'var(--img-filter)' }}
            referrerPolicy="no-referrer"
          />
          <span className="font-serif font-bold text-2xl tracking-tighter hidden lg:block transition-colors" style={{ color: 'var(--text)' }}>
            MoveSmart
          </span>
        </Link>

        {/* NAVIGATION DESKTOP */}
        <nav className="hidden md:flex items-center gap-10">
          {[
            ['/', t('home')],
            ['/listings', t('listings')],
            ['/about', t('about')],
            ['/blog', 'Journal'],
            ['/contact', t('contact')],
          ].map(([href, label]) => (
            <Link
              key={href}
              to={href}
              className="text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-200 py-2 relative group"
              style={{ color: location.pathname === href ? 'var(--accent)' : 'var(--text)' }}
            >
              {label}
              <span 
                className="absolute bottom-0 left-0 w-full h-[1px] transition-transform duration-300 origin-left"
                style={{ 
                  backgroundColor: 'var(--accent)', 
                  transform: location.pathname === href ? 'scaleX(1)' : 'scaleX(0)' 
                }}
              ></span>
            </Link>
          ))}
        </nav>

        {/* ICONES DROITE */}
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
      className="min-h-screen transition-colors duration-300 flex flex-col"
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
      return saved || 'dark'; // Mode sombre par défaut
    }
    return 'dark';
  });

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

  const toggle = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

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
