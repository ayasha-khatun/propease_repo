// src/pages/Properties/AllPropertiesPage.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from './../../Contexts/AuthContext/AuthContext';
import useAxiosSecure from './../../hooks/useAxiosSecure';

const AllPropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const { user } = useContext(AuthContext); // user info
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch verified properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axiosSecure.get("/admin/verified-properties");
        setProperties(res.data);
      } catch (error) {
        if (error.response?.status === 403) {
          alert("Access denied: You need admin permissions to view these properties.");
          navigate("/"); // redirect non-admins
        } else {
          console.error("Failed to fetch properties:", error);
        }
      }
    };

    if (user) fetchProperties();
  }, [user, axiosSecure, navigate]);

  const goToDetails = (id) => {
    navigate(`/property-details/${id}`);
  };

  if (!user) return <p className="text-center mt-10">Please login to view properties.</p>;

  return (
    <div className="p-4">
      {properties.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No verified properties available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property._id} className="card shadow-md rounded-lg overflow-hidden">
              <img
                src={property.image}
                alt={property.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-bold">{property.title}</h2>
                <p className="text-gray-600">{property.location}</p>
                <p className="mt-2">
                  <strong>Agent:</strong> {property.agentName}
                </p>
                {property.agentImage && (
                  <img
                    src={property.agentImage}
                    alt={property.agentName}
                    className="h-10 w-10 rounded-full mt-1"
                  />
                )}
                <p className="mt-2">
                  <strong>Status:</strong> {property.verificationStatus}
                </p>
                <p className="mt-1">
                  <strong>Price Range:</strong> ${property.minPrice} - ${property.maxPrice}
                </p>
                <button
                  onClick={() => goToDetails(property._id)}
                  className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllPropertiesPage;
