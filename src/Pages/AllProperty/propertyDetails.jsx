import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import ReviewModal from './ReviewModal';

const PropertyDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user, loading } = useAuth();

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [role, setRole] = useState('');

  // Fetch property
  useEffect(() => {
    axiosSecure.get(`/properties/${id}`)
      .then(res => setProperty(res.data))
      .catch(err => console.error(err));
  }, [id, axiosSecure]);

  // Fetch reviews
  useEffect(() => {
    axiosSecure.get(`/reviews/property/${id}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error(err));
  }, [id, axiosSecure]);

  // Get role
  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/users/role/${user.email}`)
        .then(res => setRole(res.data.role));
    }
  }, [user?.email, axiosSecure]);

  // Add to Wishlist
  const handleAddToWishlist = () => {
  const wishlistItem = {
    propertyId: id,
    userEmail: user.email,
    image: property.image,
    title: property.title,
    price: `${property.priceMin}-${property.priceMax}`,
  };

  axiosSecure.post('/wishlist', wishlistItem)
    .then(() => Swal.fire('Success', 'Added to Wishlist!', 'success'))
    .catch((error) => {
      if (error.response?.status === 409) {
        Swal.fire('Info', 'This property is already in your wishlist.', 'info');
      } else {
        Swal.fire('Error', 'Could not add to Wishlist', 'error');
      }
    });
};


  if (!property) return <p className="text-center mt-10">Loading property details...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Property Info */}
      <img
        src={property.image}
        alt={property.title}
        className="w-full h-96 object-cover rounded mb-6"
      />
      <h2 className="text-3xl font-bold mb-2">{property.title}</h2>
      <p className="text-gray-600 mb-2">📍 {property.location}</p>
      <p className="text-lg mb-2">💰 ${property.priceMin} - ${property.priceMax}</p>
      <p className="mb-4">{property.description || 'No description available.'}</p>
      <p className="mb-2 font-semibold">👤 Agent: {property.agentName}</p>

      {/* Wishlist */}
      <button
        onClick={handleAddToWishlist}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add to Wishlist
      </button>

      {/* Reviews */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">User Reviews</h3>
          {role === 'user' && (
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-sm btn-outline"
            >
              Add a Review
            </button>
          )}
        </div>

        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r, idx) => (
              <div key={idx} className="border p-3 rounded">
                <div className="flex items-center gap-3 mb-1">
                  <img
                    src={r.reviewerImage || '/default-user.png'}
                    className="w-10 h-10 rounded-full border"
                    alt="Reviewer"
                  />
                  <p className="font-semibold">{r.reviewerName}</p>
                </div>
                <p className="text-sm text-gray-600">{r.review}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showModal && (
        <ReviewModal
          propertyId={id}
          propertyTitle={property.title}
          user={user}
          setShowModal={setShowModal}
          refresh={() =>
            axiosSecure.get(`/reviews/property/${id}`).then(res => setReviews(res.data))
          }
        />
      )}
    </div>
  );
};

export default PropertyDetails;
