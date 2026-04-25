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
    <div className="py-32" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-24 animate-fade-in">
          <span className="inline-block mb-8 text-xs font-bold tracking-widest uppercase text-amber-500">
            {t('faq_tag', 'Foire Aux Questions')}
          </span>
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-wider mb-8" style={{ color: 'var(--text)' }}>
            Vos questions.<br/>
            <span className="text-amber-500">Nos réponses claires.</span>
          </h2>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="border transition-all duration-300 animate-fade-in"
              style={{ borderColor: openIndex === index ? 'var(--accent)' : 'var(--border)', backgroundColor: 'var(--bg)' }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-8 px-6 flex items-center justify-between transition-colors text-left"
                style={{ backgroundColor: openIndex === index ? 'var(--accent-bg)' : 'transparent' }}
              >
                <span className="text-xl font-bold tracking-wider uppercase pr-6" style={{ color: openIndex === index ? 'var(--text)' : 'var(--text3)' }}>
                  {faq.question}
                </span>
                <span className="w-8 h-8 flex items-center justify-center flex-shrink-0 transition-transform">
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-amber-500" />
                  ) : (
                    <Plus className="w-5 h-5" style={{ color: 'var(--text3)' }} />
                  )}
                </span>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out px-6 ${
                  openIndex === index ? 'max-h-64 pb-8 pt-4 opacity-100' : 'max-h-0 pb-0 pt-0 opacity-0'
                }`}
              >
                <p className="text-base leading-relaxed font-light font-sans" style={{ color: 'var(--text3)' }}>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
