import { companyInfo } from "../constants";
import { defaultTranslations } from "./translations";
import { seed } from "./seed";
import type { SiteContent } from "./types";

export const defaultContent: SiteContent = {
  schemaVersion: 1,
  settings: {
    name: companyInfo.name,
    brand: companyInfo.brand,
    whatsapp: companyInfo.whatsapp,
    email: companyInfo.email,
    location: companyInfo.location,
    social: companyInfo.social,
    logoMonochrome: true,
  },
  images: {
    logo: {
      url: "https://i.ibb.co/60PJ8PVw/aass.png",
      alt: { fr: "MoveSmart", en: "MoveSmart", ar: "MoveSmart" },
    },
    homeHero: {
      url: "https://images.pexels.com/photos/4531667/pexels-photo-4531667.jpeg",
      alt: { fr: "Vue de Dubaï", en: "Dubai skyline", ar: "أفق دبي" },
    },
    aboutHero: {
      url: "https://images.pexels.com/photos/29470806/pexels-photo-29470806.jpeg",
      alt: {
        fr: "Architecture de Dubaï",
        en: "Dubai architecture",
        ar: "عمارة دبي",
      },
    },
  },
  translations: defaultTranslations,
  ...seed,
  homeOrder: ["hero", "stats", "services", "why", "testimonials", "faq", "cta"],
  visibleSections: {
    hero: true,
    stats: true,
    services: true,
    why: true,
    testimonials: true,
    faq: true,
    cta: true,
  },
};
