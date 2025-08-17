import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment';

const MyReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's reviews
  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:5000/reviews?email=${user.email}`)
        .then(res => {
          setReviews(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Review fetch error:', err);
          setLoading(false);
        });
    }
  }, [user?.email]);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the review permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5000/reviews/${id}`)
          .then(res => {
            if (res.data.deletedCount > 0) {
              Swal.fire('Deleted!', 'Review has been deleted.', 'success');
              setReviews(reviews.filter(r => r._id !== id));
            }
          })
          .catch(() => {
            Swal.fire('Error!', 'Failed to delete the review.', 'error');
          });
      }
    });
  };

  if (loading) {
    return <p className="text-center mt-10">Loading your reviews...</p>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">My Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-center text-gray-500">You haven’t added any reviews yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map(review => (
            <div key={review._id} className="bg-white p-5 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-blue-700">{review.propertyTitle}</h3>
              <p className="text-sm text-gray-600 mb-1">👤 Agent: {review.displayName || 'N/A'}</p>
              <p className="text-xs text-gray-500 mb-2">
                {moment(review.reviewTime || review.createdAt).format('MMMM Do YYYY, h:mm A')}
              </p>
              <p className="text-gray-700 mb-3">💬 {review.review}</p>
              <button
                onClick={() => handleDelete(review._id)}
                className="btn btn-sm btn-error w-full"
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

export default MyReviews;
