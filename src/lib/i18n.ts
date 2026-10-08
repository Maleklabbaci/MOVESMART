import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { defaultTranslations } from "../content/translations";
import { normalizeLanguage } from "../content/utils";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: Object.fromEntries(
      Object.entries(defaultTranslations).map(([language, translation]) => [
        language,
        { translation },
      ]),
    ),
    supportedLngs: ["fr", "en", "ar"],
    fallbackLng: "fr",
    load: "languageOnly",
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      convertDetectedLanguage: normalizeLanguage,
    },
    interpolation: { escapeValue: false },
    react: {
      bindI18n: "languageChanged loaded",
      bindI18nStore: "added removed",
    },
  });
export default i18n;
