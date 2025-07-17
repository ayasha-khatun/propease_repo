import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';

const MyProperties = () => {
  const { user } = useAuth;
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:5000/properties/agent/${user.email}`)
        .then((res) => {
          setProperties(res.data);
        })
        .catch((err) => {
          console.error('Error fetching agent properties:', err);
        });
    }
  }, [user]);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this property?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5000/properties/${id}`)
          .then(() => {
            Swal.fire('Deleted!', 'Your property has been deleted.', 'success');
            setProperties(properties.filter((item) => item._id !== id));
          })
          .catch((err) => {
            console.error('Delete error:', err);
            Swal.fire('Error', 'Failed to delete property.', 'error');
          });
      }
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Added Properties</h2>
      {properties.length === 0 ? (
        <p>No properties added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {properties.map((property) => (
            <div key={property._id} className="border rounded-lg p-4 shadow">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h3 className="text-xl font-semibold mb-1">{property.title}</h3>
              <p className="text-gray-600">📍 {property.location}</p>
              <p className="text-sm mt-1">👤 Agent: {property.agentName}</p>
              <p className="text-sm">📧 {property.agentEmail}</p>
              <p className="text-sm">
                💰 Price Range: ${property.priceMin} - ${property.priceMax}
              </p>
              <p className="text-sm">
                🔍 Verification Status:{' '}
                <span
                  className={`font-semibold ${
                    property.status === 'pending'
                      ? 'text-yellow-500'
                      : property.status === 'verified'
                      ? 'text-green-600'
                      : 'text-red-500'
                  }`}
                >
                  {property.status}
                </span>
              </p>

              <div className="mt-3 flex gap-3">
                {property.status !== 'rejected' && (
                  <Link to={`/dashboard/agent/update/${property._id}`}>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                      Update
                    </button>
                  </Link>
                )}
                <button
                  onClick={() => handleDelete(property._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProperties;
