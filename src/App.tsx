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
import Blog from './pages/Blog';

import WhatsAppButton from './components/WhatsAppButton';
import MobileNav from './components/MobileNav';

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

// ─── HEADER ───
function Header() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (isAdmin) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}
    >
      <div className="h-full max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-widest uppercase">
          MoveSmart
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-xs font-light tracking-[0.2em] uppercase">
          <Link to="/" className="hover:text-amber-500 transition-colors">Home</Link>
          <Link to="/listings" className="hover:text-amber-500 transition-colors">Listings</Link>
          <Link to="/about" className="hover:text-amber-500 transition-colors">About</Link>
          <Link to="/blog" className="hover:text-amber-500 transition-colors">Blog</Link>
          <Link to="/contact" className="hover:text-amber-500 transition-colors">Contact</Link>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} className="w-8 h-8 flex items-center justify-center hover:text-amber-500 transition-colors">
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

// ─── MAIN APP ───
function App() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <div className="min-h-screen bg-black text-white transition-colors duration-300">
      <Header />
      <main className="pt-20">
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
      {!isAdmin && <MobileNav />}
    </div>
  );
}

// ─── THEME PROVIDER WRAPPER ───
export default function AppWrapper() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('theme') || 'dark';
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
    <ThemeContext.Provider value={{ theme, toggle }}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeContext.Provider>
  );
}