import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "./../../../hooks/useAxiosSecure";

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/admin/reviews");
      setReviews(res.data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      Swal.fire("Error", "Failed to load reviews", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (reviewId, reviewerEmail) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the review.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(
          `/admin/reviews/${reviewId}?email=${reviewerEmail}`
        );
        if (res.data.deletedFromReviews?.deletedCount > 0) {
          Swal.fire("Deleted!", "Review has been removed ✅", "success");
          setReviews((prev) => prev.filter((r) => r._id !== reviewId));
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to delete review", "error");
      }
    }
  };

  if (loading) return <p className="text-center mt-10">Loading reviews...</p>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
        Manage Reviews
      </h1>

      {reviews.length === 0 ? (
        <p className="text-center text-gray-500">No reviews found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Reviewer</th>
                <th>Email</th>
                <th>Property</th>
                <th>Review</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review, index) => (
                <tr key={review._id}>
                  <td>{index + 1}</td>
                  <td className="flex items-center gap-3">
                    <img
                      src={review.reviewerImage || "/default-user.png"}
                      alt="Reviewer"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span>{review.displayName || "Anonymous"}</span>
                  </td>
                  <td>{review.userEmail || "N/A"}</td>
                  <td>{review.propertyTitle || "Untitled Property"}</td>
                  <td className="max-w-xs truncate">
                    {review.review || "No review text."}
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        handleDelete(review._id, review.reviewerEmail)
                      }
                      className="btn btn-xs btn-error"
                    >
                      Delete
                    </button>
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

export default ManageReviews;
