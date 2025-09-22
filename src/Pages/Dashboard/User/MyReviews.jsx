import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from './../../../hooks/useAxiosSecure';
import useAuth from './../../../hooks/useAuth';

const MyReviews = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [reviews, setReviews] = useState([]);

  // Fetch user's reviews
  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/reviews/user/${user.email}`)
        .then((res) => setReviews(res.data))
        .catch((err) => console.error("Error fetching reviews:", err));
    }
  }, [user?.email, axiosSecure]);

  // Delete review
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/reviews/${id}`)
          .then(() => {
            setReviews(reviews.filter((r) => r._id !== id));
            Swal.fire("Deleted!", "Your review has been deleted.", "success");
          })
          .catch(() => Swal.fire("Error", "Failed to delete review", "error"));
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">My Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-center text-gray-500">You haven’t given any reviews yet.</p>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <div key={review._id} className="p-4 border rounded shadow-sm">
              <h3 className="text-xl font-semibold">{review.propertyTitle}</h3>
              <p className="text-gray-600">👤 Agent: {review.agentName}</p>
              <p className="text-gray-500 text-sm">
                🕒 {new Date(review.time).toLocaleString()}
              </p>
              <p className="mt-2">{review.review}</p>
              <button
                onClick={() => handleDelete(review._id)}
                className="mt-3 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
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
