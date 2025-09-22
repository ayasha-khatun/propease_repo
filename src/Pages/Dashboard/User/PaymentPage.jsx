import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const PaymentPage = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [offer, setOffer] = useState(null);

  useEffect(() => {
    axiosSecure
      .get(`/offers/${id}`)
      .then(res => setOffer(res.data))
      .catch(err => console.error("Error fetching offer:", err));
  }, [id, axiosSecure]);

  const handlePayment = async () => {
    try {
      const transactionId = "TXN-" + Math.floor(Math.random() * 1000000);
      const res = await axiosSecure.patch(`/offers/buy/${id}`, { transactionId });
      if (res.data.modifiedCount > 0) {
        alert(`✅ Payment successful! Transaction ID: ${transactionId}`);
        setOffer({ ...offer, status: "bought", transactionId });
      }
    } catch (error) {
      console.error("Payment failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Payment failed!");
    }
  };

  if (!offer) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Payment Page</h2>
      <img
        src={offer.image}
        alt={offer.title}
        className="w-full h-40 object-cover rounded"
      />
      <h3 className="text-xl font-semibold mt-3">{offer.title}</h3>
      <p className="text-gray-600">📍 {offer.location}</p>
      <p className="text-gray-700">Agent: {offer.agentName}</p>
      <p className="text-blue-600 font-semibold mt-2">
        💰 Offered: ${offer.offeredAmount}
      </p>

      {offer.status === "accepted" && !offer.transactionId && (
        <button onClick={handlePayment} className="btn btn-primary w-full mt-4">
          Pay Now
        </button>
      )}

      {offer.status === "bought" && offer.transactionId && (
        <p className="mt-3 text-green-600">
          ✅ Already Paid (Transaction ID: {offer.transactionId})
        </p>
      )}
    </div>
  );
};

export default PaymentPage;
