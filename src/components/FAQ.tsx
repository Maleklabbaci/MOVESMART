import React, { useState } from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function FAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: t('faq_1_q', 'Qu\'est-ce que le Golden Visa à Dubaï ?'),
      answer: t('faq_1_a', 'Le Golden Visa est un visa de résidence aux EAU valide pour 10 ans. Il est destiné aux investisseurs immobiliers à partir de 545,000 AED. Nous nous chargeons de 100% de la procédure administrative.')
    },
    {
      question: t('faq_2_q', 'Combien de temps prend le processus d\'investissement ?'),
      answer: t('faq_2_a', 'Généralement entre 4 et 8 semaines selon le type de bien (off-plan ou prêt) et le mode de paiement. Notre équipe sécurise juridiquement chaque étape pour accélérer la transaction.')
    },
    {
      question: t('faq_3_q', 'Puis-je obtenir un financement bancaire ?'),
      answer: t('faq_3_a', 'Absolument. La plupart des biens peuvent être financés via des banques émiraties avec un acompte de 20% à 50% selon votre profil. Nous vous mettons en relation avec nos partenaires bancaires.')
    },
    {
      question: t('faq_4_q', 'Quels sont les frais annexes à l\'achat ?'),
      answer: t('faq_4_a', 'Prévoyez environ 4% de frais d\'enregistrement (DLD), 2% de frais d\'agence, et quelques frais administratifs mineurs. Il n\'y a AUCUNE taxe sur la plus-value ou les revenus locatifs par la suite.')
    },
    {
      question: t('faq_5_q', 'Est-il sécurisé d\'investir sur plan (Off-Plan) ?'),
      answer: t('faq_5_a', 'Oui, grâce au système de comptes séquestres (Escrow Accounts) régulé par la RERA. L\'argent versé au promoteur est bloqué par le gouvernement jusqu\'à l\'avancement certifié des travaux.')
    },
    {
      question: t('faq_6_q', 'Quel rendement locatif net puis-je espérer ?'),
      answer: t('faq_6_a', 'Nos investisseurs ciblent un rendement locatif net de 6% à 8% par an. Les locations courte durée (Airbnb) dans les quartiers premium peuvent même dépasser les 10%.')
    }
  ];

  return (
    <div className="py-40" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="text-center mb-32 animate-fade-in delay-100">
          <span className="tag-gold">
            {t('faq_tag', 'Foire Aux Questions')}
          </span>
          <h2 className="text-5xl md:text-8xl tracking-tighter mb-10 leading-[1.05]" style={{ color: 'var(--text)' }}>
            Vos questions.<br/>
            <span className="text-accent font-serif-italic">Nos réponses claires.</span>
          </h2>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="border-b transition-colors duration-400 animate-fade-in"
              style={{ borderColor: openIndex === index ? 'var(--text)' : 'var(--border)', backgroundColor: 'var(--bg)', animationDelay: `${index * 50}ms` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-10 flex items-center justify-between text-left"
              >
                <span className="text-3xl md:text-4xl font-serif tracking-tighter pr-8 transition-colors" style={{ color: openIndex === index ? 'var(--text)' : 'var(--text3)' }}>
                  {faq.question}
                </span>
                <span className="w-16 h-16 border rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-500" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
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
                <p className="text-[17px] md:text-[21px] leading-[1.9] font-light max-w-4xl" style={{ color: 'var(--text3)' }}>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
