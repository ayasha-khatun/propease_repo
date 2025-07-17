import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router';
import useAuth from '../hooks/useAuth';
import useAxiosSecure from '../hooks/useAxiosSecure';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [role, setRole] = useState(null);

  // Fetch user role from backend
  useEffect(() => {
  if (user?.email) {
    axiosSecure.get(`/users/role/${user.email}`)
      .then(res => setRole(res.data.role))
      .catch(err => {
        console.error("Role fetch error:", err);
        setRole(null); // fallback
      });
  }
}, [user?.email, axiosSecure]);

  const handleLogout = () => {
    logout()
      .then(() => console.log("Logged out"))
      .catch(console.error);
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar for small devices */}
        <div className="w-full navbar bg-base-200 lg:hidden">
          <div className="flex-none">
            <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2 font-bold">Dashboard</div>
        </div>

        {/* Main Content */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>

      <div className="drawer-side">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <li className="mb-2 text-lg font-semibold">Dashboard Menu</li>

          {/* ✅ User Role Routes */}
          {role === 'user' && (
            <>
              <li><NavLink to="/dashboard/user/profile">My Profile</NavLink></li>
              <li><NavLink to="/dashboard/user/wishlist">Wishlist</NavLink></li>
              <li><NavLink to="/dashboard/user/property-bought">Property Bought</NavLink></li>
              <li><NavLink to="/dashboard/user/my-reviews">My Reviews</NavLink></li>
            </>
          )}

          {/* ✅ Agent Role Routes */}
          {role === 'agent' && (
            <>
              <li><NavLink to="/dashboard/agent/profile">Agent Profile</NavLink></li>
              <li><NavLink to="/dashboard/agent/add-property">Add Property</NavLink></li>
              <li><NavLink to="/dashboard/agent/my-properties">My Added Properties</NavLink></li>
              <li><NavLink to="/dashboard/agent/sold-properties">My Sold Properties</NavLink></li>
              <li><NavLink to="/dashboard/agent/requests">Requested Properties</NavLink></li>
            </>
          )}

          {/* ✅ Admin Role Routes */}
          {role === 'admin' && (
            <>
              <li><NavLink to="/dashboard/admin/profile">Admin Profile</NavLink></li>
              <li><NavLink to="/dashboard/admin/manage-users">Manage Users</NavLink></li>
              <li><NavLink to="/dashboard/admin/manage-properties">Manage Properties</NavLink></li>
              <li><NavLink to="/dashboard/admin/manage-reviews">Manage Reviews</NavLink></li>
              <li><NavLink to="/dashboard/admin/advertise">Advertise Property</NavLink></li>
            </>
          )}

          <div className="divider"></div>
          <li><NavLink to="/">Back to Home</NavLink></li>
          <li><button onClick={handleLogout}>Logout</button></li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
