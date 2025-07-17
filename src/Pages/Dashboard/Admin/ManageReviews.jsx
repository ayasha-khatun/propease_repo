import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all reviews from backend
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/admin/reviews'); // Adjust endpoint
      setReviews(res.data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      Swal.fire('Error', 'Failed to load reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Delete a review
  const handleDelete = async (reviewId) => {
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: "This will delete the review permanently!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirmResult.isConfirmed) {
      try {
        const res = await axios.delete(`http://localhost:5000/admin/reviews/${reviewId}`);
        if (res.data.deletedCount > 0) {
          Swal.fire('Deleted!', 'Review has been deleted.', 'success');
          setReviews(reviews.filter((review) => review._id !== reviewId));
        }
      } catch (error) {
        console.error('Delete error:', error);
        Swal.fire('Error', 'Failed to delete review', 'error');
      }
    }
  };

  if (loading) return <p className="text-center mt-10">Loading reviews...</p>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Reviews</h1>
      {reviews.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div key={review._id} className="border rounded-lg p-4 shadow-sm bg-white">
              <div className="flex items-center mb-3">
                <img
                  src={review.reviewerImage || '/default-user.png'}
                  alt={review.reviewerName}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="font-semibold">{review.reviewerName}</p>
                  <p className="text-sm text-gray-500">{review.reviewerEmail}</p>
                </div>
              </div>
              <p className="mb-2 font-semibold">Property: {review.propertyTitle}</p>
              <p className="mb-1 text-gray-600">{review.review}</p>
              <p className="text-xs text-gray-400">
                Reviewed on: {new Date(review.reviewTime).toLocaleDateString()}
              </p>
              <button
                onClick={() => handleDelete(review._id)}
                className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
              >
                Delete Review
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageReviews;
