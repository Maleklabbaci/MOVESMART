import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';

import Home from './pages/Home';
import Listings from './pages/Listings';
import About from './pages/About';
import Contact from './pages/Contact';
import ListingDetails from './pages/ListingDetails';
import Admin from './pages/Admin';

import WhatsAppButton from './components/WhatsAppButton';
import MobileNav from './components/MobileNav';
import { companyInfo } from './constants';

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
      className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-500 ${
        scrolled
          ? 'bg-[#080808]/95 backdrop-blur-md border-b border-white/[0.04]'
          : 'bg-transparent'
      }`}
      style={{ fontFamily: 'sans-serif' }}
    >
      <div className="relative h-full max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="https://i.ibb.co/60PJ8PVw/aass.png"
            alt={companyInfo.brand}
            className="h-7 md:h-9 w-auto brightness-0 invert"
            referrerPolicy="no-referrer"
          />
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-10 text-xs font-light tracking-[0.2em] uppercase">
          {[['/', 'Accueil'], ['/listings', 'Propriétés'], ['/about', 'À Propos'], ['/contact', 'Contact']].map(([href, label]) => (
            <Link key={href} to={href}
              className={`transition-colors duration-200 ${location.pathname === href ? 'text-amber-400' : 'text-gray-400 hover:text-white'}`}>
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link to="/contact"
          className="hidden md:inline-flex items-center gap-2 border border-amber-400/30 text-amber-400 px-6 py-2 text-xs font-light tracking-[0.2em] uppercase hover:bg-amber-400 hover:text-black transition-all duration-300">
          Commencer
        </Link>
      </div>
    </header>
  );
}

function App() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Google Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap"
        rel="stylesheet"
      />
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
