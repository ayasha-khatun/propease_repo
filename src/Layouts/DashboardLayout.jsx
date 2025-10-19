import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [role, setRole] = useState(null); // null = loading

  // ✅ Fetch user role
  useEffect(() => {
    if (!user?.email) return; // stop if not logged in

    const fetchRole = async () => {
      try {
        const res = await axiosSecure.get(`/users/role/${user.email}`);
        setRole(res.data?.role || "user"); // default fallback
      } catch (err) {
        console.error("Role fetch error:", err);
        setRole("user"); // fallback if error
      }
    };

    fetchRole();
  }, [user?.email, axiosSecure]);

  // ✅ Logout handler
  const handleLogout = async () => {
    try {
      await logout();
      console.log("Logged out");
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ Show loading spinner until role is determined
  if (role === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Top Navbar (for mobile) */}
        <div className="w-full navbar bg-base-200 lg:hidden">
          <div className="flex-none">
            <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2 font-bold">Dashboard</div>
        </div>

        {/* Main content */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <li className="mb-2 text-lg font-semibold">Dashboard Menu</li>

          {/* User Menu */}
          {role === "user" && (
            <>
            <li>
                <NavLink to="/dashboard/user/dashboard">User Dashboard</NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/user/profile">My Profile</NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/user/wishlist">Wishlist</NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/user/property-bought">
                  Property Bought
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/user/my-reviews">My Reviews</NavLink>
              </li>
            </>
          )}

          {/* Agent Menu */}
          {role === "agent" && (
            <>
             <li>
                <NavLink to="/dashboard/agent/dashboard">Agent Dashboard</NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/agent/profile">Agent Profile</NavLink>
              </li>
             
              <li>
                <NavLink to="/dashboard/agent/add-property">Add Property</NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/agent/my-properties">
                  My Added Properties
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/agent/sold-properties">
                  My Sold Properties
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/agent/requests">Requested Properties</NavLink>
              </li>
            </>
          )}

          {/* Admin Menu */}
          {role === "admin" && (
            <>
            <li>
                <NavLink to="/dashboard/admin/dashboard">Admin Dashboard</NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/admin/profile">Admin Profile</NavLink>
              </li>
              
              <li>
                <NavLink to="/dashboard/admin/manage-users">Manage Users</NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/admin/manage-properties">
                  Manage Properties
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/admin/manage-reviews">Manage Reviews</NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/admin/advertise">Advertise Property</NavLink>
              </li>
            </>
          )}

          <div className="divider"></div>
          <li>
            <NavLink to="/">Back to Home</NavLink>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
