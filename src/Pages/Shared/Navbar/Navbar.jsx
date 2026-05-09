import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, User } from "lucide-react";
import useAuth from "../../../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = () => {
    logout().then(() => localStorage.removeItem("access-token"));
    setIsProfileOpen(false);
  };

  // Scroll shadow effect
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "relative text-primary font-semibold after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-primary after:rounded-full"
      : "relative text-gray-600 dark:text-gray-300 font-medium hover:text-primary dark:hover:text-primary transition-colors duration-200 after:absolute after:bottom-[-4px] after:left-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-primary after:rounded-full after:transition-all after:duration-300";

  const mobileNavLinkClass = ({ isActive }) =>
    isActive
      ? "flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary/10 text-primary font-semibold"
      : "flex items-center gap-2 px-4 py-2.5 rounded-lg text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md transition-all duration-300 ${
          isScrolled ? "shadow-lg shadow-black/5 dark:shadow-black/20" : "border-b border-gray-100 dark:border-gray-800"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-1 shrink-0">
              <span className="text-2xl font-extrabold tracking-tight">
                <span className="text-primary">PROP</span>
                <span className="text-secondary">EASE</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-8">
              <NavLink to="/" className={navLinkClass}>Home</NavLink>
              <NavLink to="/all-properties" className={navLinkClass}>All Properties</NavLink>
              <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
              {user && (
                <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
              )}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {user ? (
                /* Profile Dropdown */
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800"
                  >
                    <img
                      src={user.photoURL || "/default-avatar.png"}
                      alt={user.displayName || "User"}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/30"
                    />
                    <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                      {user.displayName?.split(" ")[0] || "Account"}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-gray-400 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1.5 overflow-hidden">
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <LayoutDashboard size={15} className="text-primary" />
                        Dashboard
                      </Link>

                      <Link
                        to="/dashboard/my-profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <User size={15} className="text-primary" />
                        My Profile
                      </Link>

                      <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut size={15} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 active:scale-95"
                >
                  Login
                </Link>
              )}

              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col gap-1">
            <NavLink to="/" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/all-properties" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
              All Properties
            </NavLink>
            <NavLink to="/contact" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
              Contact
            </NavLink>
            {user && (
              <NavLink to="/dashboard" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
                Dashboard
              </NavLink>
            )}
          </nav>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;
