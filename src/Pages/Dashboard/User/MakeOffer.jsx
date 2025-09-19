import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useRole from "../../../hooks/useRole";

const MakeOffer = () => {
  const { id } = useParams(); // propertyId
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { role, loading } = useRole();
  const [property, setProperty] = useState(null);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  // Fetch property
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axiosSecure.get(`/properties/${id}`);
        setProperty(res.data);
      } catch (err) {
        console.error("Property fetch error:", err);
      }
    };
    if (id) fetchProperty();
  }, [id, axiosSecure]);

  const handleOffer = async (e) => {
    e.preventDefault();

    if (loading) {
      return Swal.fire("Please wait", "Checking your role...", "info");
    }

    if (role !== "user") {
      return Swal.fire("Permission Denied", "Only users can make an offer!", "error");
    }

    const offerValue = Number(amount);
    if (!offerValue || isNaN(offerValue)) {
      return Swal.fire("Invalid", "Please enter a valid offer amount", "error");
    }

    if (property) {
      if (offerValue < property.minPrice || offerValue > property.maxPrice) {
        return Swal.fire(
          "Invalid Offer",
          `Your offer must be between $${property.minPrice} and $${property.maxPrice}`,
          "error"
        );
      }
    }

    const offerData = {
      propertyId: id,
      propertyTitle: property?.title,
      propertyLocation: property?.location,
      agentName: property?.agentName,
      agentEmail: property?.agentEmail,
      buyerName: user?.displayName,
      buyerEmail: user?.email,
      offerAmount: offerValue,
      status: "pending", // will show in "Property Bought" as pending
      date,
    };

    try {
      const res = await axiosSecure.post("/offers", offerData);

      if (res.data.insertedId) {
        Swal.fire("✅ Success", "Offer submitted successfully!", "success");
        setAmount("");
        setDate("");
      } else if (res.data.alreadyOffered) {
        Swal.fire("ℹ️ Info", "You already made an offer for this property.", "info");
      } else if (res.data.error) {
        Swal.fire("❌ Error", res.data.error, "error");
      } else {
        Swal.fire("❌ Error", "Something went wrong.", "error");
      }
    } catch (error) {
      console.error("Offer error:", error);
      Swal.fire("Error", "Failed to submit offer.", "error");
    }
  };

  if (!property) {
    return <p className="text-center mt-10">Loading property details...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-semibold mb-6">Make an Offer</h2>
      <form onSubmit={handleOffer} className="space-y-4">
        <input type="text" value={property.title} readOnly className="w-full border px-4 py-2 rounded bg-gray-100" />
        <input type="text" value={property.location} readOnly className="w-full border px-4 py-2 rounded bg-gray-100" />
        <input type="text" value={property.agentName} readOnly className="w-full border px-4 py-2 rounded bg-gray-100" />
        <input
          type="number"
          placeholder={`Enter amount ($${property.minPrice} - $${property.maxPrice})`}
          className="w-full border px-4 py-2 rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input type="email" value={user?.email} readOnly className="w-full border px-4 py-2 rounded bg-gray-100" />
        <input type="text" value={user?.displayName} readOnly className="w-full border px-4 py-2 rounded bg-gray-100" />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Submit Offer
        </button>
      </form>
    </div>
  );
};

export default MakeOffer;
