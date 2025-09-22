import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAuth from "./../../../hooks/useAuth";
import useAxiosSecure from "./../../../hooks/useAxiosSecure";

const RequestedProperties = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // Fetch offers for this agent
  const fetchOffers = async () => {
    try {
      const res = await axiosSecure.get(`/offers/agent/${user?.email}`);
      setOffers(res.data);
    } catch (err) {
      console.error("Failed to load offers", err);
      Swal.fire("Error", "Failed to load offers", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchOffers();
    }
  }, [user?.email]);

  // Accept offer
  const handleAccept = async (offerId, propertyId) => {
    try {
      const res = await axiosSecure.patch(`/offers/accept/${offerId}`, {
        propertyId,
      });

      if (res.data.modifiedCount > 0) {
        Swal.fire("✅ Accepted!", "Offer has been accepted.", "success");
        fetchOffers(); // refresh all offers
      }
    } catch (err) {
      console.error("Accept error", err);
      Swal.fire("❌ Error", "Failed to accept offer.", "error");
    }
  };

  // Reject offer
  const handleReject = async (offerId) => {
    try {
      const res = await axiosSecure.patch(`/offers/reject/${offerId}`);
      if (res.data.modifiedCount > 0) {
        Swal.fire("❌ Rejected!", "Offer has been rejected.", "success");
        fetchOffers();
      }
    } catch (err) {
      console.error("Reject error", err);
      Swal.fire("❌ Error", "Failed to reject offer.", "error");
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Requested / Offered Properties</h2>

      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>Property Title</th>
            <th>Location</th>
            <th>Buyer Name</th>
            <th>Buyer Email</th>
            <th>Offer Price</th>
            <th>Status / Actions</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer, idx) => (
            <tr key={offer._id}>
              <td>{idx + 1}</td>
              <td>{offer.propertyTitle}</td>
              <td>{offer.propertyLocation}</td>
              <td>{offer.buyerName}</td>
              <td>{offer.buyerEmail}</td>
              <td>${offer.offerAmount}</td>
              <td>
                {(!offer.status || offer.status === "pending") && (
                  <div className="flex gap-2">
                    <button
                      className="btn btn-xs btn-success"
                      onClick={() => handleAccept(offer._id, offer.propertyId)}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => handleReject(offer._id)}
                    >
                      Reject
                    </button>
                  </div>
                )}
                {offer.status === "accepted" && (
                  <span className="text-green-600 font-semibold">Accepted</span>
                )}
                {offer.status === "rejected" && (
                  <span className="text-red-500 font-semibold">Rejected</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestedProperties;
