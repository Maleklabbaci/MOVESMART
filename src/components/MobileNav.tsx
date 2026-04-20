import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, MessageSquare, Info } from 'lucide-react';

export default function MobileNav() {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;

  const items = [
    { path: '/', icon: Home, label: 'Accueil' },
    { path: '/listings', icon: Search, label: 'Biens' },
    { path: '/contact', icon: MessageSquare, label: 'Contact' },
    { path: '/about', icon: Info, label: 'À Propos' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40"
      style={{ backgroundColor: '#080808', borderTop: '1px solid rgba(255,255,255,0.06)', paddingBottom: 'env(safe-area-inset-bottom)', fontFamily: 'sans-serif' }}>
      <div className="flex justify-around items-center h-16 relative">
        {items.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <Link key={path} to={path}
              className="flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors duration-200 relative"
              style={{ color: active ? '#FBBF24' : '#6B7280' }}>
              <Icon className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-[9px] tracking-[0.12em] uppercase">{label}</span>
              {active && <div style={{ position: 'absolute', bottom: 0, width: 24, height: 2, backgroundColor: '#FBBF24', borderRadius: '2px 2px 0 0' }} />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
