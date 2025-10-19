import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
  {
    name: 'Sarah Karim',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    quote:
      'Finding my dream apartment was super easy here. Loved the verified listings and the agent was very professional!',
  },
  {
    name: 'Tanvir Hossain',
    image: 'https://randomuser.me/api/portraits/men/65.jpg',
    quote:
      'I’ve never seen such a clean, simple real estate platform before. The wishlist and offer system is amazing!',
  },
  {
    name: 'Rina Akter',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    quote:
      'I bought a property directly through the dashboard! Everything was smooth and secure. Highly recommended.',
  },
];

const CustomerTestimonials = () => {
  return (
    <div className="bg-white py-12 px-4">
      <h2 className="text-4xl font-bold text-center mb-10">💬 Customer Testimonials</h2>
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <FaQuoteLeft className="text-blue-500 text-2xl mb-3" />
            <p className="text-gray-700 mb-4">"{testimonial.quote}"</p>
            <div className="flex items-center gap-3">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover border"
              />
              <span className="font-medium text-gray-800">{testimonial.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerTestimonials;
