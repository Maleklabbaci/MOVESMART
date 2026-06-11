import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const getArticles = (lang: string) => [
  {
    id: 1,
    title: lang === 'fr' ? "Guide complet du Golden Visa Dubaï 2025" : lang === 'ar' ? "الدليل الكامل للتأشيرة الذهبية دبي 2025" : "Complete Guide to Golden Visa Dubai 2025",
    excerpt: lang === 'fr' ? "Tout savoir sur le programme Golden Visa des Émirats : conditions d'éligibilité, étapes et avantages de cette résidence de 10 ans." : lang === 'ar' ? "تعرف على كل ما يخص برنامج التأشيرة الذهبية الإماراتية، شروط الأهلية، وكيفية التقديم للإقامة لمدة 10 سنوات." : "Learn everything about UAE's Golden Visa program, eligibility requirements, and how to apply for this 10-year residency.",
    author: "Sarah Al Mansoori",
    date: lang === 'fr' ? "15 Avril 2025" : lang === 'ar' ? "15 أبريل 2025" : "April 15, 2025",
    category: lang === 'fr' ? "Visa" : lang === 'ar' ? "تأشيرة" : "Visa",
    image: "https://ellingtonproperties.ae/wp-content/uploads/WhatsApp-Image-2025-09-11-at-10.27.02_5e015923-1.jpg"
  },
  {
    id: 2,
    title: lang === 'fr' ? "Tendances de l'immobilier à Dubaï en 2025" : lang === 'ar' ? "اتجاهات سوق العقارات في دبي 2025" : "Dubai Real Estate Investment Trends 2025",
    excerpt: lang === 'fr' ? "Découvrez les dernières tendances du marché immobilier de Dubaï, les quartiers émergents et les opportunités d'investissement en 2025." : lang === 'ar' ? "اكتشف أحدث اتجاهات سوق العقارات في دبي، الأحياء الناشئة، وفرص الاستثمار لعام 2025." : "Discover the latest trends in Dubai property market, emerging neighborhoods, and investment opportunities for 2025.",
    author: "Mohammed Al Hashmi",
    date: lang === 'fr' ? "10 Avril 2025" : lang === 'ar' ? "10 أبريل 2025" : "April 10, 2025",
    category: lang === 'fr' ? "Investissement" : lang === 'ar' ? "استثمار" : "Investment",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    title: lang === 'fr' ? "Marina vs Downtown Dubaï : Lequel choisir ?" : lang === 'ar' ? "مارينا مقابل وسط مدينة دبي: أيهما أفضل؟" : "Marina vs Downtown Dubai: Which is Better?",
    excerpt: lang === 'fr' ? "Comparez deux des quartiers les plus prisés de Dubaï : Marina et Downtown. Prix, style de vie et potentiel d'investissement." : lang === 'ar' ? "قارن بين حيّين من أشهر أحياء دبي: المارينا ووسط المدينة. تحليل الأسعار ونمط الحياة وإمكانات الاستثمار." : "Compare two of Dubai's most popular neighborhoods: Marina and Downtown. Analyze prices, lifestyle, and investment potential.",
    author: "Fatima Saeed",
    date: lang === 'fr' ? "5 Avril 2025" : lang === 'ar' ? "5 أبريل 2025" : "April 5, 2025",
    category: lang === 'fr' ? "Comparaison" : lang === 'ar' ? "مقارنة" : "Comparison",
    image: "https://images.pexels.com/photos/33669696/pexels-photo-33669696.jpeg"
  },
  {
    id: 4,
    title: lang === 'fr' ? "Comment calculer le rendement locatif à Dubaï" : lang === 'ar' ? "كيفية حساب العائد الإيجاري في دبي" : "How to Calculate Rental Yield on Dubai Properties",
    excerpt: lang === 'fr' ? "Maîtrisez le calcul du rendement locatif : formules, facteurs clés et stratégies pour maximiser vos revenus immobiliers." : lang === 'ar' ? "أتقن حساب العائد الإيجاري: التعلم الصيغ والعوامل المؤثرة والاستراتيجيات لتحقيق أقصى عائد." : "Master the art of calculating rental yield. Learn formulas, factors to consider, and strategies to maximize returns.",
    author: "Ahmed Al Khouri",
    date: lang === 'fr' ? "28 Mars 2025" : lang === 'ar' ? "28 مارس 2025" : "March 28, 2025",
    category: lang === 'fr' ? "Finance" : lang === 'ar' ? "تمويل" : "Finance",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 5,
    title: lang === 'fr' ? "Guide de l'expatrié : Vivre à Dubaï en tant qu'investisseur" : lang === 'ar' ? "دليل المغترب: العيش في دبي كمستثمر" : "Expat Guide: Living in Dubai as an Investor",
    excerpt: lang === 'fr' ? "Guide complet pour les expatriés s'installant à Dubaï : visa, banque, santé, éducation et conseils pratiques pour bien démarrer." : lang === 'ar' ? "دليل شامل للمغتربين القادمين إلى دبي: التأشيرة، البنوك، الرعاية الصحية، التعليم ونصائح عملية." : "Complete guide for expats moving to Dubai: visa, banking, healthcare, education, and lifestyle tips for newcomers.",
    author: "Lisa Anderson",
    date: lang === 'fr' ? "20 Mars 2025" : lang === 'ar' ? "20 مارس 2025" : "March 20, 2025",
    category: lang === 'fr' ? "Mode de vie" : lang === 'ar' ? "أسلوب حياة" : "Lifestyle",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 6,
    title: lang === 'fr' ? "Financer votre bien immobilier à Dubaï : guide complet" : lang === 'ar' ? "تمويل عقارك في دبي: دليل شامل" : "Financing Your Dubai Property: Complete Walkthrough",
    excerpt: lang === 'fr' ? "Tout sur le financement immobilier à Dubaï : banques, conditions de prêt, taux d'intérêt et comment obtenir une approbation rapidement." : lang === 'ar' ? "كل ما تحتاج معرفته عن تمويل العقارات في دبي: البنوك، شروط القروض، معدلات الفائدة، والحصول على موافقة سريعة." : "Everything about Dubai property financing: banks, loan requirements, interest rates, and how to get approved quickly.",
    author: "Rashid Al Maktoumi",
    date: lang === 'fr' ? "15 Mars 2025" : lang === 'ar' ? "15 مارس 2025" : "March 15, 2025",
    category: lang === 'fr' ? "Finance" : lang === 'ar' ? "تمويل" : "Finance",
    image: "https://images.pexels.com/photos/8293647/pexels-photo-8293647.jpeg"
  }
];

