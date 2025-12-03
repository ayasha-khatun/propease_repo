import React, { useState } from "react";

const faqs = [
  {
    question: "How do I book a property?",
    answer:
      "Simply browse our listed properties, click on the property details page, and make an offer or contact the agent directly.",
  },
  {
    question: "Is there any service fee?",
    answer:
      "Propease does not charge users directly. Agents may have their own service fees based on agreements.",
  },
  {
    question: "Are all properties verified?",
    answer:
      "Yes! Every property is reviewed and verified by our admin team before being published.",
  },
  {
    question: "Can I list my own property?",
    answer:
      "Absolutely. Register as an agent and list your property through your dashboard.",
  },
  {
    question: "Is my personal data safe?",
    answer:
      "We use secure authentication and encryption to protect your information at all times.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-gray-50 dark:bg-gray-900 py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-10 text-gray-900 dark:text-gray-100">
          ❓ Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center px-6 py-4 text-left text-lg font-medium text-gray-900 dark:text-gray-100 focus:outline-none"
              >
                {faq.question}
                <span className="text-2xl">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>

              <div
                className={`px-6 pb-4 text-gray-700 dark:text-gray-300 overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
