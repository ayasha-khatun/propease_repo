// src/Pages/Dashboard/User/MyReviews.jsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from './../../../hooks/useAxiosSecure';
import useAuth from './../../../hooks/useAuth';

const MyReviews = () => {
  const axiosSecure = useAxiosSecure;
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user's reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (user?.email) {
        try {
          setLoading(true);
          const response = await axiosSecure.get(`/reviews?email=${user.email}`);
          setReviews(response.data);
        } catch (err) {
          console.error("❌ Failed to fetch reviews:", err);
          Swal.fire("Error", "Failed to load your reviews", "error");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchReviews();
  }, [user, axiosSecure]);

  // Delete review
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this review!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/reviews/${id}`);
        setReviews(reviews.filter((r) => r._id !== id));
        Swal.fire("Deleted!", "Your review has been deleted.", "success");
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire("Error!", "Failed to delete review.", "error");
      }
    }
  };

  if (loading) {
    return <div className="p-6">Loading your reviews...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-gray-500">You haven't added any reviews yet.</p>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="p-4 border rounded-lg shadow-sm bg-white flex items-start gap-4"
            >
              {/* Reviewer Image */}
              <img
                src={review.reviewerImage || "https://i.ibb.co/4pDNDk1/avatar.png"}
                alt={review.displayName}
                className="w-12 h-12 rounded-full object-cover"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-lg">{review.propertyTitle}</h3>
                <p className="text-sm text-gray-600">
                  by {review.displayName} ({review.userEmail})
                </p>
                <p className="mt-2">{review.review}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(review._id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;