// src/pages/user/PropertyBought.jsx
import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";
import useAuth from './../../../hooks/useAuth';

const PropertyBought = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [offers, setOffers] = useState([]);

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/offers?email=${user.email}`)
        .then(res => setOffers(res.data))
        .catch(err => console.error("Error fetching offers:", err));
    }
  }, [user?.email, axiosSecure]);

  const handlePay = offer => {
    navigate(`/dashboard/payment/${offer._id}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Property Bought</h2>

      {offers.length === 0 ? (
        <p className="text-center text-gray-500">
          You haven't made any offers yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map(offer => (
            <div
              key={offer._id}
              className="bg-white shadow-md rounded-lg p-2 flex flex-col"
            >
              <img
                src={offer.propertyImage}
                alt={offer.title}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="text-xl font-semibold mt-3">{offer.propertyTitle}</h3>
              <p className="text-gray-600"><strong>Location</strong> {offer.propertyLocation}</p>
              <p className="text-gray-700 font-medium">Agent: {offer.agentName}</p>
              <p className="text-blue-600 font-semibold mt-2">
                Offered: ${offer.offerAmount}
              </p>

              <p className="mt-1">
                Status:{" "}
                <span
                  className={`font-bold ${
                    offer.status === "pending"
                      ? "text-yellow-500"
                      : offer.status === "accepted"
                      ? "text-green-600"
                      : "text-blue-600"
                  }`}
                >
                  {offer.status}
                </span>
              </p>

              {offer.status === "accepted" && !offer.transactionId && (
                <button
                  onClick={() => handlePay(offer)}
                  className="btn btn-primary mt-3 w-full"
                >
                  Pay
                </button>
              )}

              {offer.status === "bought" && offer.transactionId && (
                <p className="mt-3 text-green-600">
                  ✅ Paid. Transaction ID:{" "}
                  <span className="font-mono">{offer.transactionId}</span>
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
