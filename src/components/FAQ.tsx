import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "What is the Golden Visa in Dubai?",
    answer: "The Golden Visa is a UAE residency visa valid for 10 years. It's designed for investors, entrepreneurs, and professionals. We help you navigate the entire process from application to approval."
  },
  {
    question: "How long does the property investment process take?",
    answer: "Typically 4-8 weeks depending on property type, financing, and documentation. Our team manages all steps to ensure a smooth, faster process. We handle legal verification, escrow, and transfer documentation."
  },
  {
    question: "Can I get financing for property purchase?",
    answer: "Yes! Most properties can be financed through UAE banks with 20-50% down payment. We connect you with trusted lenders and help with the mortgage application process."
  },
  {
    question: "What are the additional costs beyond property price?",
    answer: "Typically 4-5% total: registration (4%), agency fee (2-2.5%), legal fees (1%), and inspection. We provide a detailed breakdown before any commitment."
  },
  {
    question: "Is it safe to invest in Dubai real estate?",
    answer: "Absolutely. Dubai has transparent regulations, strong legal protection, and stable appreciation. We only recommend properties that meet international standards. Portfolio diversification across multiple properties is common."
  },
  {
    question: "What's the rental yield potential?",
    answer: "Average gross yield is 5-7% depending on location and property type. Marina, JBR, and Downtown typically offer 4-6%, while emerging areas can offer 6-8%. Furnishing increases yield by 1-2%."
  },
  {
    question: "Do I need to visit Dubai before buying?",
    answer: "Not mandatory, but recommended. We offer virtual tours, video calls, and can arrange property viewings. Many clients complete purchases remotely with our full support."
  },
  {
    question: "What documents do I need for investment?",
    answer: "Passport, proof of income, bank statements, and ID. Requirements vary by property type and financing. We'll provide a complete checklist and guide through every step."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="py-24 bg-black">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-4">Questions?</p>
          <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-wider mb-6">Frequently Asked Questions</h2>
          <p className="text-gray-400">Everything you need to know about investing in Dubai</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="border border-white/10 rounded-lg bg-white/5 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/10 transition-colors text-left"
              >
                <span className="font-medium pr-4">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-amber-500 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-48 py-5 opacity-100 border-t border-white/10' : 'max-h-0 py-0 opacity-0'
                }`}
              >
                <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}