import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, MessageSquare, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function MobileNav() {
  const location = useLocation();
  const { t } = useTranslation();

  // Ne pas afficher sur la page admin
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    { path: '/', icon: Home, label: t('home') },
    { path: '/listings', icon: Search, label: t('listings') },
    { path: '/contact', icon: MessageSquare, label: t('contact') },
    { path: '/about', icon: Settings, label: t('about') },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-40 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-screen-xl mx-auto w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
                isActive 
                  ? 'text-black' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className="w-6 h-6" strokeWidth={1.5} />
              <span className="text-[10px] font-medium mt-1 truncate px-1">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 w-8 h-1 bg-black rounded-t-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
