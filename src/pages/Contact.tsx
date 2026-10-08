import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  ArrowRight,
  Check,
  Building2,
  Briefcase,
  Home,
  TrendingUp,
  Key,
  Globe,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSiteContent } from "../content/SiteContentProvider";
import { contactSchema, normalizePhone } from "../lib/forms";
import { submitContactRequest } from "../lib/submissions";
import { countryDisplayName } from "../lib/countries";
import { SiteLink } from "../components/SiteLink";

// ─── COUNTRY CODES ───
const COUNTRY_CODES = [
  { code: "+971", flag: "🇦🇪", country: "UAE", popular: true },
  { code: "+33", flag: "🇫🇷", country: "France", popular: true },
  { code: "+213", flag: "🇩🇿", country: "Algeria", popular: true },
  { code: "+1", flag: "🇺🇸", country: "USA", popular: true },
  { code: "+44", flag: "🇬🇧", country: "UK", popular: true },
  { code: "+49", flag: "🇩🇪", country: "Germany" },
  { code: "+39", flag: "🇮🇹", country: "Italy" },
  { code: "+34", flag: "🇪🇸", country: "Spain" },
  { code: "+212", flag: "🇲🇦", country: "Morocco" },
  { code: "+216", flag: "🇹🇳", country: "Tunisia" },
  { code: "+20", flag: "🇪🇬", country: "Egypt" },
  { code: "+966", flag: "🇸🇦", country: "Saudi Arabia" },
  { code: "+974", flag: "🇶🇦", country: "Qatar" },
  { code: "+973", flag: "🇧🇭", country: "Bahrain" },
  { code: "+968", flag: "🇴🇲", country: "Oman" },
  { code: "+965", flag: "🇰🇼", country: "Kuwait" },
  { code: "+41", flag: "🇨🇭", country: "Switzerland" },
  { code: "+32", flag: "🇧🇪", country: "Belgium" },
  { code: "+31", flag: "🇳🇱", country: "Netherlands" },
  { code: "+46", flag: "🇸🇪", country: "Sweden" },
  { code: "+86", flag: "🇨🇳", country: "China" },
  { code: "+91", flag: "🇮🇳", country: "India" },
  { code: "+7", flag: "🇷🇺", country: "Russia" },
];

// ─── SERVICE OPTIONS ───
const SERVICE_OPTIONS = {
  realEstate: {
    id: "real-estate",
    icon: Building2,
    labelKey: "contact_option_real_estate",
    subOptions: [
      { id: "rental-income", labelKey: "contact_option_rental_income" },
      {
        id: "capital-appreciation",
        labelKey: "contact_option_capital_appreciation",
      },
      { id: "flip", labelKey: "contact_option_flip" },
      { id: "primary-residence", labelKey: "contact_option_primary_residence" },
      { id: "golden-visa", labelKey: "contact_option_golden_visa" },
      { id: "off-plan", labelKey: "contact_option_off_plan" },
    ],
  },
  businessSetup: {
    id: "business-setup",
    icon: Briefcase,
    labelKey: "contact_option_business_setup",
    subOptions: [
      { id: "company-formation", labelKey: "contact_option_company_formation" },
      { id: "uae-residency", labelKey: "contact_option_uae_residency" },
      { id: "bank-account", labelKey: "contact_option_bank_account" },
      { id: "tax-optimization", labelKey: "contact_option_tax_optimization" },
      { id: "full-setup", labelKey: "contact_option_full_setup" },
    ],
  },
};

