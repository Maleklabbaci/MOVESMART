import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const getArticles = (lang: string) => [
  {
    id: 1,
    title: lang === 'fr' ? "Guide complet du Golden Visa Dubaï 2025" : lang === 'ar' ? "الدليل الكامل للتأشيرة الذهبية دبي 2025" : "Complete Guide to Golden Visa Dubai 2025",
    excerpt: lang === 'fr' ? "Tout savoir sur le programme Golden Visa des Émirats : conditions d'éligibilité, étapes et avantages de cette résidence de 10 ans." : lang === 'ar' ? "تعرف على كل ما يخص برنامج التأشيرة الذهبية الإماراتية، شروط الأهلية، وكيفية التقديم للإقامة لمدة 10 سنوات." : "Learn everything about UAE's Golden Visa program, eligibility requirements, and how to apply for this 10-year residency.",
    content: lang === 'fr' 
      ? "Le programme Golden Visa des Émirats Arabes Unis est une excellente opportunité pour les investisseurs et professionnels qualifiés. Cette résidence de 10 ans offre de nombreux avantages, notamment la possibilité de vivre et de travailler aux Émirats sans avoir besoin d'un sponsor local.\n\nPour être éligible, vous devez soit investir un minimum dans l'immobilier, soit avoir un revenu mensuel substantiel, soit être un entrepreneur établi. Les conditions varient selon votre profil professionnel.\n\nLe processus de demande est généralement simple et peut être complété en quelques semaines. Il faudra préparer vos documents financiers, vos qualifications professionnelles et passer les vérifications de sécurité standard.\n\nLes avantages incluent l'accès au marché du travail sans restrictions, la possibilité de voyager librement et une excellente qualité de vie dans l'une des villes les plus dynamiques du monde."
      : lang === 'ar'
      ? "برنامج التأشيرة الذهبية الإماراتية يوفر فرصة ممتازة للمستثمرين والمتخصصين المؤهلين. تمنحك هذه الإقامة لمدة 10 سنوات العديد من المزايا، بما في ذلك إمكانية العيش والعمل في الإمارات دون الحاجة إلى كفيل محلي.\n\nللتأهل، يجب أن تستثمر الحد الأدنى في العقارات، أو تحصل على دخل شهري كبير، أو تكون رائد أعمال مؤسس. تختلف الشروط حسب ملفك الوظيفي.\n\nعملية التقديم عادة ما تكون بسيطة ويمكن إكمالها في غضون بضعة أسابيع. سيتعين عليك إعداد وثائقك المالية ومؤهلاتك المهنية والخضوع للتحقق الأمني القياسي.\n\nتشمل المزايا الوصول إلى سوق العمل بدون قيود والقدرة على السفر بحرية وجودة حياة ممتازة في واحدة من أكثر المدن ديناميكية في العالم."
      : "The UAE Golden Visa program is an excellent opportunity for investors and qualified professionals. This 10-year residency offers numerous benefits, including the ability to live and work in the Emirates without needing a local sponsor.\n\nTo be eligible, you must either invest a minimum in real estate, have substantial monthly income, or be an established entrepreneur. Requirements vary based on your professional profile.\n\nThe application process is usually straightforward and can be completed within weeks. You'll need to prepare your financial documents, professional qualifications, and pass standard security checks.\n\nBenefits include unrestricted access to the job market, freedom to travel, and an excellent quality of life in one of the world's most dynamic cities.",
    author: "Sarah Al Mansoori",
    date: lang === 'fr' ? "15 Avril 2025" : lang === 'ar' ? "15 أبريل 2025" : "April 15, 2025",
    category: lang === 'fr' ? "Visa" : lang === 'ar' ? "تأشيرة" : "Visa",
    image: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 2,
    title: lang === 'fr' ? "Tendances de l'immobilier à Dubaï en 2025" : lang === 'ar' ? "اتجاهات سوق العقارات في دبي 2025" : "Dubai Real Estate Investment Trends 2025",
    excerpt: lang === 'fr' ? "Découvrez les dernières tendances du marché immobilier de Dubaï, les quartiers émergents et les opportunités d'investissement en 2025." : lang === 'ar' ? "اكتشف أحدث اتجاهات سوق العقارات في دبي، الأحياء الناشئة، وفرص الاستثمار لعام 2025." : "Discover the latest trends in Dubai property market, emerging neighborhoods, and investment opportunities for 2025.",
    content: lang === 'fr'
      ? "Le marché immobilier de Dubaï continue de montrer une croissance remarquable en 2025. Les tendances clés incluent l'augmentation de la demande pour les propriétés durables et les smart homes.\n\nLes quartiers comme Dubai South et Sobha Hartland émergent comme les destinations privilégiées des investisseurs. Ces zones offrent un excellent rapport qualité-prix et un fort potentiel d'appréciation.\n\nLes investisseurs avisés se tournent également vers les projets de développement à long terme, qui promettent des rendements locatifs attrayants.\n\nLes prix restent compétitifs par rapport aux années précédentes, ce qui en fait une excellente période pour entrer sur le marché. L'infrastructure continue de s'améliorer avec de nouvelles lignes de métro et des espaces commerciaux de classe mondiale."
      : lang === 'ar'
      ? "يستمر سوق العقارات في دبي في إظهار نمو ملحوظ في عام 2025. تشمل الاتجاهات الرئيسية زيادة الطلب على العقارات المستدامة والمنازل الذكية.\n\nتظهر أحياء مثل دبي ساوث وسوبها هارتلاند كوجهات مفضلة للمستثمرين. توفر هذه المناطق نسبة ممتازة من حيث القيمة مقابل السعر وقوة عالية للتقدير.\n\nيتجه المستثمرون الحكيمون أيضاً نحو مشاريع التطوير طويلة الأجل، التي تعد بعوائد إيجارية جذابة.\n\nتبقى الأسعار تنافسية مقارنة بالسنوات السابقة، مما يجعلها فترة ممتازة للدخول إلى السوق. تستمر البنية التحتية في التحسن مع خطوط مترو جديدة والمساحات التجارية من الدرجة الأولى."
      : "Dubai's real estate market continues to show remarkable growth in 2025. Key trends include increased demand for sustainable properties and smart homes.\n\nNeighborhoods like Dubai South and Sobha Hartland are emerging as preferred destinations for investors. These areas offer excellent value and strong appreciation potential.\n\nWise investors are also turning to long-term development projects, which promise attractive rental returns.\n\nPrices remain competitive compared to previous years, making it an excellent time to enter the market. Infrastructure continues to improve with new metro lines and world-class commercial spaces.",
    author: "Mohammed Al Hashmi",
    date: lang === 'fr' ? "10 Avril 2025" : lang === 'ar' ? "10 أبريل 2025" : "April 10, 2025",
    category: lang === 'fr' ? "Investissement" : lang === 'ar' ? "استثمار" : "Investment",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 3,
    title: lang === 'fr' ? "Marina vs Downtown Dubaï : Lequel choisir ?" : lang === 'ar' ? "مارينا مقابل وسط مدينة دبي: أيهما أفضل؟" : "Marina vs Downtown Dubai: Which is Better?",
    excerpt: lang === 'fr' ? "Comparez deux des quartiers les plus prisés de Dubaï : Marina et Downtown. Prix, style de vie et potentiel d'investissement." : lang === 'ar' ? "قارن بين حيّين من أشهر أحياء دبي: المارينا ووسط المدينة. تحليل الأسعار ونمط الحياة وإمكانات الاستثمار." : "Compare two of Dubai's most popular neighborhoods: Marina and Downtown. Analyze prices, lifestyle, and investment potential.",
    content: lang === 'fr'
      ? "La Marina et Downtown Dubai sont deux des quartiers les plus recherchés de la ville. Chacun offre des avantages distincts selon votre profil d'investisseur.\n\nLa Marina est connue pour son style de vie cosmopolite, ses restaurants de classe mondiale et ses vues spectaculaires sur l'eau. Les propriétés y sont généralement plus chères, mais offrent un rendement locatif stable grâce à la forte demande touristique.\n\nDowntown Dubai, d'autre part, est le cœur financier et commercial de Dubaï. Les prix y sont également élevés, mais les rendements locatifs peuvent être encore plus attrayants, particulièrement pour les studios et petits appartements.\n\nPour les investisseurs cherchant l'appréciation à long terme, Downtown pourrait être plus intéressant. Pour ceux qui privilégient la qualité de vie et un style cosmopolite, la Marina est le meilleur choix."
      : lang === 'ar'
      ? "المارينا ووسط مدينة دبي هما من أكثر الأحياء المطلوبة في المدينة. كل واحد منهما يوفر مزايا متميزة حسب ملف المستثمر الخاص بك.\n\nتشتهر المارينا بأسلوب حياة عالمي وأطعام من الدرجة الأولى ومناظر مذهلة على الماء. عادة ما تكون العقارات هناك أغلى ثمناً، لكنها توفر عائداً إيجارياً مستقراً بسبب الطلب السياحي القوي.\n\nمن ناحية أخرى، يعتبر وسط مدينة دبي مركز المالية والأعمال في دبي. تكون الأسعار هناك عالية أيضاً، لكن العوائد الإيجارية يمكن أن تكون جذابة حتى أكثر، خاصة للاستوديوهات والشقق الصغيرة.\n\nبالنسبة للمستثمرين الذين يبحثون عن التقدير طويل الأجل، قد تكون المدينة القديمة أكثر إثارة للاهتمام. بالنسبة لأولئك الذين يعطون الأولوية لجودة الحياة ونمط الحياة العالمي، فإن المارينا هي الخيار الأفضل."
      : "Marina and Downtown Dubai are two of the most sought-after neighborhoods in the city. Each offers distinct advantages depending on your investor profile.\n\nMarina is known for its cosmopolitan lifestyle, world-class restaurants, and spectacular waterfront views. Properties there are generally more expensive but offer stable rental returns due to strong tourist demand.\n\nDowntown Dubai, on the other hand, is the financial and commercial heart of Dubai. Prices are also high, but rental yields can be even more attractive, particularly for studios and small apartments.\n\nFor investors seeking long-term appreciation, Downtown might be more interesting. For those who prioritize lifestyle and cosmopolitan living, Marina is the better choice.",
    author: "Fatima Saeed",
    date: lang === 'fr' ? "5 Avril 2025" : lang === 'ar' ? "5 أبريل 2025" : "April 5, 2025",
    category: lang === 'fr' ? "Comparaison" : lang === 'ar' ? "مقارنة" : "Comparison",
    image: "https://images.pexels.com/photos/33669696/pexels-photo-33669696.jpeg"
  },
  {
    id: 4,
    title: lang === 'fr' ? "Comment calculer le rendement locatif à Dubaï" : lang === 'ar' ? "كيفية حساب العائد الإيجاري في دبي" : "How to Calculate Rental Yield on Dubai Properties",
    excerpt: lang === 'fr' ? "Maîtrisez le calcul du rendement locatif : formules, facteurs clés et stratégies pour maximiser vos revenus immobiliers." : lang === 'ar' ? "أتقن حساب العائد الإيجاري: التعلم الصيغ والعوامل المؤثرة والاستراتيجيات لتحقيق أقصى عائد." : "Master the art of calculating rental yield. Learn formulas, factors to consider, and strategies to maximize returns.",
    content: lang === 'fr'
      ? "Le rendement locatif est l'une des mesures les plus importantes pour évaluer la rentabilité d'un investissement immobilier. La formule de base est : (Loyer annuel / Prix d'achat) x 100.\n\nPar exemple, si vous achetez une propriété à 500 000 AED et que le loyer annuel est de 30 000 AED, votre rendement locatif brut est de 6%.\n\nCependant, vous devez également tenir compte des dépenses : taxe municipale, assurance, entretien et frais de gestion de propriété. Le rendement net sera inférieur au rendement brut.\n\nÀ Dubaï, un rendement locatif de 5-7% est considéré comme attrayant. Certains quartiers premium offrent des rendements plus bas (3-4%) mais avec une appréciation du capital plus importante.\n\nPour maximiser vos rendements, focalisez-vous sur les propriétés en forte demande, négociez les frais de gestion et envisagez les locations meublées pour les rendements plus élevés."
      : lang === 'ar'
      ? "العائد الإيجاري هو أحد أهم المقاييس لتقييم ربحية الاستثمار العقاري. الصيغة الأساسية هي: (الإيجار السنوي / سعر الشراء) × 100.\n\nعلى سبيل المثال، إذا اشتريت عقاراً بقيمة 500000 درهم والإيجار السنوي هو 30000 درهم، فإن العائد الإيجاري الإجمالي لديك هو 6%.\n\nومع ذلك، يجب أن تأخذ في الاعتبار أيضاً المصاريف: ضريبة البلدية والتأمين والصيانة ورسوم إدارة الملكية. سيكون العائد الصافي أقل من العائد الإجمالي.\n\nفي دبي، يعتبر العائد الإيجاري من 5-7% جذاباً. توفر بعض الأحياء الفاخرة عوائد أقل (3-4%) ولكن مع تقدير رأس مال أكبر.\n\nلتعظيم عوائدك، ركز على العقارات المطلوبة بقوة، وتفاوض على رسوم الإدارة واعتبر الإيجارات المفروشة للعوائد الأعلى."
      : "Rental yield is one of the most important measures for evaluating the profitability of real estate investment. The basic formula is: (Annual Rent / Purchase Price) x 100.\n\nFor example, if you buy a property for 500,000 AED and the annual rent is 30,000 AED, your gross rental yield is 6%.\n\nHowever, you must also account for expenses: municipal tax, insurance, maintenance, and property management fees. Net yield will be lower than gross yield.\n\nIn Dubai, a rental yield of 5-7% is considered attractive. Some premium neighborhoods offer lower yields (3-4%) but with greater capital appreciation.\n\nTo maximize your returns, focus on properties in strong demand, negotiate management fees, and consider furnished rentals for higher returns.",
    author: "Ahmed Al Khouri",
    date: lang === 'fr' ? "28 Mars 2025" : lang === 'ar' ? "28 مارس 2025" : "March 28, 2025",
    category: lang === 'fr' ? "Finance" : lang === 'ar' ? "تمويل" : "Finance",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 5,
    title: lang === 'fr' ? "Guide de l'expatrié : Vivre à Dubaï en tant qu'investisseur" : lang === 'ar' ? "دليل المغترب: العيش في دبي كمستثمر" : "Expat Guide: Living in Dubai as an Investor",
    excerpt: lang === 'fr' ? "Guide complet pour les expatriés s'installant à Dubaï : visa, banque, santé, éducation et conseils pratiques pour bien démarrer." : lang === 'ar' ? "دليل شامل للمغتربين القادمين إلى دبي: التأشيرة، البنوك، الرعاية الصحية، التعليم ونصائح عملية." : "Complete guide for expats moving to Dubai: visa, banking, healthcare, education, and lifestyle tips for newcomers.",
    content: lang === 'fr'
      ? "Vivre à Dubaï en tant qu'expatrié est une expérience enrichissante. La ville accueille une communauté internationale vibrant et dispose d'excellentes infrastructures.\n\nPour commencer, assurez-vous d'avoir votre visa en ordre. Les investisseurs immobiliers peuvent demander le Golden Visa qui offre une résidence de 10 ans.\n\nL'ouverture d'un compte bancaire est simple avec les documents appropriés. Les banques principales à Dubaï incluent Emirates NBD, ADIB et FAB.\n\nPour la santé, le système de santé de Dubaï est de classe mondiale. L'assurance maladie est obligatoire pour les résidents.\n\nL'éducation est un point fort avec plusieurs écoles internationales de renom. Les coûts de scolarité sont élevés mais la qualité est exceptionnelle.\n\nLa vie quotidienne est facile avec une excellente infrastructure de transport, des centres commerciaux modernes et une excellente gastronomie."
      : lang === 'ar'
      ? "العيش في دبي كمغترب هو تجربة مثيرة للاهتمام. تستقطب المدينة مجتمعاً دولياً نابضاً بالحياة وتتمتع بأنظمة تحتية ممتازة.\n\nللبدء، تأكد من أن تأشيرتك في الترتيب. يمكن للمستثمرين العقاريين التقديم للتأشيرة الذهبية التي توفر إقامة لمدة 10 سنوات.\n\nفتح حساب مصرفي أمر بسيط مع الوثائق المناسبة. تشمل البنوك الرئيسية في دبي الإمارات NBD و ADIB و FAB.\n\nبالنسبة للصحة، نظام الرعاية الصحية في دبي من الدرجة الأولى. التأمين الصحي إلزامي للمقيمين.\n\nالتعليم نقطة قوة مع عدة مدارس دولية مرموقة. تكاليف التعليم مرتفعة لكن الجودة استثنائية.\n\nالحياة اليومية سهلة مع بنية تحتية نقل ممتازة ومراكز تسوق حديثة وأطعام ممتازة."
      : "Living in Dubai as an expat is an enriching experience. The city hosts a vibrant international community and has excellent infrastructure.\n\nTo get started, make sure your visa is in order. Real estate investors can apply for the Golden Visa which offers 10-year residency.\n\nOpening a bank account is straightforward with proper documents. Major banks in Dubai include Emirates NBD, ADIB, and FAB.\n\nFor healthcare, Dubai's healthcare system is world-class. Health insurance is mandatory for residents.\n\nEducation is a strength with several renowned international schools. Tuition costs are high but quality is exceptional.\n\nDaily life is convenient with excellent transport infrastructure, modern shopping centers, and outstanding dining.",
    author: "Lisa Anderson",
    date: lang === 'fr' ? "20 Mars 2025" : lang === 'ar' ? "20 مارس 2025" : "March 20, 2025",
    category: lang === 'fr' ? "Mode de vie" : lang === 'ar' ? "أسلوب حياة" : "Lifestyle",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 6,
    title: lang === 'fr' ? "Financer votre bien immobilier à Dubaï : guide complet" : lang === 'ar' ? "تمويل عقارك في دبي: دليل شامل" : "Financing Your Dubai Property: Complete Walkthrough",
    excerpt: lang === 'fr' ? "Tout sur le financement immobilier à Dubaï : banques, conditions de prêt, taux d'intérêt et comment obtenir une approbation rapidement." : lang === 'ar' ? "كل ما تحتاج معرفته عن تمويل العقارات في دبي: البنوك، شروط القروض، معدلات الفائدة، والحصول على موافقة سريعة." : "Everything about Dubai property financing: banks, loan requirements, interest rates, and how to get approved quickly.",
    content: lang === 'fr'
      ? "Le financement immobilier est essentiel pour la plupart des investisseurs. À Dubaï, les banques offrent des options de prêt compétitives pour les propriétés résidentielles et commerciales.\n\nLes conditions typiques incluent : une mise de fonds de 20-30%, une période de prêt de 20-25 ans, et des taux d'intérêt actuellement autour de 3-4% pour les résidents.\n\nPour obtenir un prêt, vous aurez besoin : d'une preuve de revenu, d'une évaluation de la propriété, d'une vérification de crédit et de documents d'identification.\n\nLes principales banques offrant des prêts immobiliers incluent Waha Bank, ENBD et ADIB. Chaque banque a ses propres critères et taux.\n\nConseil : comparez les offres de plusieurs banques avant de vous engager. Les différences de taux même mineures peuvent économiser des milliers d'AED sur la durée du prêt.\n\nLe processus d'approbation prend généralement 4-6 semaines. Avec tous les documents prêts, cela peut être accéléré."
      : lang === 'ar'
      ? "التمويل العقاري ضروري لمعظم المستثمرين. في دبي، تقدم البنوك خيارات قروض تنافسية للعقارات السكنية والتجارية.\n\nتشمل الشروط النموذجية: دفعة أولى بنسبة 20-30٪، فترة قرض 20-25 سنة، ومعدلات فائدة حالية حول 3-4٪ للمقيمين.\n\nللحصول على قرض، ستحتاج إلى: إثبات الدخل، تقييم العقار، فحص الائتمان وأوراق الهوية.\n\nتشمل البنوك الرئيسية التي تقدم القروض العقارية: بنك واها و ENBD و ADIB. لكل بنك معاييره وأسعاره الخاصة.\n\nنصيحة: قارن العروض من عدة بنوك قبل الالتزام. حتى الفروقات الطفيفة في الأسعار يمكن أن توفر آلاف الدراهم على مدى فترة القرض.\n\nتستغرق عملية الموافقة عادة 4-6 أسابيع. مع توفر جميع الوثائق، يمكن تسريع ذلك."
      : "Real estate financing is essential for most investors. In Dubai, banks offer competitive loan options for residential and commercial properties.\n\nTypical conditions include: 20-30% down payment, 20-25 year loan period, and interest rates currently around 3-4% for residents.\n\nTo get a loan, you'll need: proof of income, property appraisal, credit check, and identification documents.\n\nMajor banks offering real estate loans include Waha Bank, ENBD, and ADIB. Each bank has its own criteria and rates.\n\nTip: Compare offers from multiple banks before committing. Even minor rate differences can save thousands of AED over the loan period.\n\nThe approval process typically takes 4-6 weeks. With all documents ready, this can be expedited.",
    author: "Rashid Al Maktoumi",
    date: lang === 'fr' ? "15 Mars 2025" : lang === 'ar' ? "15 مارس 2025" : "March 15, 2025",
    category: lang === 'fr' ? "Finance" : lang === 'ar' ? "تمويل" : "Finance",
    image: "https://images.pexels.com/photos/8293647/pexels-photo-8293647.jpeg"
  }
];

