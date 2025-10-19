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
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAgents: 0,
    totalAdmins: 0,
    totalFraud: 0,
    totalProperties: 0,
    verifiedProperties: 0,
    advertisedProperties: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);

        const usersRes = await axiosSecure.get("/users");
        const users = usersRes.data;
        const totalUsers = users.length;
        const totalAdmins = users.filter((u) => u.role === "admin").length;
        const totalAgents = users.filter((u) => u.role === "agent").length;
        const totalFraud = users.filter((u) => u.role === "fraud").length;

        const propertiesRes = await axiosSecure.get("/admin/properties");
        const properties = propertiesRes.data;
        const totalProperties = properties.length;
        const verifiedProperties = properties.filter(
          (p) => p.verificationStatus === "verified"
        ).length;
        const advertisedProperties = properties.filter((p) => p.isAdvertised)
          .length;

        const reviewsRes = await axiosSecure.get("/admin/reviews");
        const totalReviews = reviewsRes.data.length;

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

    fetchOverview();
  }, [axiosSecure]);

  if (loading) {
    return (
      <p className="text-center mt-10 text-lg animate-pulse">
        Loading overview...
      </p>
    );
  }

  // Prepare data for charts
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
      name: "Stats",
      Verified: stats.verifiedProperties,
      Advertised: stats.advertisedProperties,
      Reviews: stats.totalReviews,
    },
  ];

  const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* User Bar Chart */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-gray-700 text-lg font-semibold mb-4">
          Users by Role
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={userData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Property Pie Chart */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-gray-700 text-lg font-semibold mb-4">
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
              fill="#8884d8"
              label
            >
              {propertyData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}
      <div className="bg-white shadow-lg rounded-xl p-6 lg:col-span-2">
        <h3 className="text-gray-700 text-lg font-semibold mb-4">
          Property & Reviews Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
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
  <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center justify-center transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
    <h3 className="text-gray-500 text-sm mb-2">{title}</h3>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

export default AdminOverview;
