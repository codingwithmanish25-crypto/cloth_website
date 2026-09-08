'use client';

import React, { useState } from 'react';

const defaultFaqs = [
  { question: "How do I place an order?", answer: "Browse products, select your preferred size, and click 'Add to Cart'. Go to checkout to complete payment." },
  { question: "What payment methods do you accept?", answer: "We accept UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery (COD)." },
  { question: "Can I buy cash on delivery?", answer: "Yes, COD is available on almost all pincodes across India." },
  { question: "Can I cancel or modify my order after placing it?", answer: "Orders can be canceled within 2 hours of placement via account panel or support team." },
  { question: "Do you ship across India?", answer: "Yes, we offer pan-India shipping with real-time tracking." },
];

const ProductFaq = ({ faqs = defaultFaqs }) => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="mt-16 border-t border-zinc-800 pt-12 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold uppercase tracking-wider text-center text-white mb-8">
        Frequently Asked Questions
      </h2>
      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border-b border-zinc-800 pb-3">
            <button
              onClick={() => toggleFaq(idx)}
              className="w-full flex justify-between items-center text-left text-sm font-medium py-2 text-zinc-300 hover:text-white transition"
            >
              <span>{faq.question}</span>
              <span className="text-lg font-light">{openFaq === idx ? "−" : "+"}</span>
            </button>
            {openFaq === idx && (
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed px-1">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductFaq;