import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, ArrowRight, Check, Building2, Briefcase, Home, TrendingUp, Key, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { companyInfo } from '../constants';

// ─── COUNTRY CODES ───
const COUNTRY_CODES = [
  { code: '+971', flag: '🇦🇪', country: 'UAE', popular: true },
  { code: '+33', flag: '🇫🇷', country: 'France', popular: true },
  { code: '+213', flag: '🇩🇿', country: 'Algeria', popular: true },
  { code: '+1', flag: '🇺🇸', country: 'USA', popular: true },
  { code: '+44', flag: '🇬🇧', country: 'UK', popular: true },
  { code: '+49', flag: '🇩🇪', country: 'Germany' },
  { code: '+39', flag: '🇮🇹', country: 'Italy' },
  { code: '+34', flag: '🇪🇸', country: 'Spain' },
  { code: '+212', flag: '🇲🇦', country: 'Morocco' },
  { code: '+216', flag: '🇹🇳', country: 'Tunisia' },
  { code: '+20', flag: '🇪🇬', country: 'Egypt' },
  { code: '+966', flag: '🇸🇦', country: 'Saudi Arabia' },
  { code: '+974', flag: '🇶🇦', country: 'Qatar' },
  { code: '+973', flag: '🇧🇭', country: 'Bahrain' },
  { code: '+968', flag: '🇴🇲', country: 'Oman' },
  { code: '+965', flag: '🇰🇼', country: 'Kuwait' },
  { code: '+41', flag: '🇨🇭', country: 'Switzerland' },
  { code: '+32', flag: '🇧🇪', country: 'Belgium' },
  { code: '+31', flag: '🇳🇱', country: 'Netherlands' },
  { code: '+46', flag: '🇸🇪', country: 'Sweden' },
  { code: '+86', flag: '🇨🇳', country: 'China' },
  { code: '+91', flag: '🇮🇳', country: 'India' },
  { code: '+7', flag: '🇷🇺', country: 'Russia' },
];

// ─── SERVICE OPTIONS ───
const SERVICE_OPTIONS = {
  realEstate: {
    id: 'real-estate',
    icon: Building2,
    labelFr: 'Real Estate & Investment',
    labelEn: 'Real Estate & Investment',
    labelAr: 'العقارات والاستثمار',
    subOptions: [
      { id: 'rental-income', labelFr: 'Rental Income', labelEn: 'Rental Income', labelAr: 'دخل إيجاري' },
      { id: 'capital-appreciation', labelFr: 'Capital Appreciation', labelEn: 'Capital Appreciation', labelAr: 'ارتفاع رأس المال' },
      { id: 'flip', labelFr: 'Buy & Resell (Flip)', labelEn: 'Buy & Resell (Flip)', labelAr: 'شراء وإعادة البيع' },
      { id: 'primary-residence', labelFr: 'Primary Residence', labelEn: 'Primary Residence', labelAr: 'إقامة أساسية' },
      { id: 'golden-visa', labelFr: 'Golden Visa Through Property', labelEn: 'Golden Visa Through Property', labelAr: 'التأشيرة الذهبية عبر العقار' },
      { id: 'off-plan', labelFr: 'Off-plan Investment', labelEn: 'Off-plan Investment', labelAr: 'استثمار على الخريطة' },
    ]
  },
  businessSetup: {
    id: 'business-setup',
    icon: Briefcase,
    labelFr: 'Business Setup & Relocation',
    labelEn: 'Business Setup & Relocation',
    labelAr: 'إنشاء الشركات والانتقال',
    subOptions: [
      { id: 'company-formation', labelFr: 'Company Formation', labelEn: 'Company Formation', labelAr: 'تأسيس الشركة' },
      { id: 'uae-residency', labelFr: 'UAE Residency Visa', labelEn: 'UAE Residency Visa', labelAr: 'تأشيرة إقامة الإمارات' },
      { id: 'bank-account', labelFr: 'Bank Account Opening', labelEn: 'Bank Account Opening', labelAr: 'فتح حساب بنكي' },
      { id: 'tax-optimization', labelFr: 'Tax Optimization / Structuring', labelEn: 'Tax Optimization / Structuring', labelAr: 'تحسين الضرائب' },
      { id: 'full-setup', labelFr: 'Full UAE Setup', labelEn: 'Full UAE Setup', labelAr: 'إعداد كامل للإمارات' },
    ]
  }
};

