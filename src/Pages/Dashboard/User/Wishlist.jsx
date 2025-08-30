import { useEffect, useState } from "react";
import useAuth from "../../../Hooks/useAuth";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Wishlist = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure(); // 🔹 token সহ axios instance

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
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-48 object-cover rounded"
          />
          <h2 className="text-xl font-bold mt-2">{property.title}</h2>
          <p className="text-gray-600">{property.location}</p>
          <p className="text-green-600 mt-1">
            Price: ${property.minPrice} - ${property.maxPrice}
          </p>

          <div className="flex gap-2 mt-4">
            <Link
             to={`/dashboard/make-offer/${property.propertyId}`}
              className="btn btn-sm btn-success flex-1"
            >
              Make Offer
            </Link>
            <button
              onClick={() => handleDelete(property._id)}
              className="btn btn-sm btn-error flex-1"
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
