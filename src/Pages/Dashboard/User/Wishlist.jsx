import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import useAuth from '../../../hooks/useAuth';

const Wishlist = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (user?.email) {
      axios.get(`http://localhost:5000/wishlist?email=${user.email}`)
        .then(res => setWishlist(res.data))
        .catch(err => console.error('Wishlist fetch error:', err));
    }
  }, [user?.email]);

  const handleRemove = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to remove this property from your wishlist.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:5000/wishlist/${id}`)
          .then(() => {
            setWishlist(prev => prev.filter(item => item._id !== id));
            Swal.fire('Removed!', 'The property has been removed.', 'success');
          })
          .catch(err => {
            console.error(err);
            Swal.fire('Error!', 'Failed to remove the property.', 'error');
          });
      }
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">My Wishlist</h2>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-500">No properties in wishlist.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map(property => (
            <div key={property._id} className="bg-white shadow-md rounded-lg p-4">
              <img
                src={property.propertyImage}
                alt={property.title}
                className="w-full h-40 object-cover rounded"
              />

              <h3 className="text-xl font-semibold mt-3">{property.title}</h3>
              <p className="text-gray-600">📍 {property.location}</p>
              <p className="text-gray-700 font-medium mt-2">
                💰 ${property.minPrice} - ${property.maxPrice}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <img
                  src={property.agent?.image}
                  alt={property.agent?.name}
                  className="w-8 h-8 rounded-full"
                />
                <p className="font-medium">{property.agent?.name}</p>
                {property.agent?.verified && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-green-500 text-white rounded-full">✔ Verified</span>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <Link to={`/make-offer/${property.propertyId}`} className="btn btn-sm btn-primary w-full">
                  Make an Offer
                </Link>
                <button
                  onClick={() => handleRemove(property._id)}
                  className="btn btn-sm btn-error w-full"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
