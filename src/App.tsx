import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Home from './pages/Home';
import Listings from './pages/Listings';
import About from './pages/About';
import Contact from './pages/Contact';
import ListingDetails from './pages/ListingDetails';
import WhatsAppButton from './components/WhatsAppButton';
import MobileNav from './components/MobileNav';

function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [scrolled, setScrolled] = React.useState(false);
  const { i18n, t } = useTranslation();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fond blanc si scroll OU pas sur home
  const solidBg = !isHome || scrolled;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 h-14 transition-all duration-300 ${
      solidBg ? 'bg-white shadow-sm text-black' : 'bg-transparent text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo - NOIR quand solid, BLANC quand transparent */}
        <Link to="/">
          <img 
            src="https://i.ibb.co/60PJ8PVw/aass.png" 
            alt="Logo" 
            className={`h-6 w-auto transition-all ${
              solidBg ? 'brightness-0' : ''
            }`}
          />
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:opacity-70">{t('home')}</Link>
          <Link to="/listings" className="hover:opacity-70">{t('listings')}</Link>
          <Link to="/about" className="hover:opacity-70">{t('about')}</Link>
          <Link to="/contact" className="hover:opacity-70">{t('contact')}</Link>
        </nav>

        {/* Langue */}
        <button 
          onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-current text-sm"
        >
          {i18n.language === 'en' ? '🇬🇧' : '🇫🇷'}
        </button>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-14">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/listings/:id" element={<ListingDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
        <WhatsAppButton />
        <MobileNav />
      </div>
    </BrowserRouter>
  );
}
