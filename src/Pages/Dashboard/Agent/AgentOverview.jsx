// src/Pages/Dashboard/Agent/AgentOverviewWithCharts.jsx
import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  FaHome,
  FaCheckCircle,
  FaBullhorn,
  FaDollarSign,
  FaStar,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"]; // palette

const AgentOverview = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [stats, setStats] = useState({
    totalProperties: 0,
    verifiedProperties: 0,
    advertisedProperties: 0,
    totalSoldProperties: 0,
    totalEarnings: 0,
    totalOffers: 0,
  });
  const [loading, setLoading] = useState(true);

  // raw data holders
  const [propertiesList, setPropertiesList] = useState([]);
  const [soldOffers, setSoldOffers] = useState([]);
  const [offersList, setOffersList] = useState([]);

  useEffect(() => {
    const fetchOverview = async () => {
      if (!user?.email) return;
      try {
        setLoading(true);

        // 1) agent properties
        const propRes = await axiosSecure.get(`/properties/agent/${user.email}`);
        const properties = propRes.data || [];
        setPropertiesList(properties);

        const totalProperties = properties.length;
        const verifiedProperties = properties.filter(
          (p) => p.verificationStatus === "verified"
        ).length;
        const advertisedProperties = properties.filter((p) => p.isAdvertised)
          .length;

        // 2) sold offers (bought) for this agent
        const soldRes = await axiosSecure.get(`/offers/sold/${user.email}`);
        const sold = soldRes.data || [];
        setSoldOffers(sold);
        const totalSoldProperties = sold.length;
        const totalEarnings = sold.reduce(
          (sum, s) => sum + Number(s.offerAmount || 0),
          0
        );

        // 3) offers received for agent properties
        const offersRes = await axiosSecure.get(`/offers/agent/${user.email}`);
        const offers = offersRes.data || [];
        setOffersList(offers);
        const totalOffers = offers.length;

        setStats({
          totalProperties,
          verifiedProperties,
          advertisedProperties,
          totalSoldProperties,
          totalEarnings,
          totalOffers,
        });
      } catch (err) {
        console.error("Agent overview fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [user?.email, axiosSecure]);

  if (loading) {
    return <p className="text-center mt-10 text-lg animate-pulse">Loading overview...</p>;
  }

  // -------------------------
  // Prepare chart datasets
  // -------------------------

  // Pie: properties breakdown (verified / advertised / others)
  const othersCount =
    stats.totalProperties - stats.verifiedProperties - stats.advertisedProperties;
  const pieData = [
    { name: "Verified", value: stats.verifiedProperties },
    { name: "Advertised", value: stats.advertisedProperties },
    { name: "Others", value: Math.max(0, othersCount) },
  ];

  // Bar: offers vs properties counts
  const barData = [
    { name: "Properties", value: stats.totalProperties },
    { name: "Offers", value: stats.totalOffers },
    { name: "Sold", value: stats.totalSoldProperties },
  ];

  // Line: earnings over recent sales (by date or index)
  // Map soldOffers to last 8 sales (sorted by createdAt if available)
  const lineData = (() => {
    if (!soldOffers || soldOffers.length === 0) return [];
    // attempt to sort by createdAt or date field, fallback to insertion order
    const sorted = [...soldOffers].sort((a, b) => {
      const da = a.createdAt || a.date || a.updatedAt || a.sellDate || null;
      const db = b.createdAt || b.date || b.updatedAt || b.sellDate || null;
      if (da && db) return new Date(da) - new Date(db);
      return 0;
    });
    // keep last 8
    const recent = sorted.slice(-8);
    return recent.map((s, idx) => ({
      name:
        s.createdAt || s.date
          ? new Date(s.createdAt || s.date).toLocaleDateString()
          : `Sale ${idx + 1}`,
      earnings: Number(s.offerAmount || 0),
    }));
  })();

  // -------------------------
  // UI: header cards + charts
  // -------------------------
  const cards = [
    {
      title: "Total Properties",
      value: stats.totalProperties,
      icon: <FaHome size={28} className="text-blue-500" />,
      accent: "bg-blue-50",
    },
    {
      title: "Verified",
      value: stats.verifiedProperties,
      icon: <FaCheckCircle size={28} className="text-green-500" />,
      accent: "bg-green-50",
    },
    {
      title: "Advertised",
      value: stats.advertisedProperties,
      icon: <FaBullhorn size={28} className="text-purple-500" />,
      accent: "bg-purple-50",
    },
    {
      title: "Sold",
      value: stats.totalSoldProperties,
      icon: <FaStar size={28} className="text-yellow-500" />,
      accent: "bg-yellow-50",
    },
    {
      title: "Earnings ($)",
      value: stats.totalEarnings,
      icon: <FaDollarSign size={28} className="text-green-600" />,
      accent: "bg-emerald-50",
    },
    {
      title: "Offers",
      value: stats.totalOffers,
      icon: <FaStar size={28} className="text-pink-500" />,
      accent: "bg-pink-50",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <div
            key={i}
            className="flex items-center gap-4 bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            <div className={`p-3 rounded-lg ${c.accent}`}>{c.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{c.title}</p>
              <p className="text-2xl font-bold text-gray-800">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Properties Breakdown</h3>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={90}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {pieData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-xl shadow-sm lg:col-span-1">
          <h3 className="text-lg font-semibold mb-2">Counts: Properties / Offers / Sold</h3>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <ReTooltip />
                <Bar dataKey="value" fill="#4F46E5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Recent Sales (Earnings)</h3>
          <p className="text-sm text-gray-500 mb-3">
            Last {lineData.length || 0} sales (by date). Empty if no sales yet.
          </p>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ReTooltip />
                <Legend />
                <Line type="monotone" dataKey="earnings" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Optional table: recent sold offers (compact) */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-3">Recent Sold Properties</h3>
        {soldOffers.length === 0 ? (
          <p className="text-gray-500">No sold properties yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-sm text-gray-600 border-b">
                <tr>
                  <th className="py-2">#</th>
                  <th className="py-2">Property</th>
                  <th className="py-2">Buyer</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {soldOffers.slice(-8).reverse().map((s, idx) => (
                  <tr key={s._id || idx} className="border-b">
                    <td className="py-2">{idx + 1}</td>
                    <td className="py-2">{s.propertyTitle || s.propertyId}</td>
                    <td className="py-2">{s.buyerName || s.buyerEmail}</td>
                    <td className="py-2 font-medium">${Number(s.offerAmount || 0)}</td>
                    <td className="py-2 text-sm text-gray-500">
                      {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : s.date ? new Date(s.date).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentOverview;
