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
          // Navigation
          home: 'Home',
          listings: 'Listings',
          about: 'About Us',
          contact: 'Contact',
          getStarted: 'Get started',
          
          // Hero
          heroTitle: 'Discover your ideal luxury home in Dubai',
          heroSubtitle: 'Uncover a world of unique homes and unforgettable experiences',
          heroCta: 'Book today',
          
          // Content
          contentTitle: 'Extraordinary stays, curated for you.',
          contentSubtitle: "Whether you're planning a romantic getaway, a family vacation, or a business trip.",
          remoteWork: 'Remote Work',
          familyGetaways: 'Family Getaways',
          exploreListings: 'Explore Listings',
          
          // Listings
          featuredListings: 'Featured Listings',
          viewDetails: 'View Details',
          
          // Testimonials
          testimonialsTitle: 'What our clients say',
          testimonialQuote: 'Stayli made finding our dream home in Dubai an effortless and truly enjoyable experience. Highly recommended!',
          
          // Newsletter
          newsletterTitle: 'Stay updated',
          newsletterSubtitle: 'Subscribe to our newsletter for the latest luxury listings.',
          emailPlaceholder: 'Enter your email',
          subscribe: 'Subscribe',
        }
      },
      fr: {
        translation: {
          // Navigation
          home: 'Accueil',
          listings: 'Annonces',
          about: 'À propos',
          contact: 'Contact',
          getStarted: 'Commencer',
          
          // Hero
          heroTitle: 'Découvrez votre maison de luxe idéale à Dubai',
          heroSubtitle: 'Explorez un monde de maisons uniques et d\'expériences inoubliables',
          heroCta: 'Réserver',
          
          // Content
          contentTitle: 'Séjours extraordinaires, pour vous.',
          contentSubtitle: 'Que vous planifiiez une escapade romantique, des vacances en famille ou un voyage d\'affaires.',
          remoteWork: 'Télétravail',
          familyGetaways: 'Vacances Famille',
          exploreListings: 'Voir les annonces',
          
          // Listings
          featuredListings: 'Annonces Vedettes',
          viewDetails: 'Voir Détails',
          
          // Testimonials
          testimonialsTitle: 'Ce que disent nos clients',
          testimonialQuote: 'Stayli a rendu la recherche de notre maison de rêve à Dubai facile et agréable. Fortement recommandé!',
          
          // Newsletter
          newsletterTitle: 'Restez informé',
          newsletterSubtitle: 'Abonnez-vous pour les dernières annonces de luxe.',
          emailPlaceholder: 'Votre email',
          subscribe: 'S\'abonner',
        }
      }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
