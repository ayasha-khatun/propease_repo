import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MySoldProperties = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [soldProperties, setSoldProperties] = useState([]);
  const [totalSoldAmount, setTotalSoldAmount] = useState(0);

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/offers/sold/${user.email}`)
        .then(res => {
          setSoldProperties(res.data);
          const total = res.data.reduce(
            (sum, offer) => sum + Number(offer.offerAmount),
            0
          );
          setTotalSoldAmount(total);
        })
        .catch(err => console.error("Error fetching sold properties:", err));
    }
  }, [user?.email, axiosSecure]);

  return (
    <div className="p-6 
      bg-white dark:bg-slate-900 
      text-gray-900 dark:text-gray-200 
      rounded-lg shadow-md">

      <h2 className="text-2xl font-bold text-center mb-4">
        My Sold Properties
      </h2>

      {/* Total sold amount */}
      <div className="text-center mb-6">
        <p className="text-lg font-semibold">
          Total Sold Amount:{" "}
          <span className="text-green-600 dark:text-green-400">
            ${totalSoldAmount}
          </span>
        </p>
      </div>

      {soldProperties.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No sold properties yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table
            className="
              table w-full border 
              border-gray-300 dark:border-gray-700
            "
          >
            <thead>
              <tr
                className="
                  bg-gray-100 dark:bg-slate-800 
                  text-gray-900 dark:text-gray-200
                "
              >
                <th>Property Title</th>
                <th>Location</th>
                <th>Buyer Name</th>
                <th>Buyer Email</th>
                <th>Sold Price</th>
              </tr>
            </thead>

            <tbody>
              {soldProperties.map(offer => (
                <tr
                  key={offer._id}
                  className="
                    hover:bg-gray-50 dark:hover:bg-slate-700
                    border-b border-gray-200 dark:border-gray-700
                  "
                >
                  <td>{offer.propertyTitle}</td>
                  <td>{offer.propertyLocation}</td>
                  <td>{offer.buyerName}</td>
                  <td>{offer.buyerEmail}</td>
                  <td className="font-semibold text-green-600 dark:text-green-400">
                    ${offer.offerAmount}
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

export default MySoldProperties;
