import React from 'react';
import { FaShieldAlt, FaHome, FaUserTie } from 'react-icons/fa';

const WhyChooseUs = () => {
  return (
    <div className="w-full bg-white py-12">
      <h2 className="text-4xl font-bold text-center mb-10">🏆 Why Choose Us?</h2>
      <div className='max-w-7xl mx-auto px-4'>
        <div className="grid md:grid-cols-3 gap-8 text-center">
        <div className="p-6 shadow rounded bg-white">
          <FaShieldAlt className="text-4xl text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Trusted & Secure</h3>
          <p className="text-gray-600">
            We use secure authentication and admin verification to ensure safe and trusted listings.
          </p>
        </div>
        <div className="p-6 shadow rounded bg-white">
          <FaHome className="text-4xl text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Wide Property Selection</h3>
          <p className="text-gray-600">
            Explore a variety of verified properties across different locations and price ranges.
          </p>
        </div>
        <div className="p-6 shadow rounded bg-white">
          <FaUserTie className="text-4xl text-purple-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Verified Agents</h3>
          <p className="text-gray-600">
            Our agents go through a verification process to ensure professionalism and reliability.
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
