import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import ReviewModal from "./ReviewModal";

const PropertyDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [role, setRole] = useState("");
  const [added, setAdded] = useState(false);

  // ✅ Fetch property details
  useEffect(() => {
    axiosSecure
      .get(`/properties/${id}`)
      .then((res) => setProperty(res.data))
      .catch(() => Swal.fire("Error", "Failed to load property details!", "error"));
  }, [id, axiosSecure]);

  // ✅ Fetch property reviews
  useEffect(() => {
    axiosSecure
      .get(`/reviews/property/${id}`)
      .then((res) => setReviews(res.data))
      .catch(() => Swal.fire("Error", "Failed to load reviews!", "error"));
  }, [id, axiosSecure]);

  // ✅ Get user role
  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/users/role/${user.email}`)
        .then((res) => setRole(res.data.role))
        .catch((err) => console.error("Role fetch error:", err));
    }
  }, [user?.email, axiosSecure]);

  // ✅ Handle wishlist add
  const handleAddToWishlist = () => {
    if (role !== "user") {
      return Swal.fire("Only users can add to wishlist!", "", "info");
    }

    const wishlistItem = {
      propertyId: id,
      userEmail: user.email,
      image: property.image,
      title: property.title,
      priceRange: property.priceRange,
      agentName: property.agentName || "Unknown Agent",
      agentEmail: property.agentEmail || "",
      location: property.location || "Not Provided",
      agentImage: property.agentPhoto || property.agentImage || "/default-user.png",
      verificationStatus: property.verificationStatus || "pending",
    };

    axiosSecure
      .post("/wishlist", wishlistItem)
      .then(() => {
        Swal.fire("Success", "Added to Wishlist!", "success");
        setAdded(true);
      })
      .catch((error) => {
        if (error.response?.status === 409) {
          Swal.fire("Info", "This property is already in your wishlist.", "info");
        } else {
          Swal.fire("Error", "Could not add to Wishlist", "error");
        }
      });
  };

  // ✅ Loading spinner
  if (!property) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* 🏡 Property Image */}
      <img
        src={property.image}
        alt={property.title}
        className="w-full h-96 object-cover rounded mb-6 shadow-md"
      />

      {/* 🏷️ Property Info */}
      <h2 className="text-3xl font-bold mb-2">{property.title}</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-1">
        {property.location}
      </p>
      <p className="text-lg mb-1">💰 Price Range: {property.priceRange}</p>
      <p className="text-sm mb-2">
        {" "}
        <span
          className={`font-semibold ${
            property.verificationStatus === "verified"
              ? "text-green-600"
              : property.verificationStatus === "pending"
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {property.verificationStatus}
        </span>
      </p>

      {/* 👨‍💼 Agent Info */}
      <div className="flex items-center gap-3 mt-3">
        <img
          src={property.agentPhoto || property.agentImage || "/default-user.png"}
          alt={property.agentName}
          className="w-12 h-12 rounded-full object-cover border"
        />
        <div>
          <p className="font-medium">Agent: {property.agentName}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{property.agentEmail}</p>
        </div>
      </div>

      {/* ❤️ Wishlist Button */}
      {role === "user" && (
        <button
          disabled={added}
          onClick={handleAddToWishlist}
          className={`mt-5 px-5 py-2 rounded text-white font-medium ${
            added
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          }`}
        >
          {added ? "Added to Wishlist" : "Add to Wishlist"}
        </button>
      )}

      {/* 💬 Reviews Section */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">User Reviews</h3>
          {role === "user" && (
            <button
              onClick={() => setShowModal(true)}
              className="btn bg-gradient-to-r from-primary to-secondary text-white"
            >
              Add a Review
            </button>
          )}
        </div>

        {reviews.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r, idx) => (
              <div
                key={idx}
                className="border p-4 rounded-lg shadow-sm bg-white dark:bg-gray-800"
              >
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={r.reviewerImage || "/default-user.png"}
                    alt="Reviewer"
                    className="w-10 h-10 rounded-full border"
                  />
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {r.reviewerName || r.displayName}
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                  “{r.review}”
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 📝 Review Modal */}
      {showModal && (
        <ReviewModal
          propertyId={id}
          propertyTitle={property.title}
          user={user}
          setShowModal={setShowModal}
          refresh={() =>
            axiosSecure
              .get(`/reviews/property/${id}`)
              .then((res) => setReviews(res.data))
          }
        />
      )}
    </div>
  );
};

export default PropertyDetails;
