import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MySoldProperties = () => {
  const { user } = useAuth(); // agent info
  const axiosSecure = useAxiosSecure();
  const [soldProperties, setSoldProperties] = useState([]);

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/offers/sold/${user.email}`)
        .then(res => setSoldProperties(res.data))
        .catch(err => console.error("Error fetching sold properties:", err));
    }
  }, [user?.email, axiosSecure]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6">My Sold Properties</h2>

      {soldProperties.length === 0 ? (
        <p className="text-center text-gray-500">No sold properties yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th>Property Title</th>
                <th>Location</th>
                <th>Buyer Name</th>
                <th>Buyer Email</th>
                <th>Sold Price</th>
              </tr>
            </thead>
            <tbody>
              {soldProperties.map(offer => (
                <tr key={offer._id} className="hover:bg-gray-50">
                  <td>{offer.title}</td>
                  <td>{offer.location}</td>
                  <td>{offer.buyerName}</td>
                  <td>{offer.buyerEmail}</td>
                  <td>${offer.offeredAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MySoldProperties;
