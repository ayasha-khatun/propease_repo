import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';

const AllProperties = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    axiosSecure.get('/properties')
      .then(res => setProperties(res.data))
      .catch(err => console.error('Failed to load properties:', err));
  }, [axiosSecure]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">All Verified Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(property => (
          <div key={property._id} className="border rounded-lg shadow-md p-4">
            <img
              src={property.image || '/no-image.png'}
              alt={property.title}
              className="h-48 w-full object-cover rounded mb-3"
            />
            <h3 className="text-xl font-semibold">{property.title}</h3>
            <p className="text-gray-600">📍 {property.location}</p>
            <div className="flex items-center mt-2 gap-2">
              <img
                src={property.agentImage || '/agent-placeholder.png'}
                alt="Agent"
                className="w-8 h-8 rounded-full border"
              />
              <p className="text-sm">👤 {property.agentName}</p>
            </div>
            <p className="text-sm mt-1">💰 ${property.priceMin} - ${property.priceMax}</p>
            <p className="text-sm mt-1 text-green-600 font-semibold capitalize">
              ✅ {property.verificationStatus}
            </p>
            <Link to={`/property-details/${property._id}`}>
              <button className="mt-3 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
                Details
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProperties;
