import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const MyProperties = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/properties/agent/${user.email}`)
        .then(res => setProperties(res.data))
        .catch(err => console.error("Property fetch error:", err));
    }
  }, [user?.email, axiosSecure]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Added Properties</h2>
      {properties.length === 0 ? (
        <p>No properties added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map(property => (
            <div key={property._id} className="border rounded p-4 shadow">
              <img src={property.image} alt={property.title} className="w-full h-40 object-cover mb-2" />
              <h3 className="text-lg font-semibold">{property.title}</h3>
              <p><strong>Location:</strong> {property.location}</p>
              <p><strong>Price Range:</strong> {property.priceRange}</p>
              <p><strong>Status:</strong> {property.verificationStatus}</p>
              {/* Update and Delete Buttons (optional) */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProperties;