export default function Contact() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  // ─── FORM STATE ───
  const [step, setStep] = useState<'service' | 'details'>('service');
  const [selectedService, setSelectedService] = useState<'realEstate' | 'businessSetup' | null>(null);
  const [selectedSubOptions, setSelectedSubOptions] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+971',
    phone: '',
    message: '',
    // Real Estate specific
    budget: '',
    propertyType: '',
    paymentPlan: '',
    investmentHorizon: '',
    // Business Setup specific
    activityType: '',
    currentCountry: '',
    numberOfVisas: '',
    companyType: '',
    bankingNeeds: '',
  });

  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // ─── HANDLERS ───
  const handleServiceSelect = (service: 'realEstate' | 'businessSetup') => {
    setSelectedService(service);
    setSelectedSubOptions([]);
  };

  const toggleSubOption = (optionId: string) => {
    setSelectedSubOptions(prev =>
      prev.includes(optionId) ? prev.filter(id => id !== optionId) : [...prev, optionId]
    );
  };

  const handleContinueToDetails = () => {
    if (selectedService && selectedSubOptions.length > 0) {
      setStep('details');
    }
  };

  const handleBack = () => {
    setStep('service');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const selectedCountry = COUNTRY_CODES.find(c => c.code === formData.countryCode) || COUNTRY_CODES[0];
  const popularCountries = COUNTRY_CODES.filter(c => c.popular);
  const otherCountries = COUNTRY_CODES.filter(c => !c.popular);

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32 pb-32 px-6" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="text-center max-w-2xl animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent-bg)' }}>
            <Check className="w-12 h-12" style={{ color: 'var(--accent)' }} strokeWidth={2.5} />
          </div>
          <h2 className="text-5xl md:text-7xl font-serif tracking-tighter mb-6" style={{ color: 'var(--text)' }}>
            {lang === 'fr' ? 'Merci!' : lang === 'ar' ? 'شكراً!' : 'Thank you!'}
          </h2>
          <p className="text-xl mb-4" style={{ color: 'var(--text3)' }}>
            {lang === 'fr' 
              ? 'Votre demande a été envoyée avec succès.'
              : lang === 'ar'
              ? 'تم إرسال طلبك بنجاح.'
              : 'Your request has been sent successfully.'
            }
          </p>
          <p className="text-lg mb-12" style={{ color: 'var(--text3)' }}>
            {lang === 'fr'
              ? 'Un conseiller MoveSmart vous contactera sous 24h.'
              : lang === 'ar'
              ? 'سيتصل بك مستشار MoveSmart خلال 24 ساعة.'
              : 'A MoveSmart advisor will contact you within 24 hours.'
            }
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setStep('service');
              setSelectedService(null);
              setSelectedSubOptions([]);
              setFormData({
                name: '', email: '', countryCode: '+971', phone: '', message: '',
                budget: '', propertyType: '', paymentPlan: '', investmentHorizon: '',
                activityType: '', currentCountry: '', numberOfVisas: '', companyType: '', bankingNeeds: '',
              });
            }}
            className="btn-outline"
          >
            {lang === 'fr' ? 'Nouvelle demande' : lang === 'ar' ? 'طلب جديد' : 'New request'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-40 pb-40" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* HEADER */}
        <div className="mb-24 animate-fade-in">
          <span className="tag-gold">
            {lang === 'fr' ? 'Contact' : lang === 'ar' ? 'اتصل بنا' : 'Contact'}
<span className="tag-gold">
  {lang === 'fr' ? 'Contact' : lang === 'ar' ? 'اتصل بنا' : 'Contact'}
</span>
<h1 className="text-6xl md:text-[90px] font-serif tracking-tighter leading-[0.95] mb-8" style={{ color: 'var(--text)' }}>
  {lang === 'fr' ? 'Parlons de votre' : lang === 'ar' ? 'لنتحدث عن' : "Let's talk about your"}<br/>
  <span className="font-serif-italic text-accent">
    {lang === 'fr' ? 'projet.' : lang === 'ar' ? 'مشروعك.' : 'project.'}
  </span>
</h1>          <p className="text-xl font-light leading-[1.8] max-w-3xl" style={{ color: 'var(--text3)' }}>
            {lang === 'fr'
              ? 'Que vous cherchiez un investissement immobilier à fort rendement ou que vous souhaitiez créer votre entreprise à Dubaï, notre équipe d\'experts vous accompagne à chaque étape.'
              : lang === 'ar'
              ? 'سواء كنت تبحث عن استثمار عقاري عالي العائد أو ترغب في إنشاء عملك في دبي، فريق خبرائنا يرافقك في كل خطوة.'
              : 'Whether you're looking for a high-yield real estate investment or want to set up your business in Dubai, our team of experts supports you at every step.'
            }
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-20">
          
          {/* LEFT: CONTACT INFO */}
          <div className="space-y-12 animate-fade-in delay-100">
            
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${companyInfo.whatsapp.replace(/\s/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-6 p-8 border transition-all duration-300 group hover:border-accent"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all" style={{ backgroundColor: 'var(--accent-bg)' }}>
                <Phone className="w-6 h-6" style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--text3)' }}>WhatsApp</p>
                <p className="text-2xl font-serif mb-2" style={{ color: 'var(--text)' }}>{companyInfo.whatsapp}</p>
                <p className="text-sm" style={{ color: 'var(--text3)' }}>
                  {lang === 'fr' ? 'Disponible 7j/7' : lang === 'ar' ? 'متاح 7 أيام في الأسبوع' : 'Available 7 days a week'}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }} />
            </a>

            {/* Email */}
            <a
              href={`mailto:${companyInfo.email}`}
              className="flex items-start gap-6 p-8 border transition-all duration-300 group hover:border-accent"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all" style={{ backgroundColor: 'var(--accent-bg)' }}>
                <Mail className="w-6 h-6" style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--text3)' }}>Email</p>
                <p className="text-2xl font-serif mb-2" style={{ color: 'var(--text)' }}>{companyInfo.email}</p>
                <p className="text-sm" style={{ color: 'var(--text3)' }}>
                  {lang === 'fr' ? 'Réponse sous 24h' : lang === 'ar' ? 'رد خلال 24 ساعة' : 'Response within 24h'}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }} />
            </a>

            {/* Location */}
            <div className="flex items-start gap-6 p-8 border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--accent-bg)' }}>
                <MapPin className="w-6 h-6" style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--text3)' }}>
                  {lang === 'fr' ? 'Bureau' : lang === 'ar' ? 'المكتب' : 'Office'}
                </p>
                <p className="text-2xl font-serif mb-2" style={{ color: 'var(--text)' }}>{companyInfo.location}</p>
                <p className="text-sm" style={{ color: 'var(--text3)' }}>
                  {lang === 'fr' ? 'Rendez-vous sur demande' : lang === 'ar' ? 'مواعيد عند الطلب' : 'Appointments upon request'}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: DYNAMIC FORM */}
          <div className="animate-fade-in delay-200">
            <div className="p-12 border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              
              {/* STEP 1: SERVICE SELECTION */}
              {step === 'service' && (
                <div className="space-y-10">
                  <div>
                    <h3 className="text-3xl font-serif mb-4" style={{ color: 'var(--text)' }}>
                      {lang === 'fr' ? 'Quel service recherchez-vous ?' : lang === 'ar' ? 'ما الخدمة التي تبحث عنها؟' : 'What service are you looking for?'}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text3)' }}>
                      {lang === 'fr' ? 'Sélectionnez une ou plusieurs options' : lang === 'ar' ? 'اختر خيارًا واحدًا أو أكثر' : 'Select one or more options'}
                    </p>
                  </div>

                  {/* Service Categories */}
                  <div className="space-y-6">
                    {Object.entries(SERVICE_OPTIONS).map(([key, service]) => {
                      const Icon = service.icon;
                      const isSelected = selectedService === key;
                      const label = lang === 'fr' ? service.labelFr : lang === 'ar' ? service.labelAr : service.labelEn;

                      return (
                        <div key={key}>
                          <button
                            onClick={() => handleServiceSelect(key as any)}
                            className="w-full p-6 border transition-all duration-200 flex items-center gap-4 group text-left"
                            style={{
                              backgroundColor: isSelected ? 'var(--accent-bg)' : 'transparent',
                              borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
                            }}
                          >
                            <div
                              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                              style={{
                                backgroundColor: isSelected ? 'var(--accent)' : 'var(--accent-bg)',
                                color: isSelected ? 'black' : 'var(--accent)',
                              }}
                            >
                              <Icon className="w-6 h-6" strokeWidth={1.5} />
                            </div>
                            <span className="text-lg font-semibold" style={{ color: isSelected ? 'var(--accent)' : 'var(--text)' }}>
                              {label}
                            </span>
                          </button>

                          {/* Sub-options */}
                          {isSelected && (
                            <div className="mt-4 ml-6 space-y-2 animate-fade-in">
                              {service.subOptions.map(sub => {
                                const subSelected = selectedSubOptions.includes(sub.id);
                                const subLabel = lang === 'fr' ? sub.labelFr : lang === 'ar' ? sub.labelAr : sub.labelEn;
                                
                                return (
                                  <button
                                    key={sub.id}
                                    onClick={() => toggleSubOption(sub.id)}
                                    className="w-full p-4 border transition-all duration-200 flex items-center gap-3 text-left"
                                    style={{
                                      backgroundColor: subSelected ? 'var(--accent-bg)' : 'transparent',
                                      borderColor: subSelected ? 'var(--accent)' : 'var(--border)',
                                    }}
                                  >
                                    <div
                                      className="w-5 h-5 rounded border flex items-center justify-center flex-shrink-0"
                                      style={{
                                        borderColor: subSelected ? 'var(--accent)' : 'var(--border)',
                                        backgroundColor: subSelected ? 'var(--accent)' : 'transparent',
                                      }}
                                    >
                                      {subSelected && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
                                    </div>
                                    <span className="text-sm" style={{ color: subSelected ? 'var(--accent)' : 'var(--text)' }}>
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
                    disabled={!selectedService || selectedSubOptions.length === 0}
                    className="w-full btn-gold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {lang === 'fr' ? 'Continuer' : lang === 'ar' ? 'متابعة' : 'Continue'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              )}

              {/* STEP 2: DETAILS FORM */}
              {step === 'details' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Back Button */}
                  <button
                    type="button"
                    onClick={handleBack}
                    className="text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-2 mb-8 transition-colors"
                    style={{ color: 'var(--text3)' }}
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    {lang === 'fr' ? 'Retour' : lang === 'ar' ? 'رجوع' : 'Back'}
                  </button>

                  <div>
                    <h3 className="text-3xl font-serif mb-2" style={{ color: 'var(--text)' }}>
                      {lang === 'fr' ? 'Vos coordonnées' : lang === 'ar' ? 'معلومات الاتصال الخاصة بك' : 'Your contact details'}
                    </h3>
                    <p className="text-sm mb-8" style={{ color: 'var(--text3)' }}>
                      {lang === 'fr'
                        ? 'Un conseiller MoveSmart vous contactera sous 24h.'
                        : lang === 'ar'
                        ? 'سيتصل بك مستشار MoveSmart خلال 24 ساعة.'
                        : 'A MoveSmart advisor will contact you within 24 hours.'
                      }
                    </p>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--text3)' }}>
                      {lang === 'fr' ? 'Nom complet' : lang === 'ar' ? 'الاسم الكامل' : 'Full name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full border px-6 py-4 text-sm focus:outline-none focus:border-accent transition-all"
                      style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                      placeholder={lang === 'fr' ? 'John Doe' : lang === 'ar' ? 'جون دو' : 'John Doe'}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--text3)' }}>Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full border px-6 py-4 text-sm focus:outline-none focus:border-accent transition-all"
                      style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                      placeholder="contact@example.com"
                    />
                  </div>

                  {/* Phone with Country Code */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--text3)' }}>
                      {lang === 'fr' ? 'Téléphone / WhatsApp' : lang === 'ar' ? 'الهاتف / واتساب' : 'Phone / WhatsApp'}
                    </label>
                    <div className="flex gap-3">
                      {/* Country Code Dropdown */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                          className="h-full px-4 border flex items-center gap-2 transition-all hover:border-accent"
                          style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                        >
                          <span className="text-xl">{selectedCountry.flag}</span>
                          <span className="text-sm font-medium">{selectedCountry.code}</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {showCountryDropdown && (
                          <div
                            className="absolute top-full left-0 mt-2 border shadow-2xl z-50 max-h-80 overflow-y-auto"
                            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', width: '280px' }}
                          >
                            {/* Popular */}
                            <div className="p-2 text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--text3)', backgroundColor: 'var(--accent-bg)' }}>
                              {lang === 'fr' ? 'Populaires' : lang === 'ar' ? 'شائع' : 'Popular'}
                            </div>
                            {popularCountries.map(country => (
                              <button
                                key={country.code}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, countryCode: country.code }));
                                  setShowCountryDropdown(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent/10 transition-colors"
                              >
                                <span className="text-xl">{country.flag}</span>
                                <span className="text-sm font-medium flex-1" style={{ color: 'var(--text)' }}>{country.country}</span>
                                <span className="text-sm" style={{ color: 'var(--text3)' }}>{country.code}</span>
                              </button>
                            ))}
                            
                            {/* Divider */}
                            <div className="border-t my-2" style={{ borderColor: 'var(--border)' }}></div>
                            
                            {/* All Others */}
                            <div className="p-2 text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--text3)', backgroundColor: 'var(--accent-bg)' }}>
                              {lang === 'fr' ? 'Tous les pays' : lang === 'ar' ? 'جميع البلدان' : 'All countries'}
                            </div>
                            {otherCountries.map(country => (
                              <button
                                key={country.code}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, countryCode: country.code }));
                                  setShowCountryDropdown(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent/10 transition-colors"
                              >
                                <span className="text-xl">{country.flag}</span>
                                <span className="text-sm font-medium flex-1" style={{ color: 'var(--text)' }}>{country.country}</span>
                                <span className="text-sm" style={{ color: 'var(--text3)' }}>{country.code}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Phone Input */}
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="flex-1 border px-6 py-4 text-sm focus:outline-none focus:border-accent transition-all"
                        style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                        placeholder="123456789"
                      />
                    </div>
                  </div>

                  {/* DYNAMIC FIELDS BASED ON SERVICE */}
                  {selectedService === 'realEstate' && (
                    <>
                      {/* Budget */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--text3)' }}>
                          {lang === 'fr' ? 'Budget & Détails' : lang === 'ar' ? 'الميزانية والتفاصيل' : 'Budget & Details'}
                        </label>
                        <textarea
                          rows={4}
                          value={formData.budget}
                          onChange={e => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                          className="w-full border px-6 py-4 text-sm focus:outline-none focus:border-accent transition-all resize-none"
                          style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                          placeholder={
                            lang === 'fr'
                              ? 'Budget estimé, objectif d\'investissement, type de bien recherché…'
                              : lang === 'ar'
                              ? 'الميزانية المقدرة، هدف الاستثمار، نوع العقار المطلوب…'
                              : 'Estimated budget, investment goal, preferred property type…'
                          }
                        />
                      </div>

                      {/* Payment Plan */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--text3)' }}>
                          {lang === 'fr' ? 'Paiement' : lang === 'ar' ? 'الدفع' : 'Payment'}
                        </label>
                        <select
                          value={formData.paymentPlan}
                          onChange={e => setFormData(prev => ({ ...prev, paymentPlan: e.target.value }))}
                          className="w-full border px-6 py-4 text-sm focus:outline-none focus:border-accent transition-all"
                          style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                        >
                          <option value="">
                            {lang === 'fr' ? 'Sélectionner…' : lang === 'ar' ? 'اختر…' : 'Select…'}
                          </option>
                          <option value="cash">
                            {lang === 'fr' ? 'Paiement comptant' : lang === 'ar' ? 'نقدي' : 'Cash payment'}
                          </option>
                          <option value="payment-plan">
                            {lang === 'fr' ? 'Plan de paiement' : lang === 'ar' ? 'خطة الدفع' : 'Payment plan'}
                          </option>
                          <option value="flexible">
                            {lang === 'fr' ? 'Flexible / À discuter' : lang === 'ar' ? 'مرن / للمناقشة' : 'Flexible / To discuss'}
                          </option>
                        </select>
                      </div>

                      {/* Investment Horizon */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--text3)' }}>
                          {lang === 'fr' ? 'Horizon d\'investissement' : lang === 'ar' ? 'أفق الاستثمار' : 'Investment horizon'}
                        </label>
                        <select
                          value={formData.investmentHorizon}
                          onChange={e => setFormData(prev => ({ ...prev, investmentHorizon: e.target.value }))}
                          className="w-full border px-6 py-4 text-sm focus:outline-none focus:border-accent transition-all"
                          style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                        >
                          <option value="">
                            {lang === 'fr' ? 'Sélectionner…' : lang === 'ar' ? 'اختر…' : 'Select…'}
                          </option>
                          <option value="short-term">
                            {lang === 'fr' ? 'Court terme (1-3 ans)' : lang === 'ar' ? 'قصير الأجل (1-3 سنوات)' : 'Short term (1-3 years)'}
                          </option>
                          <option value="medium-term">
                            {lang === 'fr' ? 'Moyen terme (3-7 ans)' : lang === 'ar' ? 'متوسط الأجل (3-7 سنوات)' : 'Medium term (3-7 years)'}
                          </option>
                          <option value="long-term">
                            {lang === 'fr' ? 'Long terme (7+ ans)' : lang === 'ar' ? 'طويل الأجل (7+ سنوات)' : 'Long term (7+ years)'}
                          </option>
                        </select>
                      </div>
                    </>
                  )}

                  {selectedService === 'businessSetup' && (
                    <>
                      {/* Activity Type */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--text3)' }}>
                          {lang === 'fr' ? 'Type d\'activité' : lang === 'ar' ? 'نوع النشاط' : 'Activity type'}
                        </label>
                        <input
                          type="text"
                          value={formData.activityType}
                          onChange={e => setFormData(prev => ({ ...prev, activityType: e.target.value }))}
                          className="w-full border px-6 py-4 text-sm focus:outline-none focus:border-accent transition-all"
                          style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                          placeholder={
                            lang === 'fr'
                              ? 'E-commerce, Consulting, Trading, etc.'
                              : lang === 'ar'
                              ? 'التجارة الإلكترونية، الاستشارات، التجارة، إلخ.'
                              : 'E-commerce, Consulting, Trading, etc.'
                          }
                        />
                      </div>

                      {/* Current Country */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--text3)' }}>
                          {lang === 'fr' ? 'Pays de résidence actuel' : lang === 'ar' ? 'بلد الإقامة الحالي' : 'Current country of residence'}
                        </label>
                        <input
                          type="text"
                          value={formData.currentCountry}
                          onChange={e => setFormData(prev => ({ ...prev, currentCountry: e.target.value }))}
                          className="w-full border px-6 py-4 text-sm focus:outline-none focus:border-accent transition-all"
                          style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                          placeholder={lang === 'fr' ? 'France, Algérie, etc.' : lang === 'ar' ? 'فرنسا، الجزائر، إلخ.' : 'France, Algeria, etc.'}
                        />
                      </div>

                      {/* Number of Visas */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--text3)' }}>
                          {lang === 'fr' ? 'Nombre de visas souhaités' : lang === 'ar' ? 'عدد التأشيرات المطلوبة' : 'Number of visas needed'}
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={formData.numberOfVisas}
                          onChange={e => setFormData(prev => ({ ...prev, numberOfVisas: e.target.value }))}
                          className="w-full border px-6 py-4 text-sm focus:outline-none focus:border-accent transition-all"
                          style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                          placeholder="1, 2, 3…"
                        />
                      </div>

                      {/* Company Type */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--text3)' }}>
                          {lang === 'fr' ? 'Type de société' : lang === 'ar' ? 'نوع الشركة' : 'Company type'}
                        </label>
                        <select
                          value={formData.companyType}
                          onChange={e => setFormData(prev => ({ ...prev, companyType: e.target.value }))}
                          className="w-full border px-6 py-4 text-sm focus:outline-none focus:border-accent transition-all"
                          style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                        >
                          <option value="">
                            {lang === 'fr' ? 'Sélectionner…' : lang === 'ar' ? 'اختر…' : 'Select…'}
                          </option>
                          <option value="freezone">Free Zone</option>
                          <option value="mainland">Mainland</option>
                          <option value="offshore">Offshore</option>
                          <option value="undecided">
                            {lang === 'fr' ? 'Non décidé / Besoin de conseil' : lang === 'ar' ? 'غير محدد / أحتاج مشورة' : 'Undecided / Need advice'}
                          </option>
                        </select>
                      </div>

                      {/* Banking Needs */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--text3)' }}>
                          {lang === 'fr' ? 'Besoins bancaires' : lang === 'ar' ? 'الاحتياجات المصرفية' : 'Banking needs'}
                        </label>
                        <select
                          value={formData.bankingNeeds}
                          onChange={e => setFormData(prev => ({ ...prev, bankingNeeds: e.target.value }))}
                          className="w-full border px-6 py-4 text-sm focus:outline-none focus:border-accent transition-all"
                          style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                        >
                          <option value="">
                            {lang === 'fr' ? 'Sélectionner…' : lang === 'ar' ? 'اختر…' : 'Select…'}
                          </option>
                          <option value="business-account">
                            {lang === 'fr' ? 'Compte professionnel uniquement' : lang === 'ar' ? 'حساب الأعمال فقط' : 'Business account only'}
                          </option>
                          <option value="personal-account">
                            {lang === 'fr' ? 'Compte personnel uniquement' : lang === 'ar' ? 'حساب شخصي فقط' : 'Personal account only'}
                          </option>
                          <option value="both">
                            {lang === 'fr' ? 'Les deux' : lang === 'ar' ? 'كلاهما' : 'Both'}
                          </option>
                          <option value="none">
                            {lang === 'fr' ? 'Aucun besoin bancaire' : lang === 'ar' ? 'لا حاجة مصرفية' : 'No banking needs'}
                          </option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* Additional Message */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--text3)' }}>
                      {lang === 'fr' ? 'Message additionnel (optionnel)' : lang === 'ar' ? 'رسالة إضافية (اختياري)' : 'Additional message (optional)'}
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full border px-6 py-4 text-sm focus:outline-none focus:border-accent transition-all resize-none"
                      style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                      placeholder={
                        lang === 'fr'
                          ? 'Précisions, questions, contraintes spécifiques…'
                          : lang === 'ar'
                          ? 'تفاصيل، أسئلة، قيود محددة…'
                          : 'Details, questions, specific constraints…'
                      }
                    />
                  </div>

                  {/* Reassurance Message */}
                  <div className="p-4 border" style={{ backgroundColor: 'var(--accent-bg)', borderColor: 'var(--accent)' }}>
                    <p className="text-sm font-medium text-center" style={{ color: 'var(--accent)' }}>
                      {lang === 'fr'
                        ? '✓ Un conseiller MoveSmart vous contactera sous 24h'
                        : lang === 'ar'
                        ? '✓ سيتصل بك مستشار MoveSmart خلال 24 ساعة'
                        : '✓ A MoveSmart advisor will contact you within 24 hours'
                      }
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-gold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-3">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        {lang === 'fr' ? 'Envoi en cours…' : lang === 'ar' ? 'جارٍ الإرسال…' : 'Sending…'}
                      </span>
                    ) : (
                      <>
                        {lang === 'fr' ? 'ÊTRE CONTACTÉ' : lang === 'ar' ? 'طلب اتصال' : 'SPEAK WITH AN ADVISOR'}
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
