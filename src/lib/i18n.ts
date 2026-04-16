import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          home: 'Home',
          listings: 'Listings',
          about: 'About Us',
          contact: 'Contact',
          getStarted: 'Get started',
          search: 'Search by location or property name...',
          minPrice: 'Min Price',
          maxPrice: 'Max Price',
          sortBy: 'Sort by',
          priceLow: 'Price: Low to High',
          priceHigh: 'Price: High to Low',
          beds: 'Beds (Most)',
          area: 'Area (Largest)',
          viewDetails: 'View Details',
          noListings: 'No listings found matching your search.',
        },
      },
      fr: {
        translation: {
          home: 'Accueil',
          listings: 'Annonces',
          about: 'À propos',
          contact: 'Contact',
          getStarted: 'Commencer',
          search: 'Rechercher par lieu ou nom...',
          minPrice: 'Prix Min',
          maxPrice: 'Prix Max',
          sortBy: 'Trier par',
          priceLow: 'Prix: Croissant',
          priceHigh: 'Prix: Décroissant',
          beds: 'Lits (Plus)',
          area: 'Surface (Plus grand)',
          viewDetails: 'Voir détails',
          noListings: 'Aucune annonce trouvée.',
        },
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
