import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LatestReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get('https://propease-server-side.vercel.app/reviews/latest')
      .then(res => setReviews(res.data.slice(0, 3))) // only show 3 latest
      .catch(err => console.error('Failed to fetch latest reviews:', err));
  }, []);

  return (
    <div className="w-full bg-gray-50 py-10">
      <h2 className="text-4xl font-bold text-center mb-8">🗣️ Latest User Reviews</h2>

      <div className='max-w-7xl mx-auto px-4'>
        {reviews.length === 0 ? (
        <p className="text-center text-gray-500">No reviews available.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map(review => (
            <div key={review._id} className="bg-white rounded-lg shadow-md p-5">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={review.reviewerImage || '/default-user.png'}
                  alt={review.reviewerName || 'User'}
                  className="w-12 h-12 rounded-full object-cover border"
                />
                <div>
                  <p className="font-semibold text-gray-800">{review.reviewerName || 'Anonymous'}</p>
                  <p className="text-sm text-gray-500">{review.propertyTitle}</p>
                </div>
              </div>

              <p className="text-gray-700 text-sm leading-relaxed">
                “{review.review || 'No review text'}”
              </p>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default LatestReviews;
