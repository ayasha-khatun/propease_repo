// src/pages/AgentDashboard/MyProperties.jsx
import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const MyProperties = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null); // Update modal
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch properties added by agent
  const fetchProperties = async () => {
    if (!user?.email) return;
    try {
      const res = await axiosSecure.get(`/properties/agent/${user.email}`);
      setProperties(res.data);
    } catch (err) {
      console.error("Property fetch error:", err);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [user?.email]);

  // Delete property
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This property will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/properties/${id}`);
          Swal.fire("Deleted!", "Property has been deleted.", "success");
          fetchProperties(); // refresh
        } catch (err) {
          console.error("Delete error:", err);
          Swal.fire("Error!", "Failed to delete property.", "error");
        }
      }
    });
  };

  // Open update modal
  const openUpdateModal = (property) => {
    setSelectedProperty(property);
    setModalOpen(true);
  };

  // Update property
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const { _id, title, location, image, priceRange } = selectedProperty;
      await axiosSecure.patch(`/properties/${_id}`, {
        title,
        location,
        image,
        priceRange,
      });
      Swal.fire("Updated!", "Property has been updated.", "success");
      setModalOpen(false);
      fetchProperties();
    } catch (err) {
      console.error("Update error:", err);
      Swal.fire("Error!", "Failed to update property.", "error");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Added Properties</h2>

      {properties.length === 0 ? (
        <p>No properties added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((property) => (
            <div
              key={property._id}
              className="border rounded p-4 shadow flex flex-col"
            >
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-40 object-cover mb-2"
              />
              <h3 className="text-lg font-semibold">{property.title}</h3>
              <p>
                <strong>Location:</strong> {property.location}
              </p>
              <p>
                <strong>Agent:</strong> {property.agentName}
              </p>
              <p>
                <strong>Status:</strong> {property.verificationStatus}
              </p>
              <p>
                <strong>Price Range:</strong> {property.priceRange}
              </p>

              <div className="mt-auto flex gap-2 pt-2">
                {property.verificationStatus !== "rejected" && (
                  <button
                    onClick={() => openUpdateModal(property)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Update
                  </button>
                )}
                <button
                  onClick={() => handleDelete(property._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update Modal */}
      {modalOpen && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-96 relative">
            <h3 className="text-xl font-bold mb-4">Update Property</h3>
            <form onSubmit={handleUpdateSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Title"
                value={selectedProperty.title}
                onChange={(e) =>
                  setSelectedProperty({
                    ...selectedProperty,
                    title: e.target.value,
                  })
                }
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Location"
                value={selectedProperty.location}
                onChange={(e) =>
                  setSelectedProperty({
                    ...selectedProperty,
                    location: e.target.value,
                  })
                }
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={selectedProperty.image}
                onChange={(e) =>
                  setSelectedProperty({
                    ...selectedProperty,
                    image: e.target.value,
                  })
                }
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Price Range"
                value={selectedProperty.priceRange}
                onChange={(e) =>
                  setSelectedProperty({
                    ...selectedProperty,
                    priceRange: e.target.value,
                  })
                }
                className="border p-2 rounded"
              />
              <input
                type="text"
                value={selectedProperty.agentName}
                readOnly
                className="border p-2 rounded bg-gray-100"
              />
              <input
                type="text"
                value={selectedProperty.agentEmail}
                readOnly
                className="border p-2 rounded bg-gray-100"
              />

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1 rounded border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 rounded bg-gradient-to-r from-primary to-secondary text-white"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProperties;
