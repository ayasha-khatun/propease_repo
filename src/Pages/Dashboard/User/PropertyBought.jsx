import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";
import useAuth from './../../../hooks/useAuth';

const PropertyBought = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffersWithImages = async () => {
      if (!user?.email) return;

      try {
        const res = await axiosSecure.get(`/offers?email=${user.email}`);
        const offersData = res.data;

        const offersWithImages = await Promise.all(
          offersData.map(async (offer) => {
            if (!offer.propertyImage) {
              try {
                const propRes = await axiosSecure.get(`/properties/${offer.propertyId}`);
                return { ...offer, propertyImage: propRes.data.image };
              } catch {
                return { ...offer, propertyImage: "/default-house.jpg" };
              }
            }
            return offer;
          })
        );

        setOffers(offersWithImages);
      } catch (err) {
        console.error("Error fetching offers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffersWithImages();
  }, [user?.email, axiosSecure]);

  const handlePay = (offer) => {
    navigate(`/dashboard/payment/${offer._id}`);
  };

  if (loading) {
    return <p className="text-center mt-10 text-lg text-gray-300 dark:text-gray-200 animate-pulse">Loading your bought properties...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">Property Bought</h2>

      {offers.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-300">
          You haven't made any offers yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map((offer) => (
            <div
              key={offer._id}
              className="bg-white dark:bg-slate-800 shadow-md dark:shadow-gray-700 rounded-lg p-2 flex flex-col border border-gray-200 dark:border-gray-700"
            >
              <img
                src={offer.propertyImage || "/default-house.jpg"}
                alt={offer.propertyTitle}
                className="w-full h-40 object-cover rounded"
              />

              <h3 className="text-xl font-semibold mt-3 text-gray-800 dark:text-gray-100">{offer.propertyTitle}</h3>
              <p className="text-gray-600 dark:text-gray-300"><strong>Location:</strong> {offer.propertyLocation}</p>
              <p className="text-gray-700 dark:text-gray-200 font-medium">Agent: {offer.agentName}</p>
              <p className="text-blue-600 dark:text-blue-400 font-semibold mt-2">
                Offered: ${offer.offerAmount}
              </p>

              <p className="mt-1">
                Status:{" "}
                <span
                  className={`font-bold ${
                    offer.status === "pending"
                      ? "text-yellow-500 dark:text-yellow-400"
                      : offer.status === "accepted"
                      ? "text-green-600 dark:text-green-400"
                      : offer.status === "bought"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {offer.status}
                </span>
              </p>

              {offer.status === "accepted" && !offer.transactionId && (
                <button
                  onClick={() => handlePay(offer)}
                  className="btn btn-primary mt-3 w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white"
                >
                  Pay
                </button>
              )}

              {offer.status === "bought" && offer.transactionId && (
                <p className="mt-3 text-green-600 dark:text-green-400">
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
