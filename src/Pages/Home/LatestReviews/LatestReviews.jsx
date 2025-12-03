import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";

const LatestReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios
      .get("https://propease-server-side.vercel.app/reviews/latest")
      .then((res) => setReviews(res.data.slice(0, 3))) // show only 3 latest reviews
      .catch((err) => console.error("Failed to fetch latest reviews:", err));
  }, []);

  return (
    <section className="w-full bg-gray-50 dark:bg-gray-900 py-16 transition-colors duration-300">
      <h2 className="text-4xl font-bold text-center mb-10 text-gray-900 dark:text-gray-100">
        🗣️ Latest User Reviews
      </h2>

      <div className="max-w-7xl mx-auto px-4">
        {reviews.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No reviews available.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={review.reviewerImage || "/default-user.png"}
                    alt={review.reviewerName || "User"}
                    className="w-12 h-12 rounded-full object-cover border dark:border-gray-700"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {review.reviewerName || "Anonymous"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {review.propertyTitle}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3">
                  “{review.review || "No review text"}”
                </p>

                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`${
                        i < (review.rating || 0)
                          ? "text-yellow-500"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestReviews;
