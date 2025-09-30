// src/components/Home/AdvertisementSection.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdvertisementSection = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    axios.get("https://propease-server-side.vercel.app/advertised-properties") // ✅ public route
      .then(res => {
        const firstFour = res.data.slice(0, 4);
        setAds(firstFour);
      })
      .catch(err => console.error("Failed to load advertisements:", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-8">🏷️ Advertised Properties</h2>

      {ads.length === 0 ? (
        <p className="text-center text-gray-500">No advertised properties available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ads.map((property) => (
            <div
              key={property._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={property.image || '/no-image.jpg'}
                alt={property.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-1">{property.title}</h3>
                <p className="text-sm text-gray-600 mb-1">Location: {property.location}</p>
                <p className="text-sm text-gray-800 font-medium mb-2">
                  Price-Range: {property.priceRange}
                </p>
                <Link
                  to={`/property-details/${property._id}`}
                  className="block mt-4 text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdvertisementSection;
