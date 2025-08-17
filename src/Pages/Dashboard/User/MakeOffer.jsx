import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';

const MakeOffer = () => {
  const { id } = useParams(); // propertyId
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [amount, setAmount] = useState('');

  const handleOffer = async (e) => {
    e.preventDefault();

    if (!amount || isNaN(amount)) {
      return Swal.fire('Invalid', 'Please enter a valid offer amount', 'error');
    }

    const offerData = {
      propertyId: id,
      buyerName: user.displayName,
      buyerEmail: user.email,
      offerAmount: parseFloat(amount),
    };

    try {
      const res = await axiosSecure.post('/offers', offerData);
      if (res.data.insertedId) {
        Swal.fire('Success', 'Offer submitted successfully!', 'success');
        setAmount('');
      }
    } catch (error) {
      if (error.response?.status === 409) {
        Swal.fire('Info', 'You already made an offer for this property.', 'info');
      } else {
        Swal.fire('Error', 'Failed to submit offer.', 'error');
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Make an Offer</h2>
      <form onSubmit={handleOffer}>
        <input
          type="number"
          placeholder="Enter your offer amount"
          className="w-full border px-4 py-2 mb-4 rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit Offer
        </button>
      </form>
    </div>
  );
};

export default MakeOffer;
