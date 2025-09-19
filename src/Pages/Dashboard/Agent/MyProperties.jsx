import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const MyProperties = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [properties, setProperties] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null); // property being edited

  // Fetch agent's properties
  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/properties/agent/${user.email}`)
        .then((res) => setProperties(res.data))
        .catch((err) => console.error("Property fetch error:", err));
    }
  }, [user?.email, axiosSecure]);

  // Delete property
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This property will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/properties/${id}`);
        if (res.data.deletedCount > 0) {
          setProperties((prev) => prev.filter((item) => item._id !== id));
          Swal.fire("Deleted!", "Your property has been removed.", "success");
        }
      } catch (err) {
        console.error("Delete error:", err);
        Swal.fire("Error!", "Failed to delete property.", "error");
      }
    }
  };

  // Submit update
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const updatedProperty = {
      image: form.image.value,
      title: form.title.value,
      location: form.location.value,
      agentName: user?.displayName,
      agentEmail: user?.email,
      minPrice: parseFloat(form.minPrice.value),
      maxPrice: parseFloat(form.maxPrice.value),
    };

    try {
      const res = await axiosSecure.put(
        `/properties/${editingProperty._id}`,
        updatedProperty
      );
      if (res.data.modifiedCount > 0) {
        Swal.fire("Updated!", "Property has been updated.", "success");
        // update UI
        setProperties((prev) =>
          prev.map((item) =>
            item._id === editingProperty._id
              ? { ...item, ...updatedProperty }
              : item
          )
        );
        setEditingProperty(null); // close modal
      }
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property._id}
              className="border rounded-2xl p-4 shadow hover:shadow-lg transition"
            >
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <h3 className="text-lg font-semibold">{property.title}</h3>
              <p>
                <strong>Location:</strong> {property.location}
              </p>
              <p>
                <strong>Agent:</strong> {property.agentName}
              </p>
              {property.agentImage && (
                <img
                  src={property.agentImage}
                  alt={property.agentName}
                  className="w-12 h-12 rounded-full border my-2"
                />
              )}
              <p>
                <strong>Price Range:</strong> ${property.minPrice} - $
                {property.maxPrice}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded text-white ${
                    property.verificationStatus === "pending"
                      ? "bg-yellow-500"
                      : property.verificationStatus === "verified"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {property.verificationStatus}
                </span>
              </p>

              <div className="flex gap-3 mt-4">
                {property.verificationStatus !== "rejected" && (
                  <button
                    onClick={() => setEditingProperty(property)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Update
                  </button>
                )}
                <button
                  onClick={() => handleDelete(property._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update Modal */}
      {editingProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Update Property</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-3">
              <input
                type="text"
                name="image"
                defaultValue={editingProperty.image}
                placeholder="Image URL"
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="title"
                defaultValue={editingProperty.title}
                placeholder="Title"
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="location"
                defaultValue={editingProperty.location}
                placeholder="Location"
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                value={user?.displayName}
                readOnly
                className="w-full border p-2 rounded bg-gray-100"
              />
              <input
                type="email"
                value={user?.email}
                readOnly
                className="w-full border p-2 rounded bg-gray-100"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="minPrice"
                  defaultValue={editingProperty.minPrice}
                  placeholder="Min Price"
                  required
                  className="w-full border p-2 rounded"
                />
                <input
                  type="number"
                  name="maxPrice"
                  defaultValue={editingProperty.maxPrice}
                  placeholder="Max Price"
                  required
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingProperty(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Save
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
