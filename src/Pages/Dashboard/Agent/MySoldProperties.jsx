import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../../../hooks/useAuth';

const MySoldProperties = () => {
  const { user } = useAuth;
  const [soldProperties, setSoldProperties] = useState([]);

  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:5000/sold-properties/${user.email}`)
        .then((res) => {
          setSoldProperties(res.data);
        })
        .catch((error) => {
          console.error('Error fetching sold properties:', error);
        });
    }
  }, [user]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Sold Properties</h2>

      {soldProperties.length === 0 ? (
        <p>No sold properties yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Location</th>
                <th className="px-4 py-2 border">Buyer Name</th>
                <th className="px-4 py-2 border">Buyer Email</th>
                <th className="px-4 py-2 border">Sold Price</th>
              </tr>
            </thead>
            <tbody>
              {soldProperties.map((property, index) => (
                <tr key={property._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{property.title}</td>
                  <td className="px-4 py-2 border">{property.location}</td>
                  <td className="px-4 py-2 border">{property.buyerName}</td>
                  <td className="px-4 py-2 border">{property.buyerEmail}</td>
                  <td className="px-4 py-2 border">${property.offerAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MySoldProperties;
