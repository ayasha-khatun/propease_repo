import React from "react";
import { FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    name: "Sarah Karim",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    quote:
      "Finding my dream apartment was super easy here. Loved the verified listings and the agent was very professional!",
  },
  {
    name: "Tanvir Hossain",
    image: "https://randomuser.me/api/portraits/men/65.jpg",
    quote:
      "I’ve never seen such a clean, simple real estate platform before. The wishlist and offer system is amazing!",
  },
  {
    name: "Rina Akter",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    quote:
      "I bought a property directly through the dashboard! Everything was smooth and secure. Highly recommended.",
  },
];

const CustomerTestimonials = () => {
  return (
    <section className="w-full bg-gray-50 dark:bg-gray-900 py-16 transition-colors duration-300">
      <h2 className="text-4xl font-bold text-center mb-10 text-gray-900 dark:text-gray-100">
        💬 Customer Testimonials
      </h2>

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 px-4">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <FaQuoteLeft className="text-primary text-3xl mb-3" />
            <p className="text-gray-700 dark:text-gray-300 mb-4 italic leading-relaxed">
              “{testimonial.quote}”
            </p>

            <div className="flex items-center gap-3 mt-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover border dark:border-gray-700"
              />
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {testimonial.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CustomerTestimonials;