export default function Blog() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const articles = getArticles(lang);

  return (
    <div className="min-h-screen pt-28 pb-20 md:pt-40 md:pb-40 overflow-x-hidden" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        
        {/* HEADER */}
        <div className="text-center mb-16 md:mb-24 animate-fade-in">
          <span className="tag-gold mb-10">BLOG</span>
          <h1 className="text-4xl md:text-[90px] font-serif tracking-tighter leading-[1.05] mb-8 md:mb-12">
            {lang === 'fr' ? 'Analyses' : lang === 'ar' ? 'تحليلات' : 'Real Estate'} <br/>
            <span className="font-serif-italic text-accent">
              {lang === 'fr' ? 'Immobilières.' : lang === 'ar' ? 'عقارية.' : 'Insights.'}
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl font-light leading-[1.8]" style={{ color: 'var(--text3)' }}>
            {lang === 'fr'
              ? "Conseils d'experts, analyses de marché et guides pour prendre les meilleures décisions d'investissement à Dubaï."
              : lang === 'ar'
              ? "نصائح الخبراء وتحليلات السوق والأدلة الإرشادية لمساعدتك على اتخاذ قرارات استثمارية مدروسة في دبي."
              : "Expert tips, market analysis, and guides to help you make informed investment decisions in Dubai."
            }
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {articles.map((article, i) => (
            <Link
              key={article.id}
              to={`/blog/${article.id}`}
              className="group flex flex-col card-border animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-black/5">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                />
                <div className="absolute top-5 left-5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg backdrop-blur-md" 
                  style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {article.category}
                </div>
              </div>
              
              <div className="p-8 md:p-10 flex-1 flex flex-col">
                <div className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em] mb-6 gap-4 flex-wrap" style={{ color: 'var(--text3)' }}>
                  <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-accent" /> {article.date}</span>
                  <span className="flex items-center gap-2"><User className="w-4 h-4 text-accent" /> {article.author}</span>
                </div>
                
                <h3 className="text-xl md:text-2xl font-serif tracking-tight mb-4 line-clamp-2 transition-colors flex-1 group-hover:text-accent" style={{ color: 'var(--text)' }}>
                  {article.title}
                </h3>
                
                <p className="text-[15px] font-light leading-[1.8] mb-8 line-clamp-3" style={{ color: 'var(--text3)' }}>
                  {article.excerpt}
                </p>
                
                <div className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform w-fit" style={{ color: 'var(--accent)' }}>
                  {lang === 'fr' ? 'Lire la suite' : lang === 'ar' ? 'اقرأ المزيد' : 'Read More'} <ArrowRight className="w-4 h-4 ml-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* NEWSLETTER CTA */}
        <div className="mt-20 md:mt-32 px-6 py-12 md:p-24 text-center border shadow-2xl animate-fade-in delay-200" style={{ backgroundColor: 'var(--header-bg)', borderColor: 'var(--border)' }}>
          <span className="tag-gold mb-8">
            {lang === 'fr' ? 'Restez informé' : lang === 'ar' ? 'ابقَ على اطلاع' : 'Stay Updated'}
          </span>
          <h3 className="text-3xl md:text-6xl font-serif tracking-tighter mb-6 md:mb-8" style={{ color: 'var(--text)' }}>
            {lang === 'fr' ? 'Abonnez-vous à notre newsletter' : lang === 'ar' ? 'اشترك في نشرتنا الإخبارية' : 'Subscribe to Our Newsletter'}
          </h3>
          <p className="mb-10 md:mb-14 max-w-2xl mx-auto text-lg md:text-xl font-light leading-[1.8]" style={{ color: 'var(--text3)' }}>
            {lang === 'fr'
              ? "Recevez les dernières analyses immobilières de Dubaï, conseils d'investissement et actualités du marché directement dans votre boîte mail."
              : lang === 'ar'
              ? "احصل على أحدث تحليلات العقارات في دبي ونصائح الاستثمار وتحديثات السوق مباشرة في بريدك الإلكتروني."
              : "Get the latest Dubai real estate insights, investment tips, and market updates delivered directly to your inbox."
            }
          </p>
          <form className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4 md:gap-6" onSubmit={e => e.preventDefault()}>
            <input 
              type="email" 
              placeholder={lang === 'fr' ? 'Votre adresse email' : lang === 'ar' ? 'بريدك الإلكتروني' : 'Your email address'}
              className="flex-1 border-b-2 px-4 py-4 text-lg font-light focus:outline-none transition-colors focus:border-accent bg-transparent"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            />
            <button type="submit" className="btn-gold sm:w-auto w-full flex items-center justify-center gap-4">
              {lang === 'fr' ? "S'abonner" : lang === 'ar' ? 'اشتراك' : 'Subscribe'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
