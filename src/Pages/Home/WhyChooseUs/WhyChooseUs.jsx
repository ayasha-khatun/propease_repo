import React from 'react';
import { FaShieldAlt, FaHome, FaUserTie } from 'react-icons/fa';

const WhyChooseUs = () => {
  return (
    <section className="w-full bg-gray-50 dark:bg-gray-900 py-16 transition-colors duration-300">
      <h2 className="text-4xl font-bold text-center mb-10 text-gray-900 dark:text-gray-100">
        🏆 Why Choose Us?
      </h2>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          
          {/* Card 1 */}
          <div className="p-6 shadow-md rounded-lg bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-lg">
            <FaShieldAlt className="text-4xl text-blue-600 mx-auto mb-4 dark:text-blue-400" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Trusted & Secure
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              We use secure authentication and admin verification to ensure safe and trusted listings.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 shadow-md rounded-lg bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-lg">
            <FaHome className="text-4xl text-green-600 mx-auto mb-4 dark:text-green-400" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Wide Property Selection
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Explore a variety of verified properties across different locations and price ranges.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 shadow-md rounded-lg bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-lg">
            <FaUserTie className="text-4xl text-purple-600 mx-auto mb-4 dark:text-purple-400" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Verified Agents
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our agents go through a verification process to ensure professionalism and reliability.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
