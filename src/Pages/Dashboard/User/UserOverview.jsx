
import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  FaHeart,
  FaCommentDots,
  FaDollarSign,
  FaCheckCircle,
  FaHome,
  FaClock,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#FFC107", "#4CAF50", "#2196F3"]; // Pending, Accepted, Bought

const UserOverview = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [stats, setStats] = useState({
    wishlist: 0,
    reviews: 0,
    totalOffers: 0,
    pendingOffers: 0,
    acceptedOffers: 0,
    boughtProperties: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      if (!user?.email) return;

      try {
        setLoading(true);

        const wishlistRes = await axiosSecure.get(`/wishlist?email=${user.email}`);
        const wishlistCount = wishlistRes.data.length;

        const reviewsRes = await axiosSecure.get(`/reviews/user/${user.email}`);
        const reviewsCount = reviewsRes.data.length;

        const offersRes = await axiosSecure.get(`/offers?email=${user.email}`);
        const offers = offersRes.data;
        const totalOffers = offers.length;
        const pendingOffers = offers.filter(o => o.status === "pending").length;
        const acceptedOffers = offers.filter(o => o.status === "accepted").length;
        const boughtProperties = offers.filter(o => o.status === "bought").length;

        setStats({
          wishlist: wishlistCount,
          reviews: reviewsCount,
          totalOffers,
          pendingOffers,
          acceptedOffers,
          boughtProperties,
        });
      } catch (error) {
        console.error("Error fetching user overview:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [user?.email, axiosSecure]);

  if (loading) {
    return <p className="text-center mt-10 text-lg animate-pulse">Loading overview...</p>;
  }

  const cards = [
    { title: "Wishlist Items", value: stats.wishlist, icon: <FaHeart size={30} className="text-red-500" /> },
    { title: "My Reviews", value: stats.reviews, icon: <FaCommentDots size={30} className="text-blue-500" /> },
    { title: "Total Offers", value: stats.totalOffers, icon: <FaDollarSign size={30} className="text-green-500" /> },
    { title: "Pending Offers", value: stats.pendingOffers, icon: <FaClock size={30} className="text-yellow-500" /> },
    { title: "Accepted Offers", value: stats.acceptedOffers, icon: <FaCheckCircle size={30} className="text-purple-500" /> },
    { title: "Bought Properties", value: stats.boughtProperties, icon: <FaHome size={30} className="text-indigo-500" /> },
  ];

  // ✅ PIE DATA (Offers Breakdown)
  const pieData = [
    { name: "Pending", value: stats.pendingOffers },
    { name: "Accepted", value: stats.acceptedOffers },
    { name: "Bought", value: stats.boughtProperties },
  ];

  // ✅ BAR DATA (General Comparison)
  const barData = [
    { name: "Wishlist", value: stats.wishlist },
    { name: "Reviews", value: stats.reviews },
    { name: "Offers", value: stats.totalOffers },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center justify-center transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
          >
            <div className="mb-4">{card.icon}</div>
            <h3 className="text-gray-500 text-sm mb-2">{card.title}</h3>
            <p className="text-3xl font-extrabold text-gray-800">{card.value}</p>
          </div>
        ))}
      </div>

      {/* PIE CHART - Offers Breakdown */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-center text-xl font-bold mb-4">Offers Status Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* BAR CHART - General User Activity */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-center text-xl font-bold mb-4">User Activity Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserOverview;
