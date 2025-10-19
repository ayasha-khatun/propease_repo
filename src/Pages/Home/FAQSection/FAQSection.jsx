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
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <section className="w-full bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-10">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg shadow-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center px-6 py-4 text-left text-lg font-medium focus:outline-none"
              >
                {faq.question}
                <span className="text-2xl">
                  {openIndex === index ? "-" : "+"}
                </span>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
