import { useState } from 'react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const ReviewModal = ({ propertyId, user, setShowModal, refresh, propertyTitle }) => {
  const axiosSecure = useAxiosSecure();
  const [review, setReview] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!review.trim()) {
      return Swal.fire('Oops', 'Review cannot be empty', 'warning');
    }

    const reviewData = {
      propertyId,
      propertyTitle,
      reviewerName: user.displayName,
      reviewerEmail: user.email,
      reviewerImage: user.photoURL || '/default-user.png',
      review,
      reviewTime: new Date(),
    };

    try {
      await axiosSecure.post('/reviews', reviewData);
      Swal.fire('Success', 'Review submitted!', 'success');
      setShowModal(false);
      refresh();
    } catch (err) {
      console.error('Review submission failed:', err);
      Swal.fire('Error', 'Failed to submit review', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Your Review</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            rows="4"
            className="w-full border p-2 rounded mb-3"
            placeholder="Write your thoughts about the property..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          ></textarea>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-3 py-1 border rounded"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
