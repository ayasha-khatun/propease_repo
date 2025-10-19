// src/components/Shared/Navbar.jsx
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout().then(() => localStorage.removeItem("access-token"));
  };

  const navItems = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-primary font-bold"
              : "hover:text-primary transition-colors"
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/all-properties"
          className={({ isActive }) =>
            isActive
              ? "text-primary font-bold"
              : "hover:text-primary transition-colors"
          }
        >
          All Properties
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive
              ? "text-primary font-bold"
              : "hover:text-primary transition-colors"
          }
        >
          Contact
        </NavLink>
      </li>
      {user && (
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "text-primary font-bold"
                : "hover:text-primary transition-colors"
            }
          >
            Dashboard
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="navbar h-16 flex justify-between items-center">
            {/* Logo */}
            <div className="navbar-start">
              <Link to="/" className="text-3xl font-bold text-primary">
                LOGO
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex navbar-center">
              <ul className="menu menu-horizontal space-x-4">{navItems}</ul>
            </div>

            {/* Right Section */}
            <div className="navbar-end flex items-center gap-3">
              {/* Mobile Hamburger */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="px-3 py-1 rounded border bg-gray-200 text-black"
                >
                  ☰
                </button>
              </div>

              {/* Auth Buttons */}
              {user ? (
                <>
                  <img
                    src={user.photoURL || "/default-avatar.png"}
                    alt={user.displayName || "User"}
                    className="w-10 h-10 rounded-full object-cover border-2 border-primary hidden sm:block"
                  />
                  <button
                    onClick={handleLogout}
                    className="btn bg-gradient-to-r from-primary to-secondary text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="btn bg-gradient-to-r from-primary to-secondary text-white"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-2 p-4 bg-gray-100 rounded">
              <ul className="flex flex-col gap-3">{navItems}</ul>
            </div>
          )}
        </div>
      </div>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;
