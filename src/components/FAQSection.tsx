import React, { useState } from 'react';

export interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
}

const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mt-12 pt-12 border-t border-gray-200 dark:border-gray-800">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 font-mono">Frequently Asked Questions</h3>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-dark-950">
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full text-left p-4 flex justify-between items-center focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              aria-expanded={openIndex === idx}
            >
              <span className="font-bold text-gray-800 dark:text-gray-200 font-mono">{faq.question}</span>
              <span className="text-brand-500 text-xl">{openIndex === idx ? '−' : '+'}</span>
            </button>
            {openIndex === idx && (
              <div className="p-4 pt-0 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-dark-900/50">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
