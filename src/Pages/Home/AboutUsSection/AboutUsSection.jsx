import React from "react";
import { Link } from "react-router-dom"; // ✅ Fixed router import

const AboutUsSection = () => {
  return (
    <section className="w-full bg-white dark:bg-gray-900 py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-6">
        
        {/* Left Image */}
        <div>
          <img
            src="https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="About Us"
            className="w-full h-80 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Right Content */}
        <div>
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            About Propease
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            At{" "}
            <span className="font-semibold text-primary dark:text-secondary">
              Propease
            </span>
            , we are dedicated to connecting people with their dream properties.
            With a trusted network of professional agents and a seamless digital
            platform, we ensure a smooth buying, selling, and renting
            experience.
            <br />
            <br />
            Our mission is to make real estate simple, transparent, and
            accessible for everyone.
          </p>

          <Link to="/all-properties">
            <button className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg font-medium shadow-md hover:opacity-90 transition">
              Learn More
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
