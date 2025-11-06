import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AdvertiseProperty = () => {
  const axiosSecure = useAxiosSecure();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch verified properties from backend
  useEffect(() => {
    axiosSecure
      .get("/admin/verified-properties")
      .then((res) => setProperties(res.data))
      .catch(() =>
        Swal.fire("Error", "Failed to load verified properties", "error")
      )
      .finally(() => setLoading(false));
  }, [axiosSecure]);

  // ✅ Handle Advertise Button Click
  const handleAdvertise = async (id) => {
    const confirm = await Swal.fire({
      title: "Advertise this property?",
      text: "This property will be shown in the advertised section.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Advertise",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.patch(
          `/admin/properties/${id}/advertise`
        );
        if (res.data.modifiedCount > 0) {
          Swal.fire("Success!", "Property advertised successfully ✅", "success");
          setProperties((prev) =>
            prev.map((p) =>
              p._id === id ? { ...p, isAdvertised: true } : p
            )
          );
        }
      } catch {
        Swal.fire("Error", "Failed to advertise property", "error");
      }
    }
  };

  // ✅ Loading State
  if (loading) {
    return (
      <p className="text-center mt-10 text-lg font-medium text-gray-600">
        Loading properties...
      </p>
    );
  }

  // ✅ Empty State
  if (!properties.length) {
    return (
      <p className="text-center mt-10 text-gray-500">
        No verified properties available for advertisement.
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
        Advertise Verified Properties
      </h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Title</th>
              <th>Price Range</th>
              <th>Agent</th>
              <th>Status</th>
              <th>Advertise</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-12 object-cover rounded-md border"
                  />
                </td>
                <td className="font-medium">{item.title}</td>
                <td>{item.priceRange}</td>
                <td>{item.agentName}</td>
                <td>
                  {item.isAdvertised ? (
                    <span className="badge badge-success text-white px-3 py-1">
                      Advertised
                    </span>
                  ) : (
                    <span className="badge badge-error text-white px-3 py-1">
                      Not Yet
                    </span>
                  )}
                </td>
                <td>
                  <button
                    disabled={item.isAdvertised}
                    onClick={() => handleAdvertise(item._id)}
                    className={`btn btn-xs text-white ${
                      item.isAdvertised
                        ? "btn-disabled bg-gray-400"
                        : "bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary"
                    }`}
                  >
                    {item.isAdvertised ? "Advertised" : "Advertise"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdvertiseProperty;
