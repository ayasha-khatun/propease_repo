import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const AdminOverview = () => {
  const axiosSecure = useAxiosSecure();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch Overview Function
  const fetchOverview = async () => {
    try {
      setLoading(true);

      const [usersRes, propertiesRes, reviewsRes] = await Promise.all([
        axiosSecure.get("/users/admin"),
        axiosSecure.get("/admin/properties"),
        axiosSecure.get("/admin/reviews"),
      ]);

      const users = usersRes.data || [];
      const properties = propertiesRes.data || [];
      const reviews = reviewsRes.data || [];

      const totalUsers = users.length;
      const totalAdmins = users.filter((u) => u.role === "admin").length;
      const totalAgents = users.filter((u) => u.role === "agent").length;
      const totalFraud = users.filter((u) => u.role === "fraud").length;

      const totalProperties = properties.length;
      const verifiedProperties = properties.filter(
        (p) => p.verificationStatus === "verified"
      ).length;
      const advertisedProperties = properties.filter(
        (p) => p.isAdvertised
      ).length;
      const totalReviews = reviews.length;

      setStats({
        totalUsers,
        totalAdmins,
        totalAgents,
        totalFraud,
        totalProperties,
        verifiedProperties,
        advertisedProperties,
        totalReviews,
      });
    } catch (error) {
      console.error("Error fetching overview:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();

    // ⏱ Optional: Auto-refresh every 10 seconds for live updates
    const interval = setInterval(fetchOverview, 10000);
    return () => clearInterval(interval);
  }, [axiosSecure]);

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 dark:text-gray-300 animate-pulse">
          Loading overview...
        </p>
      </div>
    );
  }

  // Chart Data
  const userData = [
    { name: "Admins", value: stats.totalAdmins },
    { name: "Agents", value: stats.totalAgents },
    { name: "Fraud", value: stats.totalFraud },
  ];

  const propertyData = [
    { name: "Verified", value: stats.verifiedProperties },
    { name: "Advertised", value: stats.advertisedProperties },
    {
      name: "Other",
      value: stats.totalProperties - stats.verifiedProperties,
    },
  ];

  const lineData = [
    {
      name: "Overview",
      Verified: stats.verifiedProperties,
      Advertised: stats.advertisedProperties,
      Reviews: stats.totalReviews,
    },
  ];

  const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* User Bar Chart */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
        <h3 className="text-gray-700 dark:text-gray-200 text-lg font-semibold mb-4">
          Users by Role
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={userData}>
            <XAxis dataKey="name" stroke="#aaa" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Property Pie Chart */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
        <h3 className="text-gray-700 dark:text-gray-200 text-lg font-semibold mb-4">
          Properties Overview
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={propertyData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {propertyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 lg:col-span-2">
        <h3 className="text-gray-700 dark:text-gray-200 text-lg font-semibold mb-4">
          Property & Reviews Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#aaa" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Verified" stroke="#00C49F" />
            <Line type="monotone" dataKey="Advertised" stroke="#FFBB28" />
            <Line type="monotone" dataKey="Reviews" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Cards */}
      <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
        <StatCard title="Total Users" value={stats.totalUsers} />
        <StatCard title="Total Properties" value={stats.totalProperties} />
        <StatCard title="Total Reviews" value={stats.totalReviews} />
        <StatCard title="Advertised Properties" value={stats.advertisedProperties} />
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 flex flex-col items-center justify-center transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
    <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-2">{title}</h3>
    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
  </div>
);

export default AdminOverview;
