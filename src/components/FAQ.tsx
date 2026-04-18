import { useState } from 'react';
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
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 sm:py-32 px-6 md:px-10 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-8 bg-amber-500" />
            <span className="text-amber-600 text-xs tracking-[0.2em] uppercase font-semibold">Questions?</span>
            <div className="h-px w-8 bg-amber-500" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about investing in Dubai
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-2xl overflow-hidden bg-white hover:shadow-md transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 md:px-8 py-5 md:py-6 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
              >
                <span className="text-base md:text-lg font-semibold text-gray-900">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-amber-600 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 md:px-8 py-4 md:py-6 bg-gray-50 border-t border-gray-200">
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
