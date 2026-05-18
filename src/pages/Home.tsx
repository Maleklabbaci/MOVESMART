import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Briefcase, Globe, TrendingUp, Shield, Users, ArrowRight, Phone, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import FAQ from '../components/FAQ';

export default function Home() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  // Language-specific testimonials
  const testimonials = {
    en: [
      {
        name: 'Ahmed Al-Mansoori',
        role: 'Real Estate Investor',
        location: 'Qatar',
        text: 'MoveSmart helped me acquire a high-yield property in Business Bay. Professional service, transparent process, and excellent ROI within the first year.',
        rating: 5
      },
      {
        name: 'David Morrison',
        role: 'Entrepreneur',
        location: 'UK',
        text: 'I relocated my entire business to Dubai with MoveSmart's guidance. From company setup to residency visa — they handled everything seamlessly.',
        rating: 5
      },
      {
        name: 'Sarah Chen',
        role: 'Golden Visa Holder',
        location: 'Singapore',
        text: 'Obtained my Golden Visa through property investment. The team's expertise in Dubai regulations saved me months of research and stress.',
        rating: 5
      }
    ],
    fr: [
      {
        name: 'Pierre Dubois',
        role: 'Investisseur Immobilier',
        location: 'France',
        text: 'MoveSmart m'a accompagné de A à Z dans l'acquisition d'un appartement à forte plus-value. Service irréprochable et résultats au rendez-vous.',
        rating: 5
      },
      {
        name: 'Sophie Martin',
        role: 'Entrepreneuse',
        location: 'Belgique',
        text: 'Grâce à MoveSmart, j'ai pu créer ma société à Dubaï en quelques semaines. Leur connaissance des démarches administratives est précieuse.',
        rating: 5
      },
      {
        name: 'Marc Laurent',
        role: 'Investisseur',
        location: 'Suisse',
        text: 'Accompagnement francophone de très haut niveau. Leur analyse financière des projets immobiliers est d'une rigueur exceptionnelle.',
        rating: 5
      }
    ],
    ar: [
      {
        name: 'محمد العبدالله',
        role: 'مستثمر عقاري',
        location: 'الإمارات',
        text: 'خدمة احترافية ممتازة. ساعدوني في الحصول على عقار استثماري بعائد مرتفع في منطقة الخليج التجاري.',
        rating: 5
      },
      {
        name: 'فاطمة الحمادي',
        role: 'رائدة أعمال',
        location: 'السعودية',
        text: 'أسست شركتي في دبي بمساعدة MoveSmart. الفريق محترف ويفهم احتياجات المستثمرين العرب بشكل ممتاز.',
        rating: 5
      },
      {
        name: 'عمر الشامي',
        role: 'حامل التأشيرة الذهبية',
        location: 'لبنان',
        text: 'حصلت على التأشيرة الذهبية من خلال الاستثمار العقاري. فريق MoveSmart سهّل كل الإجراءات بشكل احترافي.',
        rating: 5
      }
    ]
  };

  const currentTestimonials = testimonials[lang] || testimonials.en;

  return (
    <div style={{ backgroundColor: 'var(--bg)' }}>
      
      {/* HERO - CLEAR VALUE PROP */}
      <section className="relative h-[95vh] min-h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/4531667/pexels-photo-4531667.jpeg" 
            alt="Dubai Skyline" 
            className="w-full h-full object-cover scale-105 transition-transform duration-[20s] ease-out hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/75"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto mt-20">
          <span className="inline-block px-6 py-3 border border-accent/30 text-accent text-[11px] font-bold uppercase tracking-[0.25em] mb-10 animate-fade-in backdrop-blur-sm bg-accent/5">
            {lang === 'fr' ? 'Votre Partenaire à Dubaï' : lang === 'ar' ? 'شريكك في دبي' : 'Your Partner in Dubai'}
          </span>
          
          <h1 className="text-5xl md:text-[95px] mb-8 tracking-tighter leading-[0.95] text-white drop-shadow-2xl animate-fade-in delay-100 font-serif">
            {lang === 'fr' 
              ? <>Investir, s'installer <br/>& <span className="font-serif-italic text-accent">prospérer à Dubaï.</span></>
              : lang === 'ar'
              ? <>استثمر، استقر <br/>و <span className="font-serif-italic text-accent">انطلق في دبي.</span></>
              : <>Invest, settle <br/>& <span className="font-serif-italic text-accent">grow in Dubai.</span></>
            }
          </h1>
          
          <p className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto font-light leading-relaxed text-gray-200 animate-fade-in delay-200">
            {lang === 'fr'
              ? 'Immobilier premium · Création d\'entreprise · Résidence UAE'
              : lang === 'ar'
              ? 'عقارات مميزة · تأسيس شركات · إقامة الإمارات'
              : 'Premium Real Estate · Company Formation · UAE Residency'
            }
          </p>
          
          <p className="text-base md:text-lg mb-12 max-w-2xl mx-auto font-light text-gray-400 animate-fade-in delay-300">
            {lang === 'fr'
              ? 'Accompagnement francophone & international · Expertise locale · 0% impôt'
              : lang === 'ar'
              ? 'مرافقة دولية · خبرة محلية · 0٪ ضريبة'
              : 'Multilingual Support · Local Expertise · 0% Tax'
            }
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in delay-400">
            <Link to="/listings" className="btn-gold w-full sm:w-auto shadow-2xl">
              {lang === 'fr' ? 'Explorer les opportunités' : lang === 'ar' ? 'استكشف الفرص' : 'Explore Opportunities'}
            </Link>
            <Link to="/contact" className="btn-outline w-full sm:w-auto text-white border-white/30 hover:bg-white/10 hover:border-white">
              {lang === 'fr' ? 'Consultation gratuite' : lang === 'ar' ? 'استشارة مجانية' : 'Free Consultation'}
            </Link>
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section className="border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
        <div className="max-w-[1400px] mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { v: '500+', l: lang === 'fr' ? 'Clients accompagnés' : lang === 'ar' ? 'عميل' : 'Clients served' },
            { v: '8%', l: lang === 'fr' ? 'Rendement locatif net' : lang === 'ar' ? 'عائد الإيجار الصافي' : 'Net rental yield' },
            { v: '15%', l: lang === 'fr' ? 'Plus-value moyenne' : lang === 'ar' ? 'متوسط الربح' : 'Average capital gain' },
            { v: '0%', l: lang === 'fr' ? 'Impôt sur le revenu' : lang === 'ar' ? 'ضريبة الدخل' : 'Income tax' }
          ].map((s, i) => (
            <div key={i} className="text-center animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <p className="text-4xl md:text-6xl font-serif tracking-tighter mb-4" style={{ color: 'var(--text)' }}>{s.v}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text3)' }}>{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DUAL SERVICES - VISUAL SPLIT */}
      <section className="py-32" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-20 animate-fade-in">
            <span className="tag-gold mb-6">
              {lang === 'fr' ? 'Nos Services' : lang === 'ar' ? 'خدماتنا' : 'Our Services'}
            </span>
            <h2 className="text-5xl md:text-7xl tracking-tighter mb-6" style={{ color: 'var(--text)' }}>
              {lang === 'fr' 
                ? <>Deux pôles, <span className="font-serif-italic text-accent">un objectif.</span></>
                : lang === 'ar'
                ? <>قطاعان، <span className="font-serif-italic text-accent">هدف واحد.</span></>
                : <>Two pillars, <span className="font-serif-italic text-accent">one mission.</span></>
              }
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--text3)' }}>
              {lang === 'fr'
                ? 'Investissement immobilier de haut rendement et création d\'entreprise à Dubaï — deux expertises complémentaires pour bâtir votre succès aux Émirats.'
                : lang === 'ar'
                ? 'استثمار عقاري عالي العائد وتأسيس الشركات في دبي — خبرتان متكاملتان لبناء نجاحك في الإمارات.'
                : 'High-yield real estate investment and business setup in Dubai — two complementary expertises to build your success in the UAE.'
              }
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* REAL ESTATE CARD */}
            <div className="card-border p-12 group hover:border-accent transition-all duration-300 animate-fade-in">
              <div className="flex items-start gap-6 mb-8">
                <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110" style={{ backgroundColor: 'var(--accent-bg)' }}>
                  <Building2 className="w-8 h-8" style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-3xl font-serif tracking-tight mb-3" style={{ color: 'var(--text)' }}>
                    {lang === 'fr' ? 'Real Estate & Investment' : lang === 'ar' ? 'العقارات والاستثمار' : 'Real Estate & Investment'}
                  </h3>
                  <p className="text-sm font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--accent)' }}>
                    {lang === 'fr' ? 'Immobilier Premium' : lang === 'ar' ? 'عقارات مميزة' : 'Premium Properties'}
                  </p>
                </div>
              </div>
              
              <p className="text-lg mb-8 leading-[1.8]" style={{ color: 'var(--text3)' }}>
                {lang === 'fr'
                  ? 'Accédez aux meilleures opportunités immobilières à Dubaï : appartements haut rendement, villas de luxe, projets off-plan exclusifs, et Golden Visa.'
                  : lang === 'ar'
                  ? 'احصل على أفضل الفرص العقارية في دبي: شقق عالية العائد، فلل فاخرة، مشاريع حصرية على الخريطة، والتأشيرة الذهبية.'
                  : 'Access the best real estate opportunities in Dubai: high-yield apartments, luxury villas, exclusive off-plan projects, and Golden Visa pathways.'
                }
              </p>
              
              <ul className="space-y-4 mb-10">
                {[
                  lang === 'fr' ? 'Rendement locatif 6-8% net/an' : lang === 'ar' ? 'عائد إيجار 6-8٪ صافي سنويًا' : 'Rental yield 6-8% net/year',
                  lang === 'fr' ? 'Achat sur plan avec paiement échelonné' : lang === 'ar' ? 'شراء على الخريطة مع دفعات مجدولة' : 'Off-plan with payment plans',
                  lang === 'fr' ? 'Golden Visa à partir de 545k AED' : lang === 'ar' ? 'التأشيرة الذهبية من 545 ألف درهم' : 'Golden Visa from 545k AED',
                  lang === 'fr' ? 'Gestion locative complète' : lang === 'ar' ? 'إدارة كاملة للإيجار' : 'Full property management',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--accent)' }}></div>
                    <span className="text-sm" style={{ color: 'var(--text)' }}>{item}</span>
                  </li>
                ))}
              </ul>
              
              <Link to="/listings" className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.15em] group/link" style={{ color: 'var(--accent)' }}>
                {lang === 'fr' ? 'Voir les biens' : lang === 'ar' ? 'عرض العقارات' : 'View Properties'}
                <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
              </Link>
            </div>

            {/* BUSINESS SETUP CARD */}
            <div className="card-border p-12 group hover:border-accent transition-all duration-300 animate-fade-in delay-100">
              <div className="flex items-start gap-6 mb-8">
                <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110" style={{ backgroundColor: 'var(--accent-bg)' }}>
                  <Briefcase className="w-8 h-8" style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-3xl font-serif tracking-tight mb-3" style={{ color: 'var(--text)' }}>
                    {lang === 'fr' ? 'Business Setup & Relocation' : lang === 'ar' ? 'تأسيس الشركات والانتقال' : 'Business Setup & Relocation'}
                  </h3>
                  <p className="text-sm font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--accent)' }}>
                    {lang === 'fr' ? 'Installation Complète' : lang === 'ar' ? 'إعداد كامل' : 'Full Setup'}
                  </p>
                </div>
              </div>
              
              <p className="text-lg mb-8 leading-[1.8]" style={{ color: 'var(--text3)' }}>
                {lang === 'fr'
                  ? 'Créez votre entreprise à Dubaï et obtenez votre résidence UAE en quelques semaines. Accompagnement complet de A à Z.'
                  : lang === 'ar'
                  ? 'أسس شركتك في دبي واحصل على إقامة الإمارات في أسابيع. مرافقة كاملة من الألف إلى الياء.'
                  : 'Set up your company in Dubai and obtain your UAE residency within weeks. Complete A-to-Z support.'
                }
              </p>
              
              <ul className="space-y-4 mb-10">
                {[
                  lang === 'fr' ? 'Création de société (Freezone, Mainland, Offshore)' : lang === 'ar' ? 'تأسيس الشركة (المنطقة الحرة، البر الرئيسي، الأوفشور)' : 'Company formation (Freezone, Mainland, Offshore)',
                  lang === 'fr' ? 'Visa de résidence UAE & visas employés' : lang === 'ar' ? 'تأشيرة إقامة الإمارات وتأشيرات الموظفين' : 'UAE residency visa & employee visas',
                  lang === 'fr' ? 'Ouverture de compte bancaire corporate' : lang === 'ar' ? 'فتح حساب بنكي للشركات' : 'Corporate bank account opening',
                  lang === 'fr' ? 'Structuration fiscale & optimisation' : lang === 'ar' ? 'هيكلة ضريبية وتحسين' : 'Tax structuring & optimization',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--accent)' }}></div>
                    <span className="text-sm" style={{ color: 'var(--text)' }}>{item}</span>
                  </li>
                ))}
              </ul>
              
              <Link to="/contact" className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.15em] group/link" style={{ color: 'var(--accent)' }}>
                {lang === 'fr' ? 'Démarrer mon projet' : lang === 'ar' ? 'ابدأ مشروعي' : 'Start My Setup'}
                <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHY MOVESMART */}
      <section className="py-32 border-y" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-20 animate-fade-in">
            <span className="tag-gold mb-6">
              {lang === 'fr' ? 'Pourquoi MoveSmart' : lang === 'ar' ? 'لماذا MoveSmart' : 'Why MoveSmart'}
            </span>
            <h2 className="text-5xl md:text-7xl tracking-tighter max-w-4xl mx-auto" style={{ color: 'var(--text)' }}>
              {lang === 'fr' 
                ? <>L'accompagnement <span className="font-serif-italic text-accent">qui change tout.</span></>
                : lang === 'ar'
                ? <>المرافقة التي <span className="font-serif-italic text-accent">تحدث الفرق.</span></>
                : <>The support <span className="font-serif-italic text-accent">that makes all the difference.</span></>
              }
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: Globe, 
                title: lang === 'fr' ? 'Accompagnement Multilingue' : lang === 'ar' ? 'مرافقة متعددة اللغات' : 'Multilingual Support',
                desc: lang === 'fr' 
                  ? 'Service en français, anglais et arabe. Équipe locale à Dubaï qui comprend vos enjeux.'
                  : lang === 'ar'
                  ? 'خدمة بالفرنسية والإنجليزية والعربية. فريق محلي في دبي يفهم احتياجاتك.'
                  : 'Service in French, English, and Arabic. Local team in Dubai who understands your needs.'
              },
              { 
                icon: Shield, 
                title: lang === 'fr' ? 'Transparence Totale' : lang === 'ar' ? 'شفافية كاملة' : 'Total Transparency',
                desc: lang === 'fr'
                  ? 'Aucun frais caché. Analyse financière rigoureuse. Nous travaillons pour votre ROI.'
                  : lang === 'ar'
                  ? 'لا توجد رسوم مخفية. تحليل مالي دقيق. نعمل لتحقيق عائد استثمارك.'
                  : 'No hidden fees. Rigorous financial analysis. We work for your ROI.'
              },
              { 
                icon: TrendingUp, 
                title: lang === 'fr' ? 'Expertise Terrain' : lang === 'ar' ? 'خبرة محلية' : 'Field Expertise',
                desc: lang === 'fr'
                  ? 'Connaissance approfondie du marché UAE. Relations privilégiées avec les développeurs.'
                  : lang === 'ar'
                  ? 'معرفة عميقة بسوق الإمارات. علاقات مميزة مع المطورين.'
                  : 'Deep knowledge of the UAE market. Privileged relationships with developers.'
              }
            ].map((item, idx) => (
              <div key={idx} className="card-border p-10 animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="mb-8">
                  <item.icon className="w-12 h-12" style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-serif tracking-tight mb-4" style={{ color: 'var(--text)' }}>{item.title}</h3>
                <p className="text-[15px] leading-[1.8]" style={{ color: 'var(--text3)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - LANGUAGE SPECIFIC */}
      <section className="py-32" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-20 animate-fade-in">
            <span className="tag-gold mb-6">
              {lang === 'fr' ? 'Témoignages' : lang === 'ar' ? 'شهادات العملاء' : 'Testimonials'}
            </span>
            <h2 className="text-5xl md:text-7xl tracking-tighter" style={{ color: 'var(--text)' }}>
              {lang === 'fr'
                ? <>Ils nous font <span className="font-serif-italic text-accent">confiance.</span></>
                : lang === 'ar'
                ? <>ثقة <span className="font-serif-italic text-accent">عملائنا.</span></>
                : <>They trust <span className="font-serif-italic text-accent">us.</span></>
              }
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {currentTestimonials.map((testimonial, idx) => (
              <div key={idx} className="card-border p-10 animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="flex gap-1 mb-6" style={{ color: 'var(--accent)' }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-[15px] leading-[1.8] mb-8 font-serif-italic" style={{ color: 'var(--text)' }}>
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: 'var(--accent)' }}>
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>{testimonial.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text3)' }}>{testimonial.role} · {testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ />

      {/* CTA FINAL */}
      <section className="py-40 relative overflow-hidden text-center border-t" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, var(--accent) 0%, transparent 70%)' }}></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 animate-fade-in">
          <span className="tag-gold mb-8">
            {lang === 'fr' ? 'Passez à l\'action' : lang === 'ar' ? 'ابدأ الآن' : 'Take Action'}
          </span>
          <h2 className="text-5xl md:text-8xl tracking-tighter mb-10 leading-[1.05]" style={{ color: 'var(--text)' }}>
            {lang === 'fr'
              ? <>Votre projet commence <span className="text-accent font-serif-italic">aujourd'hui.</span></>
              : lang === 'ar'
              ? <>مشروعك يبدأ <span className="text-accent font-serif-italic">اليوم.</span></>
              : <>Your project starts <span className="text-accent font-serif-italic">today.</span></>
            }
          </h2>
          <p className="text-xl md:text-2xl mb-14 font-light max-w-3xl mx-auto leading-[1.8]" style={{ color: 'var(--text3)' }}>
            {lang === 'fr'
              ? 'Réservez votre consultation privée. Notre expert analyse vos objectifs et vous propose une stratégie sur mesure.'
              : lang === 'ar'
              ? 'احجز استشارتك الخاصة. يقوم خبيرنا بتحليل أهدافك ويقترح عليك استراتيجية مخصصة.'
              : 'Book your private consultation. Our expert analyzes your goals and proposes a tailored strategy.'
            }
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/contact" className="btn-gold shadow-2xl">
              {lang === 'fr' ? 'Réserver un appel privé' : lang === 'ar' ? 'احجز مكالمة خاصة' : 'Book a Private Call'}
            </Link>
            <a href={`https://wa.me/971569130632`} target="_blank" rel="noopener noreferrer" className="btn-outline">
              {lang === 'fr' ? 'WhatsApp direct' : lang === 'ar' ? 'واتساب مباشر' : 'WhatsApp Direct'}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