export default function Contact() {
  const { t } = useTranslation();
  const { content, previewRequested: preview, language } = useSiteContent();
  const countryCodes = useMemo(
    () =>
      COUNTRY_CODES.map((country) => ({
        ...country,
        country: countryDisplayName(country, language),
      })),
    [language],
  );
  const companyInfo = content.settings;

  // ─── FORM STATE ───
  const [step, setStep] = useState<"service" | "details">("service");
  const [selectedService, setSelectedService] = useState<
    "realEstate" | "businessSetup" | null
  >(null);
  const [selectedSubOptions, setSelectedSubOptions] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+971",
    phone: "",
    message: "",
    // Real Estate specific
    budget: "",
    propertyType: "",
    paymentPlan: "",
    investmentHorizon: "",
    // Business Setup specific
    activityType: "",
    currentCountry: "",
    numberOfVisas: "",
    companyType: "",
    bankingNeeds: "",
  });

  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [submitError, setSubmitError] = useState("");
  const submissionLock = useRef(false);
  const countryDropdown = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const outside = (event: MouseEvent) => {
      if (!countryDropdown.current?.contains(event.target as Node))
        setShowCountryDropdown(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowCountryDropdown(false);
    };
    document.addEventListener("click", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("click", outside);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  // ─── HANDLERS ───
  const handleServiceSelect = (service: "realEstate" | "businessSetup") => {
    if (selectedService === service) return;
    setSelectedService(service);
    setSelectedSubOptions([]);
  };

  const toggleSubOption = (optionId: string) => {
    setSelectedSubOptions((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId],
    );
  };

  const handleContinueToDetails = () => {
    if (selectedService && selectedSubOptions.length > 0) {
      setStep("details");
    }
  };

  const handleBack = () => {
    setStep("service");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submissionLock.current || preview) return;
    setSubmitError("");
    const details =
      selectedService === "realEstate"
        ? {
            budget: formData.budget,
            paymentPlan: formData.paymentPlan,
            investmentHorizon: formData.investmentHorizon,
          }
        : {
            activityType: formData.activityType,
            currentCountry: formData.currentCountry,
            numberOfVisas: formData.numberOfVisas,
            companyType: formData.companyType,
            bankingNeeds: formData.bankingNeeds,
          };
    const result = contactSchema.safeParse({
      name: formData.name,
      email: formData.email.trim(),
      phone: normalizePhone(formData.countryCode, formData.phone),
      service: selectedService,
      options: selectedSubOptions,
      details,
      message: formData.message,
      consent,
      website,
    });
    if (!result.success) {
      setSubmitError("contact_validation_error");
      return;
    }
    submissionLock.current = true;
    setLoading(true);
    try {
      await submitContactRequest(result.data);
      setSubmitted(true);
    } catch {
      setSubmitError("contact_submit_error");
    } finally {
      submissionLock.current = false;
      setLoading(false);
    }
  };

  const selectedCountry =
    countryCodes.find((c) => c.code === formData.countryCode) ||
    countryCodes[0];
  const popularCountries = countryCodes.filter((c) => c.popular);
  const otherCountries = countryCodes.filter((c) => !c.popular);

  if (submitted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center pt-32 pb-32 px-6"
        style={{ backgroundColor: "var(--bg)" }}
      >
        <div className="text-center max-w-2xl animate-fade-in">
          <div
            className="w-24 h-24 mx-auto mb-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--accent-bg)" }}
          >
            <Check
              className="w-12 h-12"
              style={{ color: "var(--accent)" }}
              strokeWidth={2.5}
            />
          </div>
          <h2
            className="text-5xl md:text-7xl font-serif tracking-tighter mb-6"
            style={{ color: "var(--text)" }}
          >
            {t("contact_merci")}
          </h2>
          <p className="text-xl mb-4" style={{ color: "var(--text3)" }}>
            {t("contact_votre_demande_a_ete_envoyee_avec_succes")}
          </p>
          <p className="text-lg mb-12" style={{ color: "var(--text3)" }}>
            {t("contact_un_conseiller_movesmart_vous_contactera_sous_24h")}
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setConsent(false);
              setSubmitError("");
              setWebsite("");
              setStep("service");
              setSelectedService(null);
              setSelectedSubOptions([]);
              setFormData({
                name: "",
                email: "",
                countryCode: "+971",
                phone: "",
                message: "",
                budget: "",
                propertyType: "",
                paymentPlan: "",
                investmentHorizon: "",
                activityType: "",
                currentCountry: "",
                numberOfVisas: "",
                companyType: "",
                bankingNeeds: "",
              });
            }}
            className="btn-outline"
          >
            {t("contact_nouvelle_demande")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-28 pb-20 md:pt-40 md:pb-40 overflow-x-hidden"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        {/* HEADER */}
        <div className="mb-12 md:mb-24 animate-fade-in">
          <span className="tag-gold">{t("contact_contact")}</span>
          <h1
            className="text-4xl md:text-[90px] font-serif tracking-tighter leading-[0.95] mb-8"
            style={{ color: "var(--text)" }}
          >
            {t("contact_parlons_de_votre")}
            <br />
            <span className="font-serif-italic text-accent">
              {t("contact_projet")}
            </span>
          </h1>
          <p
            className="text-xl font-light leading-[1.8] max-w-3xl"
            style={{ color: "var(--text3)" }}
          >
            {t("contact_que_vous_cherchiez_un_investissement_immobilier_")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 md:gap-20">
          {/* LEFT: CONTACT INFO */}
          <div className="space-y-12 animate-fade-in delay-100">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-5 md:p-8 border overflow-hiddentransition-all duration-300 group hover:border-accent"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                style={{ backgroundColor: "var(--accent-bg)" }}
              >
                <Phone
                  className="w-6 h-6"
                  style={{ color: "var(--accent)" }}
                  strokeWidth={1.5}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3"
                  style={{ color: "var(--text3)" }}
                >
                  WhatsApp
                </p>
                <p
                  className="text-2xl font-serif mb-2"
                  style={{ color: "var(--text)" }}
                >
                  {companyInfo.whatsapp}
                </p>
                <p className="text-sm" style={{ color: "var(--text3)" }}>
                  {t("contact_disponible_7j_7")}
                </p>
              </div>
              <ArrowRight
                className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: "var(--accent)" }}
              />
            </a>

            {/* Email */}
            <a
              href={`mailto:${encodeURIComponent(companyInfo.email)}`}
              className="flex items-start gap-6 p-8 border transition-all duration-300 group hover:border-accent"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                style={{ backgroundColor: "var(--accent-bg)" }}
              >
                <Mail
                  className="w-6 h-6"
                  style={{ color: "var(--accent)" }}
                  strokeWidth={1.5}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3"
                  style={{ color: "var(--text3)" }}
                >
                  Email
                </p>
                <p
                  className="text-base md:text-2xl font-serif mb-2 break-all min-w-0"
                  style={{ color: "var(--text)" }}
                >
                  {companyInfo.email}
                </p>
                <p className="text-sm" style={{ color: "var(--text3)" }}>
                  {t("contact_reponse_sous_24h")}
                </p>
              </div>
              <ArrowRight
                className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: "var(--accent)" }}
              />
            </a>

            {/* Location */}
            <div
              className="flex items-start gap-6 p-8 border"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "var(--accent-bg)" }}
              >
                <MapPin
                  className="w-6 h-6"
                  style={{ color: "var(--accent)" }}
                  strokeWidth={1.5}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3"
                  style={{ color: "var(--text3)" }}
                >
                  {t("contact_bureau")}
                </p>
                <p
                  className="text-2xl font-serif mb-2"
                  style={{ color: "var(--text)" }}
                >
                  {companyInfo.location}
                </p>
                <p className="text-sm" style={{ color: "var(--text3)" }}>
                  {t("contact_rendez_vous_sur_demande")}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: DYNAMIC FORM */}
          <div className="animate-fade-in delay-200">
            <div
              className="p-4 md:p-12 border"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              {/* STEP 1: SERVICE SELECTION */}
              {step === "service" && (
                <div className="space-y-10">
                  <div>
                    <h3
                      className="text-3xl font-serif mb-4"
                      style={{ color: "var(--text)" }}
                    >
                      {t("contact_quel_service_recherchez_vous")}
                    </h3>
                    <p className="text-sm" style={{ color: "var(--text3)" }}>
                      {t("contact_selectionnez_une_ou_plusieurs_options")}
                    </p>
                  </div>

                  {/* Service Categories */}
                  <div className="space-y-6">
                    {Object.entries(SERVICE_OPTIONS).map(([key, service]) => {
                      const Icon = service.icon;
                      const isSelected = selectedService === key;
                      const label = t(service.labelKey);

                      return (
                        <div key={key}>
                          <button
                            type="button"
                            onClick={() => handleServiceSelect(key as any)}
                            className="w-full p-6 border transition-all duration-200 flex items-center gap-4 group text-left relative z-10"
                            style={{
                              backgroundColor: isSelected
                                ? "var(--accent-bg)"
                                : "transparent",
                              borderColor: isSelected
                                ? "var(--accent)"
                                : "var(--border)",
                              cursor: "pointer",
                              WebkitTapHighlightColor: "transparent" as any,
                              touchAction: "manipulation",
                            }}
                          >
                            <div
                              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                              style={{
                                backgroundColor: isSelected
                                  ? "var(--accent)"
                                  : "var(--accent-bg)",
                                color: isSelected ? "black" : "var(--accent)",
                              }}
                            >
                              <Icon className="w-6 h-6" strokeWidth={1.5} />
                            </div>
                            <span
                              className="text-lg font-semibold"
                              style={{
                                color: isSelected
                                  ? "var(--accent)"
                                  : "var(--text)",
                              }}
                            >
                              {label}
                            </span>
                          </button>
                          {/* Sub-options */}
                          {isSelected && (
                            <div className="mt-4 ml-6 space-y-2 animate-fade-in">
                              {service.subOptions.map((sub) => {
                                const subSelected = selectedSubOptions.includes(
                                  sub.id,
                                );
                                const subLabel = t(sub.labelKey);

                                return (
                                  <button
                                    type="button"
                                    key={sub.id}
                                    onClick={() => toggleSubOption(sub.id)}
                                    className="w-full p-4 border transition-all duration-200 flex items-center gap-3 text-left relative z-10"
                                    style={{
                                      backgroundColor: subSelected
                                        ? "var(--accent-bg)"
                                        : "transparent",
                                      borderColor: subSelected
                                        ? "var(--accent)"
                                        : "var(--border)",
                                      cursor: "pointer",
                                      WebkitTapHighlightColor:
                                        "transparent" as any,
                                      touchAction: "manipulation",
                                    }}
                                  >
                                    <div
                                      className="w-5 h-5 rounded border flex items-center justify-center flex-shrink-0"
                                      style={{
                                        borderColor: subSelected
                                          ? "var(--accent)"
                                          : "var(--border)",
                                        backgroundColor: subSelected
                                          ? "var(--accent)"
                                          : "transparent",
                                      }}
                                    >
                                      {subSelected && (
                                        <Check
                                          className="w-3 h-3 text-black"
                                          strokeWidth={3}
                                        />
                                      )}
                                    </div>
                                    <span
                                      className="text-sm"
                                      style={{
                                        color: subSelected
                                          ? "var(--accent)"
                                          : "var(--text)",
                                      }}
                                    >
                                      {subLabel}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Continue Button */}
                  <button
                    onClick={handleContinueToDetails}
                    disabled={
                      !selectedService || selectedSubOptions.length === 0
                    }
                    className="w-full btn-gold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t("contact_continuer")}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              )}

              {/* STEP 2: DETAILS FORM */}
              {step === "details" && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <fieldset disabled={loading || preview} className="space-y-6">
                    {/* Back Button */}
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-2 mb-8 transition-colors"
                      style={{ color: "var(--text3)" }}
                    >
                      <ArrowRight className="w-4 h-4 rotate-180" />
                      {t("contact_retour")}
                    </button>

                    <div>
                      <h3
                        className="text-3xl font-serif mb-2"
                        style={{ color: "var(--text)" }}
                      >
                        {t("contact_vos_coordonnees")}
                      </h3>
                      <p
                        className="text-sm mb-8"
                        style={{ color: "var(--text3)" }}
                      >
                        {t(
                          "contact_un_conseiller_movesmart_vous_contactera_sous_24h",
                        )}
                      </p>
                    </div>

                    {/* Name */}
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3"
                        style={{ color: "var(--text3)" }}
                      >
                        {t("contact_nom_complet")}
                      </label>
                      <input
                        id="contact-name"
                        maxLength={150}
                        autoComplete="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full border px-6 py-4 text-sm focus:outline-none focus:border-accent transition-all"
                        style={{
                          backgroundColor: "var(--bg)",
                          borderColor: "var(--border)",
                          color: "var(--text)",
                        }}
                        placeholder={t("contact_john_doe")}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3"
                        style={{ color: "var(--text3)" }}
                      >
                        {t("contact_email")}
                      </label>
                      <input
                        id="contact-email"
                        maxLength={254}
                        autoComplete="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="w-full border px-6 py-4 text-sm focus:outline-none focus:border-accent transition-all"
                        style={{
                          backgroundColor: "var(--bg)",
                          borderColor: "var(--border)",
                          color: "var(--text)",
                        }}
                        placeholder="contact@example.com"
                      />
                    </div>

                    {/* Phone with Country Code */}
                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3"
                        style={{ color: "var(--text3)" }}
                      >
                        {t("contact_telephone_whatsapp")}
                      </label>
                      <div className="flex gap-3">
                        {/* Country Code Dropdown */}
                        <div className="relative" ref={countryDropdown}>
                          <button
                            aria-expanded={showCountryDropdown}
                            aria-controls="country-codes"
                            type="button"
                            onClick={() =>
                              setShowCountryDropdown(!showCountryDropdown)
                            }
                            className="h-full px-4 border flex items-center gap-2 transition-all hover:border-accent"
                            style={{
                              backgroundColor: "var(--bg)",
                              borderColor: "var(--border)",
                              color: "var(--text)",
                            }}
                          >
                            <span className="text-xl">
                              {selectedCountry.flag}
                            </span>
                            <span className="text-sm font-medium" dir="ltr">
                              {selectedCountry.code}
                            </span>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>

                          {showCountryDropdown && (
                            <div
                              id="country-codes"
                              className="absolute top-full start-0 mt-2 border shadow-2xl z-50 max-h-80 overflow-y-auto max-w-[calc(100vw-4rem)]"
                              style={{
                                backgroundColor: "var(--surface)",
                                borderColor: "var(--border)",
                                width: "280px",
                              }}
                            >
                              {/* Popular */}
                              <div
                                className="p-2 text-[9px] font-bold uppercase tracking-widest"
                                style={{
                                  color: "var(--text3)",
                                  backgroundColor: "var(--accent-bg)",
                                }}
                              >
                                {t("contact_populaires")}
                              </div>
                              {popularCountries.map((country) => (
                                <button
                                  key={country.code}
                                  type="button"
                                  onClick={() => {
                                    setFormData((prev) => ({
                                      ...prev,
                                      countryCode: country.code,
                                    }));
                                    setShowCountryDropdown(false);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent/10 transition-colors"
                                >
                                  <span className="text-xl">
                                    {country.flag}
                                  </span>
                                  <span
                                    className="text-sm font-medium flex-1"
                                    style={{ color: "var(--text)" }}
                                  >
                                    {country.country}
                                  </span>
                                  <span
                                    className="text-sm"
                                    style={{ color: "var(--text3)" }}
                                    dir="ltr"
                                  >
                                    {country.code}
                                  </span>
                                </button>
                              ))}

                              {/* Divider */}
                              <div
                                className="border-t my-2"
                                style={{ borderColor: "var(--border)" }}
                              ></div>

                              {/* All Others */}
                              <div
                                className="p-2 text-[9px] font-bold uppercase tracking-widest"
                                style={{
                                  color: "var(--text3)",
                                  backgroundColor: "var(--accent-bg)",
                                }}
                              >
                                {t("contact_tous_les_pays")}
                              </div>
                              {otherCountries.map((country) => (
                                <button
                                  key={country.code}
                                  type="button"
                                  onClick={() => {
                                    setFormData((prev) => ({
                                      ...prev,
                                      countryCode: country.code,
                                    }));
                                    setShowCountryDropdown(false);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent/10 transition-colors"
                                >
                                  <span className="text-xl">
                                    {country.flag}
                                  </span>
                                  <span
                                    className="text-sm font-medium flex-1"
                                    style={{ color: "var(--text)" }}
                                  >
                                    {country.country}
                                  </span>
                                  <span
                                    className="text-sm"
                                    style={{ color: "var(--text3)" }}
                                    dir="ltr"
                                  >
                                    {country.code}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Phone Input */}
                        <input
                          id="contact-phone"
                          maxLength={30}
                          autoComplete="tel-national"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          className="flex-1 min-w-0 border px-4 py-4 text-sm focus:outline-none focus:border-accent transition-all"
                          style={{
                            backgroundColor: "var(--bg)",
                            borderColor: "var(--border)",
                            color: "var(--text)",
                          }}
                          placeholder="123456789"
                        />
                      </div>
                    </div>

                    {/* DYNAMIC FIELDS BASED ON SERVICE */}
                    {selectedService === "realEstate" && (
                      <>
                        {/* Budget */}
                        <div>
                          <label
                            htmlFor="contact-budget"
                            className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3"
                            style={{ color: "var(--text3)" }}
                          >
                            {t("contact_budget_details")}
                          </label>
                          <textarea
                            id="contact-budget"
                            maxLength={5000}
                            rows={4}
                            value={formData.budget}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                budget: e.target.value,
                              }))
                            }
                            className="w-full border px-6 py-4 text-sm focus:outline-none focus:border-accent transition-all resize-none"
                            style={{
                              backgroundColor: "var(--bg)",
                              borderColor: "var(--border)",
                              color: "var(--text)",
                            }}
                            placeholder={t(
                              "contact_budget_estime_objectif_d_investissement_type_de_",
                            )}
                          />
                        </div>

                        {/* Payment Plan */}
                        <div>
                          <label
                            htmlFor="contact-paymentPlan"
                            className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3"
                            style={{ color: "var(--text3)" }}
                          >
                            {t("contact_paiement")}
                          </label>
                          <select
                            id="contact-paymentPlan"
                            value={formData.paymentPlan}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                paymentPlan: e.target.value,
                              }))
                            }
                            className="w-full border px-6 py-4 text-sm focus:outline-none focus:border-accent transition-all"
                            style={{
                              backgroundColor: "var(--bg)",
                              borderColor: "var(--border)",
                              color: "var(--text)",
                            }}
                          >
                            <option value="">
                              {t("contact_selectionner")}
                            </option>
                            <option value="cash">
                              {t("contact_paiement_comptant")}
                            </option>
                            <option value="payment-plan">
                              {t("contact_plan_de_paiement")}
                            </option>
                            <option value="flexible">
                              {t("contact_flexible_a_discuter")}
                            </option>
                          </select>
                        </div>

                        {/* Investment Horizon */}
                        <div>
                          <label
                            htmlFor="contact-investmentHorizon"
                            className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3"
                            style={{ color: "var(--text3)" }}
                          >
                            {t("contact_horizon_d_investissement")}
                          </label>
                          <select
                            id="contact-investmentHorizon"
                            value={formData.investmentHorizon}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                investmentHorizon: e.target.value,
                              }))
                            }
                            className="w-full border px-6 py-4 text-sm focus:outline-none focus:border-accent transition-all"
                            style={{
                              backgroundColor: "var(--bg)",
                              borderColor: "var(--border)",
                              color: "var(--text)",
                            }}
                          >
                            <option value="">
                              {t("contact_selectionner")}
                            </option>
                            <option value="short-term">
                              {t("contact_court_terme_1_3_ans")}
                            </option>
                            <option value="medium-term">
                              {t("contact_moyen_terme_3_7_ans")}
                            </option>
                            <option value="long-term">
                              {t("contact_long_terme_7_ans")}
                            </option>
                          </select>
                        </div>
                      </>
                    )}

                    {selectedService === "businessSetup" && (
                      <>
                        {/* Activity Type */}
                        <div>
                          <label
                            htmlFor="contact-activityType"
                            className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3"
                            style={{ color: "var(--text3)" }}
                          >
                            {t("contact_type_d_activite")}
                          </label>
                          <input
                            id="contact-activityType"
                            type="text"
                            value={formData.activityType}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                activityType: e.target.value,
                              }))
                            }
                            className="w-full border px-6 py-4 text-sm focus:outline-none focus:border-accent transition-all"
                            style={{
                              backgroundColor: "var(--bg)",
                              borderColor: "var(--border)",
                              color: "var(--text)",
                            }}
                            placeholder={t(
                              "contact_e_commerce_consulting_trading_etc",
                            )}
                          />
                        </div>

                        {/* Current Country */}
                        <div>
                          <label
                            htmlFor="contact-currentCountry"
                            className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3"
                            style={{ color: "var(--text3)" }}
                          >
                            {t("contact_pays_de_residence_actuel")}
                          </label>
                          <input
                            id="contact-currentCountry"
                            type="text"
                            value={formData.currentCountry}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                currentCountry: e.target.value,
                              }))
                            }
                            className="w-full border px-6 py-4 text-sm focus:outline-none focus:border-accent transition-all"
                            style={{
                              backgroundColor: "var(--bg)",
                              borderColor: "var(--border)",
                              color: "var(--text)",
                            }}
                            placeholder={t("contact_france_algerie_etc")}
                          />
                        </div>

                        {/* Number of Visas */}
                        <div>
                          <label
                            htmlFor="contact-numberOfVisas"
                            className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3"
                            style={{ color: "var(--text3)" }}
                          >
                            {t("contact_nombre_de_visas_souhaites")}
                          </label>
                          <input
                            id="contact-numberOfVisas"
                            type="number"
                            min="1"
                            value={formData.numberOfVisas}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                numberOfVisas: e.target.value,
                              }))
                            }
                            className="w-full border px-6 py-4 text-sm focus:outline-none focus:border-accent transition-all"
                            style={{
                              backgroundColor: "var(--bg)",
                              borderColor: "var(--border)",
                              color: "var(--text)",
                            }}
                            placeholder="1, 2, 3…"
                          />
                        </div>

                        {/* Company Type */}
                        <div>
                          <label
                            htmlFor="contact-companyType"
                            className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3"
                            style={{ color: "var(--text3)" }}
                          >
                            {t("contact_type_de_societe")}
                          </label>
                          <select
                            id="contact-companyType"
                            value={formData.companyType}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                companyType: e.target.value,
                              }))
                            }
                            className="w-full border px-6 py-4 text-sm focus:outline-none focus:border-accent transition-all"
                            style={{
                              backgroundColor: "var(--bg)",
                              borderColor: "var(--border)",
                              color: "var(--text)",
                            }}
                          >
                            <option value="">
                              {t("contact_selectionner")}
                            </option>
                            <option value="freezone">Free Zone</option>
                            <option value="mainland">
                              {t("contact_mainland")}
                            </option>
                            <option value="offshore">
                              {t("contact_offshore")}
                            </option>
                            <option value="undecided">
                              {t("contact_non_decide_besoin_de_conseil")}
                            </option>
                          </select>
                        </div>

                        {/* Banking Needs */}
                        <div>
                          <label
                            htmlFor="contact-bankingNeeds"
                            className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3"
                            style={{ color: "var(--text3)" }}
                          >
                            {t("contact_besoins_bancaires")}
                          </label>
                          <select
                            id="contact-bankingNeeds"
                            value={formData.bankingNeeds}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                bankingNeeds: e.target.value,
                              }))
                            }
                            className="w-full border px-6 py-4 text-sm focus:outline-none focus:border-accent transition-all"
                            style={{
                              backgroundColor: "var(--bg)",
                              borderColor: "var(--border)",
                              color: "var(--text)",
                            }}
                          >
                            <option value="">
                              {t("contact_selectionner")}
                            </option>
                            <option value="business-account">
                              {t("contact_compte_professionnel_uniquement")}
                            </option>
                            <option value="personal-account">
                              {t("contact_compte_personnel_uniquement")}
                            </option>
                            <option value="both">
                              {t("contact_les_deux")}
                            </option>
                            <option value="none">
                              {t("contact_aucun_besoin_bancaire")}
                            </option>
                          </select>
                        </div>
                      </>
                    )}

                    {/* Additional Message */}
                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3"
                        style={{ color: "var(--text3)" }}
                      >
                        {t("contact_message_additionnel_optionnel")}
                      </label>
                      <textarea
                        id="contact-message"
                        maxLength={5000}
                        rows={4}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            message: e.target.value,
                          }))
                        }
                        className="w-full border px-6 py-4 text-sm focus:outline-none focus:border-accent transition-all resize-none"
                        style={{
                          backgroundColor: "var(--bg)",
                          borderColor: "var(--border)",
                          color: "var(--text)",
                        }}
                        placeholder={t(
                          "contact_precisions_questions_contraintes_specifiques",
                        )}
                      />
                    </div>

                    {/* Reassurance Message */}
                    <div
                      className="p-4 border"
                      style={{
                        backgroundColor: "var(--accent-bg)",
                        borderColor: "var(--accent)",
                      }}
                    >
                      <p
                        className="text-sm font-medium text-center"
                        style={{ color: "var(--accent)" }}
                      >
                        {t(
                          "contact_un_conseiller_movesmart_vous_contactera_sous_24h_86",
                        )}
                      </p>
                    </div>

                    <label
                      className="flex items-start gap-3 text-xs leading-relaxed"
                      style={{ color: "var(--text3)" }}
                    >
                      <input
                        type="checkbox"
                        required
                        checked={consent}
                        onChange={(event) => setConsent(event.target.checked)}
                        className="mt-1 accent-[var(--accent)]"
                      />
                      <span>
                        {t("contact_consent")}{" "}
                        <SiteLink to="/privacy" className="underline">
                          {t("privacy_link")}
                        </SiteLink>
                      </span>
                    </label>
                    <label className="honeypot" aria-hidden="true">
                      Website
                      <input
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={website}
                        onChange={(event) => setWebsite(event.target.value)}
                      />
                    </label>
                  </fieldset>
                  {submitError && (
                    <p role="alert" className="text-sm text-red-400">
                      {t(submitError)}
                    </p>
                  )}
                  {preview && (
                    <p className="text-xs text-accent">
                      {t("preview_forms_disabled")}
                    </p>
                  )}
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || preview}
                    className="w-full btn-gold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-3">
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        {t("contact_envoi_en_cours")}
                      </span>
                    ) : (
                      <>
                        {t("contact_etre_contacte")}
                        <Send className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
