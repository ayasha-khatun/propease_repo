// src/pages/Admin/ManageProperties/ManageProperties.jsx
import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ManageProperties = () => {
  const axiosSecure = useAxiosSecure();
  const [properties, setProperties] = useState([]);
  const [disabledIds, setDisabledIds] = useState([]);

  // Fetch all agent-submitted properties
  const fetchProperties = () => {
    axiosSecure
      .get("/admin/properties")
      .then((res) => setProperties(res.data))
      .catch((err) => console.error("Error fetching properties:", err));
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const disableTemporarily = (id) => {
    setDisabledIds((prev) => [...prev, id]);
  };

  // Handle verify
  const handleVerify = async (id) => {
    disableTemporarily(id);
    try {
      const res = await axiosSecure.patch(`/admin/properties/${id}/verify`);
      if (res.data.modifiedCount > 0) {
        setProperties((prev) =>
          prev.map((p) =>
            p._id === id ? { ...p, verificationStatus: "verified" } : p
          )
        );
        Swal.fire("Verified!", "Property verified successfully ✅", "success");
      }
    } catch (err) {
      console.error("Error verifying property:", err);
      Swal.fire("Error", "Failed to verify property", "error");
    }
  };

  // Handle reject
  const handleReject = async (id) => {
    disableTemporarily(id);
    Swal.fire({
      title: "Are you sure?",
      text: "This property will be rejected!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, reject it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.patch(`/admin/properties/${id}/reject`);
          if (res.data.modifiedCount > 0) {
            setProperties((prev) =>
              prev.map((p) =>
                p._id === id ? { ...p, verificationStatus: "rejected" } : p
              )
            );
            Swal.fire("Rejected!", "Property has been rejected ❌", "success");
          }
        } catch (err) {
          console.error("Error rejecting property:", err);
          Swal.fire("Error", "Failed to reject property", "error");
        }
      }
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Manage Properties</h2>

      {properties.length === 0 ? (
        <p className="text-center text-gray-500">
          No properties added by agents yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Location</th>
                <th>Agent</th>
                <th>Email</th>
                <th>Price Range</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((prop, index) => {
                const isDisabled = disabledIds.includes(prop._id);
                return (
                  <tr key={prop._id}>
                    <td>{index + 1}</td>
                    <td>{prop.title}</td>
                    <td>{prop.location}</td>
                    <td>{prop.agentName}</td>
                    <td>{prop.agentEmail}</td>
                    <td>${prop.priceRange}</td>
                    <td>
                      {prop.verificationStatus === "pending" && (
                        <span className="text-yellow-600 font-semibold">
                          Pending
                        </span>
                      )}
                      {prop.verificationStatus === "verified" && (
                        <span className="text-green-600 font-semibold">
                          Verified
                        </span>
                      )}
                      {prop.verificationStatus === "rejected" && (
                        <span className="text-red-500 font-semibold">
                          Rejected
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-xs btn-success"
                          onClick={() => handleVerify(prop._id)}
                          disabled={
                            prop.verificationStatus !== "pending" || isDisabled
                          }
                        >
                          Verify
                        </button>
                        <button
                          className="btn btn-xs btn-error"
                          onClick={() => handleReject(prop._id)}
                          disabled={
                            prop.verificationStatus !== "pending" || isDisabled
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageProperties;
