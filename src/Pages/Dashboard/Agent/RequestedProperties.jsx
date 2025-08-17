import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';

const RequestedProperties = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:5000/offers/agent/${user.email}`)
        .then((res) => setOffers(res.data))
        .catch((err) => console.error('Offer fetch error:', err));
    }
  }, [user]);

  const refetchOffers = async () => {
    const res = await axios.get(`http://localhost:5000/offers/agent/${user.email}`);
    setOffers(res.data);
  };

  const handleAccept = async (offerId, propertyId) => {
    try {
      const res = await axios.patch(`http://localhost:5000/offer/accept/${offerId}`, { propertyId });
      if (res.data.modifiedCount > 0 || res.data.statusUpdated) {
        Swal.fire('Accepted!', 'The offer has been accepted.', 'success');
        refetchOffers();
      }
    } catch (err) {
      console.error('Accept offer error:', err);
    }
  };

  const handleReject = async (offerId) => {
    try {
      const res = await axios.patch(`http://localhost:5000/offer/reject/${offerId}`);
      if (res.data.modifiedCount > 0) {
        Swal.fire('Rejected!', 'The offer has been rejected.', 'info');
        refetchOffers();
      }
    } catch (err) {
      console.error('Reject offer error:', err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Requested Properties</h2>

      {offers.length === 0 ? (
        <p className="text-center text-gray-500">No offers found.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="table w-full">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Location</th>
                <th>Buyer Name</th>
                <th>Buyer Email</th>
                <th>Offer Price</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer, index) => (
                <tr key={offer._id} className="hover">
                  <td>{index + 1}</td>
                  <td>{offer.title}</td>
                  <td>{offer.location}</td>
                  <td>{offer.buyerName}</td>
                  <td>{offer.buyerEmail}</td>
                  <td>${offer.offerAmount}</td>
                  <td className="capitalize font-semibold">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        offer.status === 'pending'
                          ? 'bg-yellow-500'
                          : offer.status === 'accepted'
                          ? 'bg-green-600'
                          : 'bg-red-600'
                      }`}
                    >
                      {offer.status}
                    </span>
                  </td>
                  <td className="space-x-2 text-center">
                    {offer.status === 'pending' ? (
                      <>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleAccept(offer._id, offer.propertyId)}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-sm btn-error"
                          onClick={() => handleReject(offer._id)}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400 italic">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RequestedProperties;
