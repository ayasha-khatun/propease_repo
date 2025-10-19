// src/components/Home/AdvertisementSection.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdvertisementSection = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    axios
      .get("https://propease-server-side.vercel.app/advertised-properties")
      .then((res) => {
        const firstFour = res.data.slice(0, 4);
        setAds(firstFour);
      })
      .catch((err) => console.error("Failed to load advertisements:", err));
  }, []);

  return (
    <div className="w-full py-16 bg-gray-50">
      <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">
        Advertised Properties
      </h2>

      <div className="max-w-7xl mx-auto px-4">
        {ads.length === 0 ? (
          <p className="text-center text-gray-500">
            No advertised properties available.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {ads.map((property) => (
              <div
                key={property._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-transform transform hover:-translate-y-2 hover:shadow-2xl duration-300"
              >
                <img
                  src={property.image || '/no-image.jpg'}
                  alt={property.title}
                  className="w-full h-52 object-cover"
                />

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold mb-1 text-gray-900">
                    {property.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {property.location}
                  </p>
                  <p className="text-sm text-gray-700 font-medium mb-3">
                    {property.priceRange}
                  </p>

                  {/* Spacer to push button to bottom */}
                  <div className="flex-grow"></div>

                  <Link
                    to={`/property-details/${property._id}`}
                    className="mt-4 block text-center text-white font-medium py-2 rounded-md 
                    bg-gradient-to-r from-primary to-secondary
                    transition-all duration-300 shadow-md"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvertisementSection;