export default function BlogPost() {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const articles = getArticles(lang);

  const article = articles.find(a => a.id === parseInt(id || '0'));

  if (!article) {
    return (
      <div className="min-h-screen pt-40 pb-20 flex items-center justify-center" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
        <div className="text-center">
          <h1 className="text-4xl font-serif mb-4">404</h1>
          <p className="text-lg mb-8" style={{ color: 'var(--text3)' }}>
            {lang === 'fr' ? "Article non trouvé" : lang === 'ar' ? "المقالة غير موجودة" : "Article not found"}
          </p>
          <Link to="/blog" className="btn-gold inline-block">
            {lang === 'fr' ? "Retour au blog" : lang === 'ar' ? "العودة إلى المدونة" : "Back to Blog"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 md:pt-40 md:pb-40 overflow-x-hidden" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        
        {/* BACK LINK */}
        <Link to="/blog" className="inline-flex items-center gap-2 mb-12 hover:text-accent transition-colors" style={{ color: 'var(--text3)' }}>
          <ArrowLeft className="w-4 h-4" />
          {lang === 'fr' ? "Retour au blog" : lang === 'ar' ? "العودة إلى المدونة" : "Back to Blog"}
        </Link>

        {/* HERO IMAGE */}
        <div className="aspect-video mb-12 md:mb-16 overflow-hidden rounded-lg shadow-2xl animate-fade-in">
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* HEADER */}
        <div className="mb-12 md:mb-16 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex flex-wrap items-center gap-4 mb-6 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text3)' }}>
            <span className="px-4 py-2 border" style={{ borderColor: 'var(--border)' }}>
              {article.category}
            </span>
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-accent" /> {article.date}</span>
            <span className="flex items-center gap-2"><User className="w-4 h-4 text-accent" /> {article.author}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif tracking-tighter leading-[1.1] mb-8" style={{ color: 'var(--text)' }}>
            {article.title}
          </h1>

          <p className="text-lg md:text-xl font-light leading-[1.8] max-w-2xl" style={{ color: 'var(--text3)' }}>
            {article.excerpt}
          </p>
        </div>

        {/* CONTENT */}
        <div className="prose prose-invert max-w-none mb-12 md:mb-16 animate-fade-in" style={{ animationDelay: '200ms' }}>
          {article.content?.split('\n\n').map((paragraph, i) => (
            <p 
              key={i}
              className="text-base md:text-lg font-light leading-[1.8] mb-6 md:mb-8" 
              style={{ color: 'var(--text3)' }}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* SHARE */}
        <div className="py-8 md:py-12 border-t border-b mb-12 md:mb-16 flex flex-wrap items-center gap-6 animate-fade-in" style={{ borderColor: 'var(--border)' }}>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text3)' }}>
            {lang === 'fr' ? "Partager" : lang === 'ar' ? "شارك" : "Share"}
          </span>
          <div className="flex gap-4">
            <button className="p-3 border hover:border-accent transition-colors" style={{ borderColor: 'var(--border)' }}>
              <Share2 className="w-4 h-4 text-accent" />
            </button>
          </div>
        </div>

        {/* RELATED ARTICLES */}
        <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
          <h2 className="text-2xl md:text-4xl font-serif tracking-tight mb-10" style={{ color: 'var(--text)' }}>
            {lang === 'fr' ? "Articles similaires" : lang === 'ar' ? "مقالات ذات صلة" : "Related Articles"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.filter(a => a.id !== article.id).slice(0, 2).map(related => (
              <Link
                key={related.id}
                to={`/blog/${related.id}`}
                className="group card-border"
              >
                <div className="aspect-[4/3] overflow-hidden mb-6 bg-black/5">
                  <img 
                    src={related.image}
                    alt={related.title}
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                  />
                </div>
                <h3 className="text-lg font-serif tracking-tight mb-3 line-clamp-2 group-hover:text-accent transition-colors" style={{ color: 'var(--text)' }}>
                  {related.title}
                </h3>
                <p className="text-sm font-light leading-[1.6] line-clamp-2" style={{ color: 'var(--text3)' }}>
                  {related.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
