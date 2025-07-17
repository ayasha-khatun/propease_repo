import React, { useEffect, useState} from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';

const ManageProperties = () => {
  const { user } = useAuth;
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all properties added by agents
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/admin/properties'); // Adjust endpoint as needed
      setProperties(res.data);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      Swal.fire('Error', 'Failed to load properties', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Verify a property
  const handleVerify = async (propertyId) => {
    try {
      const res = await axios.patch(`http://localhost:5000/admin/properties/${propertyId}/verify`);
      if (res.data.modifiedCount > 0) {
        Swal.fire('Verified!', 'Property has been verified.', 'success');
        fetchProperties();
      }
    } catch (error) {
      console.error('Verify error:', error);
      Swal.fire('Error', 'Failed to verify property', 'error');
    }
  };

  // Reject a property
  const handleReject = async (propertyId) => {
    try {
      const res = await axios.patch(`http://localhost:5000/admin/properties/${propertyId}/reject`);
      if (res.data.modifiedCount > 0) {
        Swal.fire('Rejected!', 'Property has been rejected.', 'success');
        fetchProperties();
      }
    } catch (error) {
      console.error('Reject error:', error);
      Swal.fire('Error', 'Failed to reject property', 'error');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading properties...</p>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Properties</h1>
      {properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Location</th>
                <th className="border px-4 py-2">Agent Name</th>
                <th className="border px-4 py-2">Agent Email</th>
                <th className="border px-4 py-2">Price Range</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{property.title}</td>
                  <td className="border px-4 py-2">{property.location}</td>
                  <td className="border px-4 py-2">{property.agentName}</td>
                  <td className="border px-4 py-2">{property.agentEmail}</td>
                  <td className="border px-4 py-2">{property.priceRange}</td>
                  <td className="border px-4 py-2 font-semibold">
                    {property.verificationStatus || 'pending'}
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    {property.verificationStatus === 'pending' && (
                      <>
                        <button
                          onClick={() => handleVerify(property._id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => handleReject(property._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {(property.verificationStatus === 'verified' || property.verificationStatus === 'rejected') && (
                      <span className="capitalize">{property.verificationStatus}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageProperties;
