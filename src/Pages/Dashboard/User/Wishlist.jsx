// src/pages/Dashboard/Wishlist.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Wishlist = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  // ✅ Fetch Wishlist
  useEffect(() => {
    if (user?.email) {
      setLoading(true);
      axiosSecure
        .get(`/wishlist?email=${user.email}`)
        .then((res) => {
          setWishlist(res.data || []);
        })
        .catch((err) => {
          console.error("Error fetching wishlist:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [user?.email, axiosSecure]);

  // ✅ Remove from Wishlist
  const handleDelete = (id) => {
    Swal.fire({
      title: "Remove from wishlist?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/wishlist/${id}`)
          .then((res) => {
            if (res.data.deletedCount > 0) {
              setWishlist((prev) => prev.filter((item) => item._id !== id));
              Swal.fire("Deleted!", "Property removed from wishlist.", "success");
            }
          })
          .catch((err) => {
            console.error("Error deleting from wishlist:", err);
          });
      }
    });
  };

  if (loading) {
    return <div className="text-center py-10 text-lg font-medium">Loading...</div>;
  }

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-4">Your wishlist is empty</h2>
        <Link to="/all-properties" className="btn btn-primary">
          Explore Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wishlist.map((property) => (
        <div key={property._id} className="bg-white rounded-lg shadow-md p-4">
          {/* 🖼️ Property Image */}
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-48 object-cover rounded"
          />

          {/* 📌 Title */}
          <h2 className="text-xl font-bold mt-2">{property.title}</h2>

          {/* 📍 Location */}
          <p className="text-gray-600 mt-1">Location: {property.location}</p>

          {/* 👨 Agent Info */}
          <div className="flex items-center gap-2 mt-2">
            <img
              src={property.agentPhoto || "/default-user.png"}
              alt={property.agentName}
              className="w-8 h-8 rounded-full object-cover border"
            />
            <p className="font-medium">Agent: {property.agentName}</p>
          </div>

          {/* ✅ Verification Status */}
          <p className="mt-1 text-sm">
            Status:{" "}
            <span
              className={`font-semibold ${
                property.verificationStatus === "verified"
                  ? "text-green-600"
                  : property.verificationStatus === "pending"
                  ? "text-yellow-600"
                  : "text-red-500"
              }`}
            >
              {property.verificationStatus}
            </span>
          </p>

          {/* 💰 Price Range */}
          <p className="text-green-600 mt-1">Price Range: {property.priceRange}</p>

          {/* 🔘 Buttons */}
          <div className="flex gap-2 mt-4">
            <Link
              to={`/dashboard/make-offer/${property.propertyId}`}
              className="btn text-white bg-gradient-to-r from-primary to-secondary flex-1"
            >
              Make Offer
            </Link>
            <button
              onClick={() => handleDelete(property._id)}
              className="btn text-white bg-gradient-to-r from-primary to-secondary flex-1"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Wishlist;
