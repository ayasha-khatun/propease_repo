import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../../../hooks/useAuth';
import { Link } from 'react-router';

const PropertyBought = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:5000/offers?email=${user.email}`)
        .then(res => setOffers(res.data))
        .catch(err => console.error('Error fetching offers:', err));
    }
  }, [user?.email]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Property Bought</h2>

      {offers.length === 0 ? (
        <p className="text-center text-gray-500">You haven't made any offers yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map(offer => (
            <div key={offer._id} className="bg-white shadow-md rounded-lg p-4">
              <img
                src={offer.image}
                alt={offer.title}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="text-xl font-semibold mt-3">{offer.title}</h3>
              <p className="text-gray-600 mb-1">📍 {offer.location}</p>
              <p className="text-gray-700 font-medium">Agent: {offer.agentName}</p>
              <p className="text-blue-600 font-semibold mt-2">💰 Offered: ${offer.offeredAmount}</p>
              <p className="mt-1">
                Status:{' '}
                <span
                  className={`font-bold ${
                    offer.status === 'pending'
                      ? 'text-yellow-500'
                      : offer.status === 'accepted'
                      ? 'text-green-600'
                      : 'text-blue-600'
                  }`}
                >
                  {offer.status}
                </span>
              </p>

              {offer.status === 'accepted' && !offer.transactionId && (
                <Link
                  to={`/payment/${offer._id}`}
                  className="btn btn-sm btn-primary mt-3 w-full"
                >
                  Pay
                </Link>
              )}

              {offer.status === 'bought' && offer.transactionId && (
                <p className="mt-3 text-sm text-green-600">
                  ✅ Paid. Transaction ID: <span className="font-mono">{offer.transactionId}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyBought;
