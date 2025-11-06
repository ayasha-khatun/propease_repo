// src/pages/Properties/AllPropertiesPage.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./../../Contexts/AuthContext/AuthContext";
import useAxiosSecure from "./../../hooks/useAxiosSecure";

const AllProperties = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState(""); // asc | desc
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Fetch verified properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axiosSecure.get("/verified-properties");
        setProperties(res.data);
        setFilteredProperties(res.data);
      } catch (error) {
        if (error.response?.status === 403) {
          alert("Access denied: You need admin permissions to view these properties.");
          navigate("/");
        } else {
          console.error("Failed to fetch properties:", error);
        }
      }
    };

    fetchProperties();
  }, [user, axiosSecure, navigate]);

  // Filter + Sort
  useEffect(() => {
    let updated = [...properties];

    // ✅ Filter by location
    if (searchTerm) {
      updated = updated.filter((p) =>
        p.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // ✅ Sort by min price (extracted from "1000-2000")
    if (sortOrder === "asc") {
      updated.sort((a, b) => {
        const minA = parseInt(a.priceRange?.split("-")[0]);
        const minB = parseInt(b.priceRange?.split("-")[0]);
        return minA - minB;
      });
    } else if (sortOrder === "desc") {
      updated.sort((a, b) => {
        const minA = parseInt(a.priceRange?.split("-")[0]);
        const minB = parseInt(b.priceRange?.split("-")[0]);
        return minB - minA;
      });
    }

    setFilteredProperties(updated);
  }, [searchTerm, sortOrder, properties]);

  const goToDetails = (id) => {
    navigate(`/property-details/${id}`);
  };

  return (
    <div className="p-4 mt-20">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        {/* Search by location */}
        <input
          type="text"
          placeholder="Search by location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full sm:w-1/2"
        />

        {/* Sort by price */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="select select-bordered w-full sm:w-1/4"
        >
          <option value="">Sort by price</option>
          <option value="asc">Lowest to Highest</option>
          <option value="desc">Highest to Lowest</option>
        </select>
      </div>

      {filteredProperties.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No verified properties found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => {
            const [minPrice, maxPrice] = property.priceRange
              ?.split("-")
              .map((p) => p.trim());

            return (
              <div
                key={property._id}
                className="card shadow-md rounded-lg overflow-hidden"
              >
                <img
                  src={property.image}
                  alt={property.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-bold">{property.title}</h2>
                  <p className="text-gray-600">{property.location}</p>

                  {/* Agent Info */}
                  <div className="flex items-center gap-2 mt-2">
                    <img
                      src={property.agentImage || "/default-avatar.png"}
                      alt={property.agentName}
                      className="h-8 w-8 rounded-full object-cover border"
                    />
                    <p className="font-medium">{property.agentName}</p>
                  </div>

                  <p className="mt-2">{property.verificationStatus}</p>

                  {/* ✅ Display price range properly */}
                  <p className="mt-1 font-semibold">
                    ${minPrice} - ${maxPrice}
                  </p>

                  <button
                    onClick={() => goToDetails(property._id)}
                    className="mt-3 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded hover:opacity-90"
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllProperties;