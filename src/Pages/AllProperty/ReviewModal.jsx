import { useState } from 'react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const ReviewModal = ({ propertyId, propertyTitle, user, setShowModal, refresh }) => {
  const axiosSecure = useAxiosSecure();
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!review.trim()) {
      return Swal.fire('Oops', 'Review cannot be empty', 'warning');
    }

    const reviewData = {
      propertyId,
      propertyTitle,
      reviewerName: user?.displayName || 'Anonymous',
      reviewerEmail: user?.email || 'unknown@example.com',
      reviewerImage: user?.photoURL || '/default-user.png',
      review: review.trim(),
      reviewTime: new Date().toISOString(),
    };

    try {
      setIsSubmitting(true);
      await axiosSecure.post('/reviews', reviewData);
      Swal.fire('Success', 'Review submitted!', 'success');
      setShowModal(false);
      refresh();
    } catch (err) {
      console.error('Review submission failed:', err);
      Swal.fire('Error', 'Failed to submit review', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white dark:bg-gray-900 p-6 rounded-md w-[90%] max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Add Your Review</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            rows="4"
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-2 rounded placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your thoughts about the property..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          ></textarea>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-3 py-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-1 rounded text-white ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
