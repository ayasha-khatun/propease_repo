import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useAxiosSecure from './../../../hooks/useAxiosSecure';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get('/admin/reviews');
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

  const handleDelete = async (reviewId, reviewerEmail) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the review.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/admin/reviews/${reviewId}?email=${reviewerEmail}`);
        if (res.data.deletedFromReviews?.deletedCount > 0) {
          Swal.fire('Deleted!', 'Review has been removed.', 'success');
          setReviews((prev) => prev.filter((r) => r._id !== reviewId));
        }
      } catch (error) {
        console.error(error);
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
                  alt="Reviewer"
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="font-semibold">{review.displayName || 'Anonymous'}</p>
                  <p className="text-sm text-gray-500">{review.userEmail || 'N/A'}</p>
                </div>
              </div>

              <p className="mb-2 font-semibold">🏠 Property: {review.propertyTitle || 'Untitled Property'}</p>
              <p className="mb-1 text-gray-600">💬 {review.review || 'No review text.'}</p>

              <button
                onClick={() => handleDelete(review._id, review.reviewerEmail)}
                className="mt-3 bg-gradient-to-r from-primary to-secondary text-white px-4 py-1 rounded"
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
