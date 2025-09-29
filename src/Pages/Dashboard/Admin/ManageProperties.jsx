import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageProperties = () => {
  const axiosSecure = useAxiosSecure();
  const [properties, setProperties] = useState([]);

  // Fetch all agent-submitted properties
  const fetchProperties = () => {
    axiosSecure
      .get("/admin/properties")
      .then(res => setProperties(res.data))
      .catch(err => console.error("Error fetching properties:", err));
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Handle verify
  const handleVerify = async (id) => {
    try {
      const res = await axiosSecure.patch(`/admin/properties/${id}/verify`);
      if (res.data.modifiedCount > 0) {
        setProperties(prev =>
          prev.map(p =>
            p._id === id ? { ...p, verificationStatus: "verified" } : p
          )
        );
        alert("✅ Property verified successfully!");
      }
    } catch (err) {
      console.error("Error verifying property:", err);
      alert("Failed to verify property.");
    }
  };

  // Handle reject
  const handleReject = async (id) => {
    try {
      const res = await axiosSecure.patch(`/admin/properties/${id}/reject`);
      if (res.data.modifiedCount > 0) {
        setProperties(prev =>
          prev.map(p =>
            p._id === id ? { ...p, verificationStatus: "rejected" } : p
          )
        );
        alert("❌ Property rejected.");
      }
    } catch (err) {
      console.error("Error rejecting property:", err);
      alert("Failed to reject property.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Manage Properties</h2>

      {properties.length === 0 ? (
        <p className="text-center text-gray-500">No properties added by agents yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th>Title</th>
                <th>Location</th>
                <th>Agent Name</th>
                <th>Agent Email</th>
                <th>Price Range</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((prop) => (
                <tr key={prop._id} className="hover:bg-gray-50">
                  <td>{prop.title}</td>
                  <td>{prop.location}</td>
                  <td>{prop.agentName}</td>
                  <td>{prop.agentEmail}</td>
                  <td>${prop.priceRange}</td>
                  <td>
                    {prop.verificationStatus === "pending" && "Pending"}
                    {prop.verificationStatus === "verified" && (
                      <span className="text-green-600 font-bold">Verified</span>
                    )}
                    {prop.verificationStatus === "rejected" && (
                      <span className="text-red-600 font-bold">Rejected</span>
                    )}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleVerify(prop._id)}
                        disabled={prop.verificationStatus !== "pending"}
                      >
                        Verify
                      </button>
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => handleReject(prop._id)}
                        disabled={prop.verificationStatus !== "pending"}
                      >
                        Reject
                      </button>
                    </div>
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
