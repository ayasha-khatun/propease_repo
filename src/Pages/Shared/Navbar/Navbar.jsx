import React from "react";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout().then(() => {
      localStorage.removeItem("access-token");
    });
  };

  const navItems = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "text-primary font-semibold" : "hover:text-primary"
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/all-properties"
          className={({ isActive }) =>
            isActive ? "text-primary font-semibold" : "hover:text-primary"
          }
        >
          All Properties
        </NavLink>
      </li>
      {user && (
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "text-primary font-semibold" : "hover:text-primary"
            }
          >
            Dashboard
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <div className="navbar bg-[#4682A9] text-white px-6 shadow-md fixed top-0 left-0 right-0 z-50 h-16">
      {/* Left - Logo */}
      <div className="navbar-start h-full">
        <Link to="/" className="flex items-center h-full">
          <img
            src="https://i.ibb.co.com/ymC5YNfw/colored-logo.png"
            alt="Propease Logo"
            className="max-h-full w-auto" // navbar height maintain + logo boro
          />
        </Link>
      </div>

      {/* Center - Nav Items */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal space-x-4 font-medium">
          {navItems}
        </ul>
      </div>

      {/* Right - Auth Button */}
      <div className="navbar-end">
        {user ? (
          <button
            onClick={handleLogout}
            className="btn btn-sm bg-primary border-none hover:bg-primary/80 text-white"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="btn btn-sm bg-primary border-none hover:bg-primary/80 text-white"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
