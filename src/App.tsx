/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Home from './pages/Home';
import Listings from './pages/Listings';
import About from './pages/About';
import Contact from './pages/Contact';
import ListingDetails from './pages/ListingDetails';
import { companyInfo } from './constants';
import WhatsAppButton from './components/WhatsAppButton';

function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { i18n, t } = useTranslation();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const transparent = isHome && !isScrolled;

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 h-24 px-10 flex items-center justify-between z-50 transition-all duration-300 ${transparent ? 'text-white' : 'text-gray-900 bg-white border-b border-gray-100'}`}>
      <Link to="/" className="flex items-center">
        <img 
          src="https://i.ibb.co/60PJ8PVw/aass.png" 
          alt={companyInfo.brand} 
          className={`h-12 w-auto transition-all ${!transparent ? 'brightness-0' : ''}`}
          referrerPolicy="no-referrer"
        />
      </Link>
      <nav className="flex gap-8 items-center">
        <Link to="/" className="text-sm font-medium hover:opacity-70 transition">{t('home')}</Link>
        <Link to="/listings" className="text-sm font-medium hover:opacity-70 transition">{t('listings')}</Link>
        <Link to="/about" className="text-sm font-medium hover:opacity-70 transition">{t('about')}</Link>
        <Link to="/contact" className="text-sm font-medium hover:opacity-70 transition">{t('contact')}</Link>
        <button onClick={toggleLanguage} className="text-sm font-bold border border-current px-2 py-1 rounded">
          {i18n.language.toUpperCase()}
        </button>
      </nav>
      <button className={`${transparent ? 'bg-white text-black' : 'bg-black text-white'} px-6 py-2.5 text-sm font-semibold rounded-full hover:opacity-90 transition`}>{t('getStarted')}</button>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-gray-900 font-sans">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/:id" element={<ListingDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <WhatsAppButton />
        <MobileNav />
      </div>
    </BrowserRouter>
  );
}
