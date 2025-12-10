import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const PaymentPage = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axiosSecure
      .get(`/offers/${id}`)
      .then(res => {
        setOffer(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load offer details.");
        setLoading(false);
      });
  }, [id, axiosSecure]);

  const handlePayment = async () => {
    setPaying(true);
    try {
      const transactionId = "TXN-" + Math.floor(Math.random() * 1000000);
      const res = await axiosSecure.patch(`/offers/buy/${id}`, { transactionId });

      if (res.data.modifiedCount > 0) {
        alert(`✅ Payment successful! Transaction ID: ${transactionId}`);
        setOffer({ ...offer, status: "bought", transactionId });
      }
    } catch (error) {
      alert(error.response?.data?.message || "Payment failed!");
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (error)
    return (
      <p className="text-center text-red-500 mt-10">
        {error}
      </p>
    );

  return (
    <div className="p-6 max-w-lg mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-xl transition-all">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Payment Details
      </h2>

      

      <h3 className="text-xl font-semibold mt-4 text-gray-900 dark:text-gray-100">
        {offer.propertyTitle}
      </h3>

      <p className="text-gray-700 dark:text-gray-300">{offer.location}</p>
      <p className="text-gray-700 dark:text-gray-300">Agent: {offer.agentName}</p>

      <p className="text-blue-600 dark:text-blue-400 font-semibold mt-3">
        Offered Amount: ${offer.offerAmount}
      </p>

      {/* ===== Payment Logic ===== */}
      {offer.status === "accepted" && !offer.transactionId && (
        <button
          onClick={handlePayment}
          disabled={paying}
          className="w-full mt-5 py-2 text-white font-semibold rounded-lg
          bg-gradient-to-r from-primary to-secondary
          shadow-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {paying ? "Processing..." : "Pay Now"}
        </button>
      )}

      {offer.status === "bought" && offer.transactionId && (
        <p className="mt-4 text-green-600 dark:text-green-400 font-semibold">
          ✅ Payment Completed  
          <br />
          Transaction ID: <span className="font-bold">{offer.transactionId}</span>
        </p>
      )}

      {offer.status !== "accepted" && offer.status !== "bought" && (
        <p className="mt-4 text-yellow-600 dark:text-yellow-400 font-medium">
          ⚠ Payment is only available after the agent accepts your offer.
        </p>
      )}
    </div>
  );
};

export default PaymentPage;
