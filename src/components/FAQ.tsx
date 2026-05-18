import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function FAQ() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // ─── LANGUAGE-SPECIFIC FAQ DATA ───
  const faqData = {
    en: {
      tag: 'FAQ',
      title: 'Your questions.',
      titleEm: 'Clear answers.',
      faqs: [
        {
          q: 'What is the Golden Visa in Dubai?',
          a: 'The Golden Visa is a 10-year UAE residency visa for real estate investors starting from AED 545,000. We handle 100% of the administrative process for you.'
        },
        {
          q: 'How long does the investment process take?',
          a: 'Typically 4-8 weeks depending on the property type (off-plan or ready) and payment method. Our team legally secures each step to expedite the transaction.'
        },
        {
          q: 'Can I obtain bank financing?',
          a: 'Absolutely. Most properties can be financed through UAE banks with a 20-50% down payment depending on your profile. We connect you with our banking partners.'
        },
        {
          q: 'What are the additional fees for purchasing?',
          a: 'Expect around 4% registration fees (DLD), 2% agency fees, and minor administrative costs. There are NO taxes on capital gains or rental income thereafter.'
        },
        {
          q: 'Is it safe to invest off-plan?',
          a: 'Yes, thanks to the Escrow Account system regulated by RERA. Money paid to the developer is locked by the government until certified construction progress.'
        },
        {
          q: 'What net rental yield can I expect?',
          a: 'Our investors target a net rental yield of 6-8% annually. Short-term rentals (Airbnb) in premium areas can even exceed 10%.'
        },
        {
          q: 'Do I need to be a UAE resident to invest?',
          a: 'No. Foreign nationals can purchase freehold properties in designated areas of Dubai without residency requirements.'
        },
        {
          q: 'Can MoveSmart help with company formation?',
          a: 'Yes. We offer full business setup services: company registration, UAE residency visas, bank account opening, and tax structuring.'
        }
      ]
    },
    fr: {
      tag: 'FAQ',
      title: 'Vos questions.',
      titleEm: 'Nos réponses claires.',
      faqs: [
        {
          q: 'Qu\'est-ce que le Golden Visa à Dubaï ?',
          a: 'Le Golden Visa est un visa de résidence aux EAU valide pour 10 ans. Il est destiné aux investisseurs immobiliers à partir de 545 000 AED. Nous nous chargeons de 100% de la procédure administrative.'
        },
        {
          q: 'Combien de temps prend le processus d\'investissement ?',
          a: 'Généralement entre 4 et 8 semaines selon le type de bien (off-plan ou prêt) et le mode de paiement. Notre équipe sécurise juridiquement chaque étape pour accélérer la transaction.'
        },
        {
          q: 'Puis-je obtenir un financement bancaire ?',
          a: 'Absolument. La plupart des biens peuvent être financés via des banques émiraties avec un acompte de 20% à 50% selon votre profil. Nous vous mettons en relation avec nos partenaires bancaires.'
        },
        {
          q: 'Quels sont les frais annexes à l\'achat ?',
          a: 'Prévoyez environ 4% de frais d\'enregistrement (DLD), 2% de frais d\'agence, et quelques frais administratifs mineurs. Il n\'y a AUCUNE taxe sur la plus-value ou les revenus locatifs par la suite.'
        },
        {
          q: 'Est-il sécurisé d\'investir sur plan (Off-Plan) ?',
          a: 'Oui, grâce au système de comptes séquestres (Escrow Accounts) régulé par la RERA. L\'argent versé au promoteur est bloqué par le gouvernement jusqu\'à l\'avancement certifié des travaux.'
        },
        {
          q: 'Quel rendement locatif net puis-je espérer ?',
          a: 'Nos investisseurs ciblent un rendement locatif net de 6% à 8% par an. Les locations courte durée (Airbnb) dans les quartiers premium peuvent même dépasser les 10%.'
        },
        {
          q: 'Dois-je être résident des EAU pour investir ?',
          a: 'Non. Les étrangers peuvent acheter des biens en pleine propriété dans les zones désignées de Dubaï sans exigence de résidence.'
        },
        {
          q: 'MoveSmart aide-t-il à créer une entreprise ?',
          a: 'Oui. Nous offrons des services complets de création d\'entreprise : enregistrement de société, visas de résidence UAE, ouverture de compte bancaire, et structuration fiscale.'
        }
      ]
    },
    ar: {
      tag: 'الأسئلة الشائعة',
      title: 'أسئلتك.',
      titleEm: 'إجابات واضحة.',
      faqs: [
        {
          q: 'ما هي التأشيرة الذهبية في دبي؟',
          a: 'التأشيرة الذهبية هي تأشيرة إقامة في الإمارات لمدة 10 سنوات للمستثمرين العقاريين ابتداءً من 545,000 درهم إماراتي. نحن نتولى 100٪ من الإجراءات الإدارية نيابة عنك.'
        },
        {
          q: 'كم من الوقت تستغرق عملية الاستثمار؟',
          a: 'عادة من 4 إلى 8 أسابيع حسب نوع العقار (على الخريطة أو جاهز) وطريقة الدفع. فريقنا يؤمن كل خطوة قانونيًا لتسريع المعاملة.'
        },
        {
          q: 'هل يمكنني الحصول على تمويل بنكي؟',
          a: 'بالتأكيد. يمكن تمويل معظم العقارات من خلال البنوك الإماراتية بدفعة أولى من 20-50٪ حسب ملفك الشخصي. نحن نربطك بشركائنا المصرفيين.'
        },
        {
          q: 'ما هي الرسوم الإضافية للشراء؟',
          a: 'توقع حوالي 4٪ رسوم تسجيل (DLD)، 2٪ رسوم وكالة، وتكاليف إدارية بسيطة. لا توجد ضرائب على الأرباح الرأسمالية أو دخل الإيجار بعد ذلك.'
        },
        {
          q: 'هل من الآمن الاستثمار على الخريطة؟',
          a: 'نعم، بفضل نظام حسابات الضمان (Escrow) المنظم من قبل RERA. الأموال المدفوعة للمطور محظورة من قبل الحكومة حتى التقدم المعتمد في البناء.'
        },
        {
          q: 'ما هو صافي العائد الإيجاري الذي يمكنني توقعه؟',
          a: 'يستهدف مستثمرونا صافي عائد إيجاري من 6-8٪ سنويًا. يمكن للإيجارات قصيرة الأجل (Airbnb) في المناطق المميزة أن تتجاوز 10٪.'
        },
        {
          q: 'هل أحتاج إلى أن أكون مقيمًا في الإمارات للاستثمار؟',
          a: 'لا. يمكن للأجانب شراء عقارات في مناطق محددة في دبي دون متطلبات الإقامة.'
        },
        {
          q: 'هل تساعد MoveSmart في تأسيس الشركات؟',
          a: 'نعم. نقدم خدمات كاملة لإنشاء الأعمال: تسجيل الشركة، تأشيرات الإقامة في الإمارات، فتح الحساب البنكي، والهيكلة الضريبية.'
        }
      ]
    }
  };

  const currentData = faqData[lang] || faqData.en;

  return (
    <div className="py-40" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="text-center mb-32 animate-fade-in delay-100">
          <span className="tag-gold">
            {currentData.tag}
          </span>
          <h2 className="text-5xl md:text-8xl tracking-tighter mb-10 leading-[1.05]" style={{ color: 'var(--text)' }}>
            {currentData.title}<br/>
            <span className="text-accent font-serif-italic">{currentData.titleEm}</span>
          </h2>
        </div>

        <div className="space-y-6">
          {currentData.faqs.map((faq, index) => (
            <div 
              key={index}
              className="border-b transition-colors duration-400 animate-fade-in"
              style={{ 
                borderColor: openIndex === index ? 'var(--text)' : 'var(--border)', 
                backgroundColor: 'var(--bg)', 
                animationDelay: `${index * 50}ms` 
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-10 flex items-center justify-between text-left"
              >
                <span 
                  className="text-3xl md:text-4xl font-serif tracking-tighter pr-8 transition-colors" 
                  style={{ color: openIndex === index ? 'var(--text)' : 'var(--text3)' }}
                >
                  {faq.q}
                </span>
                <span 
                  className="w-16 h-16 border rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-500" 
                  style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                >
                  {openIndex === index ? (
                    <Minus className="w-6 h-6 text-accent" />
                  ) : (
                    <Plus className="w-6 h-6" style={{ color: 'var(--text3)' }} />
                  )}
                </span>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index ? 'max-h-[400px] pb-12 opacity-100' : 'max-h-0 pb-0 opacity-0'
                }`}
              >
                <p 
                  className="text-[17px] md:text-[21px] leading-[1.9] font-light max-w-4xl" 
                  style={{ color: 'var(--text3)' }}
                >
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
