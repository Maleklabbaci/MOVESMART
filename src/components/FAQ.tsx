import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function FAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: t('faq_1_q', 'What is the Golden Visa in Dubai?'),
      answer: t('faq_1_a', 'The Golden Visa is a UAE residency visa valid for 10 years. It\'s designed for investors, entrepreneurs, and professionals. We help you navigate the entire process from application to approval.')
    },
    {
      question: t('faq_2_q', 'How long does the property investment process take?'),
      answer: t('faq_2_a', 'Typically 4-8 weeks depending on property type, financing, and documentation. Our team manages all steps to ensure a smooth, faster process. We handle legal verification, escrow, and transfer documentation.')
    },
    {
      question: t('faq_3_q', 'Can I get financing for property purchase?'),
      answer: t('faq_3_a', 'Yes! Most properties can be financed through UAE banks with 20-50% down payment. We connect you with trusted lenders and help with the mortgage application process.')
    },
    {
      question: t('faq_4_q', 'What are the additional costs beyond property price?'),
      answer: t('faq_4_a', 'Typically 4-5% total: registration (4%), agency fee (2-2.5%), legal fees (1%), and inspection. We provide a detailed breakdown before any commitment.')
    },
    {
      question: t('faq_5_q', 'Is it safe to invest in Dubai real estate?'),
      answer: t('faq_5_a', 'Absolutely. Dubai has transparent regulations, strong legal protection, and stable appreciation. We only recommend properties that meet international standards. Portfolio diversification across multiple properties is common.')
    },
    {
      question: t('faq_6_q', 'What\'s the rental yield potential?'),
      answer: t('faq_6_a', 'Average gross yield is 5-7% depending on location and property type. Marina, JBR, and Downtown typically offer 4-6%, while emerging areas can offer 6-8%. Furnishing increases yield by 1-2%.')
    }
  ];

  return (
    <div className="py-32" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-20 animate-fade-in">
          <p className="font-semibold uppercase tracking-[0.3em] text-[10px] mb-6 block text-gold">
            {t('faq_tag', 'Questions?')}
          </p>
          <h2 className="text-4xl md:text-6xl font-serif tracking-tight mb-8" style={{ color: 'var(--text)' }}>
            {t('faq_title', 'Frequently Asked Questions')}
          </h2>
          <p className="text-sm uppercase tracking-widest font-semibold" style={{ color: 'var(--text3)' }}>
            {t('faq_sub', 'Everything you need to know about investing in Dubai')}
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="border rounded transition-all duration-400 shadow-sm animate-fade-in"
              style={{ borderColor: openIndex === index ? 'var(--accent)' : 'var(--border)', backgroundColor: 'var(--bg)' }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-7 flex items-center justify-between transition-colors text-left"
                style={{ backgroundColor: openIndex === index ? 'var(--accent-bg)' : 'transparent' }}
              >
                <span className="font-serif text-xl tracking-tight pr-6" style={{ color: 'var(--text)' }}>{faq.question}</span>
                <ChevronDown 
                  className={`w-6 h-6 transition-transform duration-500 text-gold ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              
              <div 
                className={`px-8 overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index ? 'max-h-64 py-8 opacity-100 border-t' : 'max-h-0 py-0 opacity-0'
                }`}
                style={{ borderColor: 'var(--border)' }}
              >
                <p className="text-sm leading-[1.8] font-light" style={{ color: 'var(--text3)' }}>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
