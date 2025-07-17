import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';

const RequestedProperties = () => {
  const { user } = useAuth;
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:5000/offers/agent/${user.email}`)
        .then((res) => setOffers(res.data))
        .catch((err) => console.error('Offer fetch error:', err));
    }
  }, [user]);


  const handleAccept = async (offerId, propertyId) => {
    try {
      const res = await axios.patch(`http://localhost:5000/offer/accept/${offerId}`, { propertyId });
      if (res.data.modifiedCount > 0 || res.data.statusUpdated) {
        Swal.fire('Accepted!', 'The offer has been accepted.', 'success');
        // refetch data
        const updated = await axios.get(`http://localhost:5000/offers/agent/${user.email}`);
        setOffers(updated.data);
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
        const updated = await axios.get(`http://localhost:5000/offers/agent/${user.email}`);
        setOffers(updated.data);
      }
    } catch (err) {
      console.error('Reject offer error:', err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Requested Properties</h2>

      {offers.length === 0 ? (
        <p>No offers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Location</th>
                <th className="px-4 py-2 border">Buyer Name</th>
                <th className="px-4 py-2 border">Buyer Email</th>
                <th className="px-4 py-2 border">Offer Price</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer, index) => (
                <tr key={offer._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{offer.title}</td>
                  <td className="px-4 py-2 border">{offer.location}</td>
                  <td className="px-4 py-2 border">{offer.buyerName}</td>
                  <td className="px-4 py-2 border">{offer.buyerEmail}</td>
                  <td className="px-4 py-2 border">${offer.offerAmount}</td>
                  <td className="px-4 py-2 border capitalize">{offer.status}</td>
                  <td className="px-4 py-2 border space-x-2">
                    {offer.status === 'pending' ? (
                      <>
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded"
                          onClick={() => handleAccept(offer._id, offer.propertyId)}
                        >
                          Accept
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded"
                          onClick={() => handleReject(offer._id)}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className={`font-semibold ${offer.status === 'accepted' ? 'text-green-600' : 'text-red-600'}`}>
                        {offer.status}
                      </span>
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
